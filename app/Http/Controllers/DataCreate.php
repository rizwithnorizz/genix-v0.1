<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Department_Curriculum;
use App\Models\Program_Offerings;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\Departments;
use DeepSeekClient;
use Illuminate\Support\Facades\Validator;
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

        // Check if the assignment already exists
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

        // Create the assignment
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
        \Log::info('Creating department with data:', $request->all());
        

        try {
            $department = Departments::create([
                'department_short_name' => $request->input('depShortName'),
                'department_full_name' => $request->input('depName'),
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
        // Validate the request
        $request->validate([
            'curriculum_file' => 'required|file|max:10240', // 10MB max
        ]);

        try {
            // Get the uploaded file
            $file = $request->file('curriculum_file');
            
            // Generate a unique filename
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Store the file temporarily
            $path = $file->storeAs('temp', $filename);
            
            // Get the full path to the stored file
            $fullPath = Storage::path($path);
            
            // Get file metadata
            $fileExtension = $file->getClientOriginalExtension();
            $fileSize = $file->getSize();
            $fileName = $file->getClientOriginalName();
            
            // Process the file with DeepSeek AI parser
            $parsedData = $this->parseFileWithDeepSeek($fullPath, $fileExtension, $fileName, $fileSize);
            \Log::error('Parsed data', [
                'parsedData' => $parsedData
            ]);
            // If parsing was successful, create the curriculum
            if ($parsedData) {
                // Create new curriculum records from the parsed data
                $savedCurriculums = $parsedData;

                // Clean up the temporary file
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
    
    /**
     * Send the file to the DeepSeek AI parser and get structured data back
     */
    private function parseFileWithDeepSeek($filePath, $fileExtension, $fileName, $fileSize)
    {
        try {
            // Initialize the DeepSeek client
            $deepseek = new \App\Libraries\DeepSeekClient();
            
            // For large files, instead of sending the whole content, extract key information
            // This approach works better for structured documents like course curricula
            $fileInfo = [];
            
            // Extract text based on file type
            switch (strtolower($fileExtension)) {
                case 'pdf':
                    if (class_exists('Smalot\PdfParser\Parser')) {
                        $parser = new \Smalot\PdfParser\Parser();
                        $pdf = $parser->parseFile($filePath);
                        $text = $pdf->getText();
                        // Extract first 15000 chars and last 5000 chars for context
                        $fileInfo['content'] = substr($text, 0, 15000);
                        if (strlen($text) > 20000) {
                            $fileInfo['content'] .= "\n[...content truncated...]\n";
                            $fileInfo['content'] .= substr($text, -5000);
                        }
                    } else {
                        // Fallback if PDF parser not available
                        $fileInfo['content'] = "PDF file contents (PDF parser not available)";
                    }
                    break;
                    
                    case 'docx':
                        if (class_exists('\PhpOffice\PhpWord\IOFactory')) {
                            $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath);
                            $text = '';
                    
                            foreach ($phpWord->getSections() as $section) {
                                foreach ($section->getElements() as $element) {
                                    // Handle text directly
                                    if ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                                        $text .= $element->getText() . "\n";
                                    }
                    
                                    // Handle TextRun (e.g. bolded/inline pieces)
                                    elseif ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                        foreach ($element->getElements() as $inline) {
                                            if (method_exists($inline, 'getText')) {
                                                $text .= $inline->getText();
                                            }
                                        }
                                        $text .= "\n";
                                    }
                    
                                    // Handle tables
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
            \Log::error('File content', [
                'content' => $fileInfo['content']
            ]);
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

            // Set a reasonable token limit
            $deepseek->setMaxTokens(8000);
            
            // Query the DeepSeek API
            $response = $deepseek->query($prompt)->run();
            
            // Clean and parse the response
            // Remove any markdown code block indicators if present
            $cleanedResponse = preg_replace('/^```json|```$/m', '', trim($response));
            
            // Decode the JSON response
            $decodedResponse = json_decode($cleanedResponse, true);
            \Log::error('DeepSeek response', [
                'response' => $decodedResponse
            ]);
            // Validate the response structure
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
        $request->merge([
            'department_short_name' => auth()->user()->department_short_name,
        ]);
    
        // Log to confirm the department_short_name is set
        \Log::info('Department short name set in request:', [
            'department_short_name' => $request->input('department_short_name'),
        ]);
        \Log::error('Made it this far');
        // Validate the request
        $request->validate([
            'department_short_name' => 'required|string',
            'curriculum_name' => 'required|string',
            'program_name' => 'required|string',
            'program_short_name' => 'required|string',
            'subjects' => 'required|array',
        ]);

        try {
            
            $programOffering = Program_Offerings::firstOrCreate(
                [
                    'program_short_name' => $request->input('program_short_name'),
                ],
                [
                    'department_short_name' => $request->input('department_short_name'),
                    'program_name' => $request->input('program_name'),
                ]
            );

            
            // Create the curriculum record
            $curriculum = new Department_Curriculum();
            $curriculum->department_short_name = $request->input('department_short_name');
            $curriculum->curriculum_name = $request->input('curriculum_name');
            $curriculum->program_short_name = $request->input('program_short_name');
            $curriculum->save();

            // Create the subjects records
            foreach ($request->input('subjects') as $subjectData) {
                \App\Models\Subject::firstOrCreate(
                    [
                        'subject_code' => $subjectData['subject_code'],
                    ],
                    [
                        'name' => $subjectData['name'],
                        'room_req' => $subjectData['room_req'],
                        'lec' => $subjectData['lec'],
                        'lab' => $subjectData['lab'],
                        'prof_sub' => $subjectData['prof_sub'],
                    ]
                );
    
                \App\Models\CourseSubject::firstOrCreate(
                    [
                        'program_short_name' => $curriculum->program_short_name,
                        'curriculum_name' => $curriculum->curriculum_name,
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
        \Log::error("i got this far1111", [
            'request' => $request->all()
        ]);
        // Validate the request
        $request->validate([
            'section_name' => 'required|string',
            'program_short_name' => 'required|string',
            'curriculum_name' => 'required|string',
            'year_level' => 'required|integer',
        ]);

        \Log::error("i got this far 2");
        try {
            // Create the section record
            $section = new \App\Models\course_sections();
            $section->section_name = $request->input('section_name');
            $section->program_short_name = $request->input('program_short_name');
            $section->curriculum_name = $request->input('curriculum_name');
            $section->year_level = $request->input('year_level');
            $section->save();
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
        DB::table('course_subject_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => true]);
        \Log::error("successfully approved student " .  $request->input('feedback_id'));
        return response()->json([
            'success' => true,
            'message' => 'Feedback approved successfully'
        ], 200);
    }

    public function approveInstructorFeedback(Request $request){
        DB::table('instructor_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => true]);
        \Log::error("successfully approved student");
        return response()->json([
            'success' => true,
            'message' => 'Feedback approved successfully'
        ], 200);
    }

    public function createRoom(Request $request){
        DB::table('classrooms')
        ->insert([
            'room_number' => $request->input('room_number'),
            'room_type' => $request->input('room_type'),
        ]);
        \Log::error("successfully created room " .  $request->input('room_number'));
        return response()->json([
            'success' => true,
            'message' => 'Room created successfully'
        ], 200);
    }
    
}
