<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Department_Curriculum;
use App\Models\ProgramOfferings;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\Departments;
use DeepSeekClient;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\CourseSubject;
use App\Models\Subject;
use App\Models\CourseSections;
use App\Models\DepartmentCurriculum;
use App\Models\DepartmentRoom;

use App\Mail\EmailAdmins;
use Illuminate\Support\Facades\Mail;
class DataCreate extends Controller
{
    public function createFeedback(Request $request)
    {
        $validated = $request->validate([
            'feedback' => 'required|string|max:255',
            'scheduleID' => 'required|integer|exists:schedules,id',
        ]);

        try {
            $sched = DB::table('schedules')
                ->where('id', $request->scheduleID)
                ->first();
            if ($request->input('sender')){
                $feedbackCount = DB::table('course_subject_feedback')
                    ->where('sectionID', $sched->sectionID)
                    ->count();
                if ($feedbackCount > 3) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Feedback limit reached for this section.'
                    ], 400);
                }
                DB::table('course_subject_feedback')->insert([
                    'scheduleID' => $request->input('scheduleID'),
                    'sectionID' => $sched->sectionID,
                    'subjectID' => $sched->subjectID,
                    'feedback' => $validated['feedback'],
                    'departmentID' => $sched->departmentID,
                ]);
            } else {
                $feedbackCount = DB::table('instructor_feedback')
                    ->where('instructor_id', $sched->instructor_id)
                    ->count();
                if ($feedbackCount > 3) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Feedback limit reached for this section.'
                    ], 400);
                }
                DB::table('instructor_feedback')->insert([
                    'scheduleID' => $request->input('scheduleID'),
                    'instructor_id' => $sched->instructor_id,
                    'subjectID' => $sched->subjectID,
                    'feedback' => $validated['feedback'],
                    'departmentID' => $sched->departmentID,
                ]);
            }
            
    
            return response()->json([
                'success' => true,
                'message' => 'Feedback submitted successfully'
            ], 201);
        }catch (error){
            return response()->json([
                'success' => false,
                'message' => 'Error submitting feedback: ' . $error->getMessage()
            ], 500);
        }
    }
    public function assignRoomToDepartment(Request $request, $department)
    {
        \Log::error($request);
        $validated = $request->validate([
            'rooms' => 'required|array',
            'rooms.*' => 'integer',
        ]);
        
        foreach ($validated['rooms'] as $roomID) {
            \Log::error($roomID);
            DepartmentRoom::firstOrCreate([
                'departmentID' => $department,
                'roomID' => $roomID,
            ],[
                'departmentID' => $department,
                'roomID' => $roomID,
            ]);
        }

        return response()->json(['message' => 'Rooms assigned successfully'], 200);
    }
    public function createInstructor(Request $request){
        $department = auth()->user()->departmentID;
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        \Log::error("i got this far");
        $instructor = DB::table('instructors')
        ->insert([
            'name' => $validated['name'],
            'departmentID' => $department,
        ]);

        return response()->json([
            'message' => 'Instructor created successfully.',
            'data' => $request['name'],
        ], 201);
    }

    public function deleteInstructor($id){
        $instructor = DB::table('instructors')
        ->find($id);

        if (!$instructor) {
            return response()->json([
                'message' => 'Instructor not found.',
            ], 404);
        }
        DB::table('subject_instructors')
        ->where('instructor_id', $id)
        ->delete();

        DB::table('schedules')
        ->where('instructor_id', $id)
        ->delete();

        DB::table('instructors')
        ->where('id', $id)
        ->delete();

        return response()->json([
            'message' => 'Instructor deleted successfully.',
        ]);
    }
    public function assignSubjectToInstructor(Request $request)
    {
        \Log::error($request);
        // Validate request data
        $validator = Validator::make($request->all(), [
            'instructor_id' => 'required|exists:instructors,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $existingAssignment = DB::table('subject_instructors')
            ->where('instructor_id', $request->instructor_id)
            ->where('subject_code', $request->subject_id)
            ->first();

        if ($existingAssignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'This subject is already assigned to the instructor'
            ], 422);
        }

        DB::table('subject_instructors')->insert([
            'instructor_id' => $request->instructor_id,
            'subject_code' => $request->subject_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subject assigned to instructor successfully'
        ], 201);
    }
    public function removeSubjectFromInstructor(Request $request)
    {\Log::error($request);
        // Validate request data
        $validator = Validator::make($request->all(), [
            'instructor_id' => 'required|exists:instructors,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find and delete the assignment
        $assignment = DB::table('subject_instructors')
            ->where('instructor_id', $request->instructor_id)
            ->where('subject_code', $request->subject_id)
            ->first();


        DB::table('subject_instructors')
        ->where('instructor_id', $request->instructor_id)
        ->where('subject_code', $request->subject_id)
        ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Subject removed from instructor successfully'
        ], 200);
    }

    public function createDepartment(Request $request)
    {
        \Log::error("Hello??");
        $validated = $request->validate([
            'department_short_name' => 'required|string|max:10|unique:departments,department_short_name',
            'department_full_name' => 'required|string|max:255',
            'logo_img_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = '/storage/' . $request->file('logo')->store('logos', 'public'); // Save to 'storage/app/public/logos'
        }
        try {
            $department = Departments::firstOrCreate([
                'department_short_name' => $request->input('department_short_name'),
                'department_full_name' => $request->input('department_full_name'),
            ], [
                'department_short_name' => $request->input('department_short_name'),
                'department_full_name' => $request->input('department_full_name'),
                'logo_img_path' => $logoPath,
            ]);
            $user = DB::table('users')
            ->insert([
                'name' => $request->input('admin_name'),
                'email' => $request->input('admin_email'),
                'password' => bcrypt($request->input('password')),
                'actualPassword' => $request->input('password'),
                'departmentID' => $department->id,
                'user_type' => 1,
            ]);
            
            Mail::to($request->admin_email)->send(new EmailAdmins($request->admin_name, $request->admin_email, $request->password, $request->department_full_name));
            
            if ($request->has('selectedRooms')) {
                $selectedRooms = $request->input('selectedRooms');
                foreach ($selectedRooms as $roomNumber) {
                    DB::table('department_room')->insert([
                        'departmentID' => $department->id,
                        'roomID' => $roomNumber,
                    ]);
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Department created successfully',
            ]);
        } catch (Exception $e) {
            \Log::error('Error creating department: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error creating department: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function uploadCurriculum(Request $request)
    {

        try {
            $file = $request->file('curriculum_file');
            
            $filename = time() . '_' . $file->getClientOriginalName();
            
            $path = $file->storeAs('temp', $filename);
            
            $fullPath = Storage::path($path);
            
            $fileExtension = $file->getClientOriginalExtension();
            $fileSize = $file->getSize();
            $fileName = $file->getClientOriginalName();
            
            $parsedData = $this->parseFileWithDeepSeek($fullPath, $fileExtension, $fileName, $fileSize);
            if ($parsedData) {
                $savedCurriculums = $parsedData;

                Storage::delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Curriculum successfully uploaded and processed',
                    'data' => $savedCurriculums
                ], 200);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to parse curriculum file'
            ], 422);
            
        } catch (Exception $e) {
            Log::error('Curriculum upload error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error processing curriculum: ' . $e->getMessage()
            ], 500);
        }
    }

    private function parseFileWithDeepSeek($filePath, $fileExtension, $fileName, $fileSize)
    {
        try {
            $deepseek = new \App\Libraries\DeepSeekClient();
            
            $fileInfo = [];
            
            switch (strtolower($fileExtension)) {
                case 'pdf':
                    if (class_exists('Smalot\PdfParser\Parser')) {
                        $parser = new \Smalot\PdfParser\Parser();
                        $pdf = $parser->parseFile($filePath);
                
                        // Initialize the structured object
                        $curriculumData = [
                            'normalText' => [],
                            'subjects' => [],
                        ];
                
                        // Extract plain text
                        $text = $pdf->getText();
                        $lines = explode("\n", $text); // Split text into lines
                        foreach ($lines as $line) {
                            $line = trim($line);
                            if (!empty($line)) {
                                $curriculumData['normalText'][] = $line;
                            }
                        }
                
                        // Extract tables (if any)
                        $details = $pdf->getDetails();
                        if (isset($details['Tables'])) {
                            foreach ($details['Tables'] as $table) {
                                foreach ($table as $rowIndex => $row) {
                                    if ($rowIndex === 0) {
                                        // Skip the header row
                                        continue;
                                    }
                
                                    $subjectData = [];
                                    foreach ($row as $cellIndex => $cellText) {
                                        $cellText = trim($cellText);
                
                                        // Map cell data to subject fields based on the column index
                                        switch ($cellIndex) {
                                            case 0: // CODE
                                                $subjectData['subject_code'] = $cellText;
                                                break;
                                            case 1: // COURSE TITLE
                                                $subjectData['name'] = $cellText;
                                                break;
                                            case 4: // Lec (Hours per week)
                                                $subjectData['lec'] = (int)$cellText;
                                                break;
                                            case 5: // Lab (Hours per week)
                                                $subjectData['lab'] = (int)$cellText;
                                                break;
                                            case 6: // Prerequisite/Co-requisite
                                                $subjectData['prerequisite'] = $cellText;
                                                break;
                                        }
                                    }
                
                                    // Add semester and year level dynamically
                                    $subjectData['semester'] = '1st'; // Example: Set semester dynamically
                                    $subjectData['year_level'] = 1; // Example: Set year level dynamically
                
                                    // Add the subject to the subjects array
                                    $curriculumData['subjects'][] = $subjectData;
                                }
                            }
                        }
                
                        // Save the structured data
                        $fileInfo['content'] = json_encode($curriculumData, JSON_PRETTY_PRINT);
                
                        // Log the stringified curriculum data
                        \Log::info('Curriculum Data as String: ' . $fileInfo['content']);
                    } else {
                        $fileInfo['content'] = "PDF file contents (PDF parser not available)";
                    }
                    break;
                    
                    case 'docx':

                            if (class_exists('\PhpOffice\PhpWord\IOFactory')) {
                                $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath);
                            
                                // Initialize the structured object
                                $curriculumData = [
                                    'normalText' => [],
                                    'subjects' => [],
                                ];
                            
                                $currentSemester = null; // Variable to track the current semester
                            
                                foreach ($phpWord->getSections() as $section) {
                                    foreach ($section->getElements() as $element) {
                                        \Log::info('Element type: ' . get_class($element));

                                        if ($element instanceof \PhpOffice\PhpWord\Element\TextRun || $element instanceof \PhpOffice\PhpWord\Element\Text || $element instanceof \PhpOffice\PhpWord\Element\Title) {
                                            $text = $element->getText();
                                            if (!empty($text)) {
                                                $curriculumData['normalText'][] = $text;
                                                \Log::error('Text found', [
                                                    'text' => $text
                                                ]);
                                            }
                                        } elseif ($element instanceof \PhpOffice\PhpWord\Element\Table) {
                                            foreach ($element->getRows() as $rowIndex => $row) {
                                                if ($rowIndex === 0 && $rowIndex === 1) {
                                                    // Skip the header row
                                                    continue;
                                                }
                            
                                                $subjectData = [];
                                                foreach ($row->getCells() as $cellIndex => $cell) {
                                                    $cellText = '';
                                                    foreach ($cell->getElements() as $cellElement) {
                                                        if (method_exists($cellElement, 'getText')) {
                                                            $cellText .= $cellElement->getText() . ' ';
                                                        }
                                                    }
                                                    $cellText = trim($cellText);
                            
                                                    // Map cell data to subject fields based on the column index
                                                    switch ($cellIndex) {
                                                        case 0: // CODE
                                                            $subjectData['subject_code'] = $cellText;
                                                            break;
                                                        case 1: // COURSE TITLE
                                                            $subjectData['name'] = $cellText;
                                                            break;
                                                        case 4: // Lec (Hours per week)
                                                            $subjectData['lec'] = (int)$cellText;
                                                            break;
                                                        case 5: // Lab (Hours per week)
                                                            $subjectData['lab'] = (int)$cellText;
                                                            break;
                                                        case 6: // Prerequisite/Co-requisite
                                                            $subjectData['prerequisite'] = $cellText;
                                                            break;
                                                    }
                                                }
                            
                                                // Add the subject to the subjects array
                                                $curriculumData['subjects'][] = $subjectData;
                                            }
                                        }
                                    }
                                    
                                // Example of how to handle large content (truncation logic)
                                $fileInfo['content'] = json_encode($curriculumData, JSON_PRETTY_PRINT);

                                // Log the stringified curriculum data
                                \Log::info('Curriculum Data as String: ' . $fileInfo['content']);   
                                }
                            
                            } else {
                                $fileInfo['content'] = [
                                    'error' => 'DOCX parser not available',
                                ];
                            }
                        break;
                    
                case 'csv':
                    $csvData = array_map('str_getcsv', file($filePath));
                    // Get headers
                    $headers = array_shift($csvData);
                    // Format first 50 rows in a readable way
                    $formattedData = '';
                    $rowCount = min(count($csvData), 50);
                    for ($i = 0; $i < $rowCount; $i++) {
                        $row = $csvData[$i];
                        $formattedData .= "Row " . ($i + 1) . ":\n";
                        for ($j = 0; $j < count($headers); $j++) {
                            if (isset($row[$j])) {
                                $formattedData .= "  " . $headers[$j] . ": " . $row[$j] . "\n";
                            }
                        }
                        $formattedData .= "\n";
                    }
                    $fileInfo['content'] = $formattedData;
                    break;
                    
                case 'xlsx':
                case 'xls':
                    if (class_exists('\PhpOffice\PhpSpreadsheet\IOFactory')) {
                        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);
                        $sheetData = $spreadsheet->getActiveSheet()->toArray();
                        // Format first 50 rows
                        $formattedData = '';
                        $headers = $sheetData[0];
                        $rowCount = min(count($sheetData), 50);
                        for ($i = 1; $i < $rowCount; $i++) {
                            $row = $sheetData[$i];
                            $formattedData .= "Row " . $i . ":\n";
                            for ($j = 0; $j < count($headers); $j++) {
                                if (isset($row[$j])) {
                                    $formattedData .= "  " . $headers[$j] . ": " . $row[$j] . "\n";
                                }
                            }
                            $formattedData .= "\n";
                        }
                        $fileInfo['content'] = $formattedData;
                    } else {
                        // Fallback if Excel parser not available
                        $fileInfo['content'] = "Excel file contents (Excel parser not available)";
                    }
                    break;
                    
                case 'txt':
                default:
                    // For text files, read directly but limit size
                    $text = file_get_contents($filePath);
                    // Extract first 15000 chars and last 5000 chars
                    $fileInfo['content'] = substr($text, 0, 15000);
                    if (strlen($text) > 20000) {
                        $fileInfo['content'] .= "\n[...content truncated...]\n";
                        $fileInfo['content'] .= substr($text, -5000);
                    }
                    break;
            }
            $fileInfo['name'] = $fileName;
            $fileInfo['extension'] = $fileExtension;
            $fileInfo['size'] = $fileSize;
            \Log::error($fileInfo['content']);
            // Build a prompt with file information
            $prompt = <<<PROMPT
Parse the provided curriculum file and convert it to a structured JSON format.

FILE INFORMATION:
- Name: {$fileInfo['name']}
- Type: {$fileInfo['extension']}
- Size: {$fileInfo['size']} bytes

FILE CONTENT SAMPLE:
{$fileInfo['content']}

INSTRUCTIONS:
1. Extract all curriculum information including program names, department, and subjects
2. Identify subject codes, names, semester placement, and year levels
3. Format the data according to the specified JSON structure below
4. Ensure there are no duplicate records
RESPONSE FORMAT:
{
  "curriculum":
    {
      "curriculum_name": "CURRICULUM_NAME", <- should be the program short name + year (for example: BSCS 2018-2019 Curriculum) DO NOT FORGET THE YEAR VERY IMPORTANT
      "program_name": "FULL_PROGRAM_NAME",
      "program_short_name": "PROGRAM_CODE",
      "subjects":
        {
          "subject_code": "SUBJECT_CODE",
          "semester": "SEMESTER", // "1st", "2nd", or "summer"
          "year_level": YEAR_LEVEL, // 1, 2, 3, or 4
          "name": "SUBJECT_NAME",
          "room_req": ROOM_TYPE, // 1 for lecture, 2 for laboratory
          "lec" : "LECTURE_HOURS", // 2, 3, or 0. IGNORE CELL 3 AND 4 IN THE FILE CONTENT. ONLY RECOGNIZE CELL 5 FOR LEC. THIS IS HOURS PER WEEK, NOT UNITS
          "lab" : "LABORATORY_HOURS", //2,3 or 0. IGNORE CELL 3 AND 4 IN THE FILE CONTENT. ONLY RECOGNIZE CELL 6 FOR LAB. THIS IS HOURS PER WEEK, NOT UNITS
          "prof_sub": BOOLEAN // true or false. IF SUBJECT HAS 2 HOURS ON LECTURE AND 3 HOURS ON LAB, PROF_SUB SHOULD BE TRUE. If the subject name sounds relevant to the program, it should be true. If the subject name sounds irrelevant to the program, it should be false. For example: "Algorithms" is relevant to Computer Science, so prof_sub should be true. "History of the Philippines" is irrelevant to Computer Science, so prof_sub should be false.
        }
      ]
    }
}

Format the response ONLY as valid JSON without any explanations or markdown code blocks.
PROMPT;

            \Log::error('DeepSeek prompt', [
                'prompt' => $prompt
            ]);
            $deepseek->setMaxTokens(8000);
            $response = $deepseek->query($prompt)->run();
            
            $cleanedResponse = preg_replace('/^```json|```$/m', '', trim($response));
            
            $decodedResponse = json_decode($cleanedResponse, true);

            if (json_last_error() !== JSON_ERROR_NONE || !isset($decodedResponse['curriculum'])) {
                Log::error('DeepSeek response parsing error', [
                    'error' => json_last_error_msg(),
                    'response' => $response
                ]);
                return null;
            }
            
            return $decodedResponse;
            
        } catch (Exception $e) {
            Log::error('DeepSeek parsing error: ' . $e->getMessage());
            return null;
        }
    }

    public function createCurriculum(Request $request)
    {
        \Log::error("i got this far 1");
        $validated = $request->validate([
            'curriculum_name' => 'required|string|max:255',
            'program_name' => 'required|string|max:255',
        ]);
        $request->merge([
            'departmentID' => auth()->user()->departmentID,
        ]);
        \Log::error("i got this far 2");
        $request->validate([
            'departmentID' => 'required|integer|exists:departments,departmentID',
            'curriculum_name' => 'required|string',
            'program_name' => 'required|string',
            'program_short_name' => 'required|string',
            'subjects' => 'required|array',
        ]);

        try {
            $programOfferings = ProgramOfferings::firstOrCreate(
                [
                    'program_short_name' => $request->input('program_short_name'),
                ],
                [
                    'departmentID' => $request->input('departmentID'),
                    'program_name' => $request->input('program_name'),
                ]
            );
            \Log::error("Got this far 3");
            $departmentCurriculum = DepartmentCurriculum::firstOrCreate(
                [
                    'programID' => $programOfferings->id, // Ensure this is included
                    'departmentID' => $request->input('departmentID'),
                    'curriculum_name' => $request->input('curriculum_name'),
                ],
                [
                    'programID' => $programOfferings->id, // Ensure this is included
                    'departmentID' => $request->input('departmentID'),
                    'curriculum_name' => $request->input('curriculum_name'),
                ]
            );

            foreach ($request->input('subjects') as $subjectData) {
                $subject = Subject::firstOrCreate([
                        'subject_code' => $subjectData['subject_code'],
                    ],
                    [
                        'name' => $subjectData['name'],
                        'room_req' => $subjectData['room_req'],
                        'lec' => $subjectData['lec'],
                        'lab' => $subjectData['lab'],
                        'prof_subject' => $subjectData['prof_sub'],
                    ]
                );
                $courseSubject = CourseSubject::firstOrCreate(
                    [
                        'programID' => $programOfferings->id,
                        'curriculumID' => $departmentCurriculum->id,
                        'subjectID' => $subject->id,
                        'semester' => $subjectData['semester'],
                        'year_level' => $subjectData['year_level'],
                    ]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Curriculum created successfully'
            ], 201);
        } catch (Exception $e) {
            Log::error('Curriculum creation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating curriculum: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createSection(Request $request)
    {
        \Log::error("i tried");
        // Validate the request
        $request->validate([
            'section_name' => 'required|string',
            'programID' => 'required|integer',
            'curriculumID' => 'required|integer',
            'year_level' => 'required|integer',
        ]);
        try {
            DB::table('course_sections')
            ->insert([
                'section_name' => $request->input('section_name'),
                'programID' => $request->input('programID'),
                'curriculumID' => $request->input('curriculumID'),
                'year_level' => $request->input('year_level'),
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Section created successfully'
            ], 201);
        } catch (Exception $e) {
            Log::error('Section creation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating section: ' . $e->getMessage()
            ], 500);
        }
    }
    public function approveStudentFeedback(Request $request){
        $validated = $request->validate([
            'feedback_id' => 'required|integer|exists:course_subject_feedback,id',
        ]);
        DB::table('course_subject_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => true]);
        return response()->json([
            'success' => true,
            'message' => 'Feedback approved successfully'
        ], 200);
    }

    public function approveInstructorFeedback(Request $request){
        $validated = $request->validate([
            'feedback_id' => 'required|integer|exists:instructor_feedback,id',
        ]);
        DB::table('instructor_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => true]);
        return response()->json([
            'success' => true,
            'message' => 'Feedback approved successfully'
        ], 200);
    }

    public function createRoom(Request $request){
        $validated = $request->validate([
            'room_number' => 'required|string|max:10',
            'room_type' => 'required|string|max:20',
            'capacity' => 'required|integer|max:50' // 1 for lecture, 2 for laboratory
        ]);
        if (DB::table('classrooms')->where('room_number', $request->input('room_number'))->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Room already exists'
            ], 409);
        }   
        DB::table('classrooms')
        ->insert([
            'room_number' => $request->input('room_number'),
            'room_type' => $request->input('room_type'),
            'capacity' => $request->input('capacity'),
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Room created successfully'
        ], 200);
    }
    
}
