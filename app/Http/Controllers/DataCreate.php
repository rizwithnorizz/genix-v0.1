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
class DataCreate extends Controller
{
    public function assignRoomToDepartment(Request $request, $department)
    {
        
        $validated = $request->validate([
            'rooms' => 'required|array',
            'rooms.*' => 'string',
        ]);

        foreach ($validated['rooms'] as $roomNumber) {
            DB::table('department_room')->insert([
                'department_short_name' => $department,
                'room_number' => $roomNumber,
            ]);
        }

        return response()->json(['message' => 'Rooms assigned successfully'], 200);
    }
    public function createInstructor(Request $request){
        $department = auth()->user()->department_short_name;
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        \Log::error("i got this far");
        $instructor = DB::table('instructors')
        ->insert([
            'name' => $validated['name'],
            'department_short_name' => $department,
        ]);

        return response()->json([
            'message' => 'Instructor created successfully.',
            'data' => $request['name'],
        ], 201);
    }

    public function deleteInstructor($id){
        $validated = request()->validate([
            'id' => 'required|integer|exists:instructors,id',
        ]);
        $instructor = DB::table('instructors')
        ->find($id);

        if (!$instructor) {
            return response()->json([
                'message' => 'Instructor not found.',
            ], 404);
        }

        DB::table('instructors')
        ->where('id', $id)
        ->delete();

        DB::table('subject_instructors')
        ->where('instructor_id', $id)
        ->delete();

        DB::table('schedules')
        ->where('instructor_id', $id)
        ->delete();
        return response()->json([
            'message' => 'Instructor deleted successfully.',
        ]);
    }
    public function assignSubjectToInstructor(Request $request)
    {

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
    {
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
        ]);

        try {
            $department = Departments::firstOrCreate([
                'department_short_name' => $request->input('department_short_name'),
                'department_full_name' => $request->input('department_full_name'),
            ], [
                'department_short_name' => $request->input('department_short_name'),
                'department_full_name' => $request->input('department_full_name'),
            ]);
            $user = DB::table('users')
            ->insert([
                'name' => $request->input('department_full_name'),
                'email' => $request->input('department_short_name') . '@gmail.com',
                'password' => $request->input('password'),
                'actualPassword' => $request->input('password'),
                'department_short_name' => $request->input('department_short_name'),
                'user_type' => 1,
            ]);

            if ($request->has('selectedRooms')) {
                $selectedRooms = $request->input('selectedRooms');
                foreach ($selectedRooms as $roomNumber) {
                    DB::table('department_room')->insert([
                        'department_short_name' => $department->department_short_name,
                        'room_number' => $roomNumber,
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
            \Log::error('Parsed data', [
                'parsedData' => $parsedData
            ]);
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
                        $text = $pdf->getText();
                        $fileInfo['content'] = substr($text, 0, 15000);
                        if (strlen($text) > 20000) {
                            $fileInfo['content'] .= "\n[...content truncated...]\n";
                            $fileInfo['content'] .= substr($text, -5000);
                        }
                    } else {
                        $fileInfo['content'] = "PDF file contents (PDF parser not available)";
                    }
                    break;
                    
                    case 'docx':
                        if (class_exists('\PhpOffice\PhpWord\IOFactory')) {
                            $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath);
                            $text = '';
                    
                            foreach ($phpWord->getSections() as $section) {
                                foreach ($section->getElements() as $element) {
                                    if ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                                        $text .= $element->getText() . "\n";
                                    }
                                    elseif ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                        foreach ($element->getElements() as $inline) {
                                            if (method_exists($inline, 'getText')) {
                                                $text .= $inline->getText();
                                            }
                                        }
                                        $text .= "\n";
                                    }
                                    elseif ($element instanceof \PhpOffice\PhpWord\Element\Table) {
                                        $text .= "\n[Table Start]\n";
                                        foreach ($element->getRows() as $rowIndex => $row) {
                                            $text .= "Row " . ($rowIndex + 1) . ":\n";
                                            foreach ($row->getCells() as $cellIndex => $cell) {
                                                $cellText = '';
                                                foreach ($cell->getElements() as $cellElement) {
                                                    if (method_exists($cellElement, 'getText')) {
                                                        $cellText .= $cellElement->getText() . ' ';
                                                    } elseif ($cellElement instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                                        foreach ($cellElement->getElements() as $inline) {
                                                            if (method_exists($inline, 'getText')) {
                                                                $cellText .= $inline->getText() . ' ';
                                                            }
                                                        }
                                                    }
                                                }
                                                $text .= "  Cell " . ($cellIndex + 1) . ": " . trim($cellText) . "\n";
                                            }
                                            $text .= "\n";
                                        }
                                        $text .= "[Table End]\n";
                                    }
                                }
                            }
                    
                            $fileInfo['content'] = substr($text, 0, 15000);
                            if (strlen($text) > 20000) {
                                $fileInfo['content'] .= "\n[...content truncated...]\n";
                                $fileInfo['content'] .= substr($text, -5000);
                            }
                        } else {
                            $fileInfo['content'] = "DOCX file contents (DOCX parser not available)";
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
      "department_short_name": "DEPARTMENT_CODE", <- CICT, CIT, CBA, CNM, CAMS, CAS, CBAHM, CCJE, CENG. Departments with the name that starts with "College of" and following with an abbreviated name will be shortened to just "C"
      "curriculum_name": "CURRICULUM_NAME", <- should be the program short name + year (for example: BSCS 2018-2019 Curriculum) DO NOT FORGET THE YEAR VERY IMPORTANT
      "program_name": "FULL_PROGRAM_NAME",
      "program_short_name": "PROGRAM_CODE",
      "subjects": [
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
            'department_short_name' => auth()->user()->department_short_name,
        ]);
    
        $request->validate([
            'department_short_name' => 'required|string',
            'curriculum_name' => 'required|string',
            'program_name' => 'required|string',
            'program_short_name' => 'required|string',
            'subjects' => 'required|array',
        ]);

        try {
            
            ProgramOfferings::firstOrCreate(
                [
                    'program_short_name' => $request->input('program_short_name'),
                ],
                [
                    'department_short_name' => $request->input('department_short_name'),
                    'program_name' => $request->input('program_name'),
                ]
            );

            DepartmentCurriculum::firstOrCreate(
                [
                    'program_short_name' => $request->input('program_short_name'), // Ensure this is included
                    'department_short_name' => $request->input('department_short_name'),
                    'curriculum_name' => $request->input('curriculum_name'),
                ],
                [
                    'program_short_name' => $request->input('program_short_name'), // Ensure this is included
                    'department_short_name' => $request->input('department_short_name'),
                    'curriculum_name' => $request->input('curriculum_name'),
                ]
            );

            foreach ($request->input('subjects') as $subjectData) {
                Subject::firstOrCreate([
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
                CourseSubject::firstOrCreate(
                    [
                        'program_short_name' => $request->input('program_short_name'),
                        'curriculum_name' => $request->input('curriculum_name'),
                        'subject_code' => $subjectData['subject_code'],
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
        // Validate the request
        $request->validate([
            'section_name' => 'required|string',
            'program_short_name' => 'required|string',
            'curriculum_name' => 'required|string',
            'year_level' => 'required|integer',
        ]);
        
        \Log::error("i got this far 2");
        try {
            DB::table('course_sections')
            ->insert([
                'section_name' => $request->input('section_name'),
                'program_short_name' => $request->input('program_short_name'),
                'curriculum_name' => $request->input('curriculum_name'),
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
            'room_type' => 'required|string|max:20', // 1 for lecture, 2 for laboratory
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
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Room created successfully'
        ], 200);
    }
    
}
