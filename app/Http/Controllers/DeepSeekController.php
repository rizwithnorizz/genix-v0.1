<?php

namespace App\Http\Controllers;

use DeepSeekClient;
use Illuminate\Http\Request;

use App\Models\Classroom; 
use App\Models\DepartmentRoom;
use App\Models\CourseSubject;
use App\Models\subject_instructor;
use App\Models\program_offerings;
use App\Models\Subject;
use App\Models\Course_Sections;
use App\Models\Department_Curriculum;
use App\Models\Instructor;
use App\Models\Departments;

class DeepSeekController extends Controller
{
    public function index()
    {
        try {
            $deepseek = new \App\Libraries\DeepSeekClient();
            
            // Get and prepare all data as JSON strings
            $data = [
                'rooms' => json_encode(Classroom::all()->toArray()),
                'subjects' => json_encode(Subject::all()->toArray()),
                'department_rooms' => json_encode(DepartmentRoom::all()->toArray()),
                'course_subjects' => json_encode(CourseSubject::all()->toArray()),
                'subject_instructors' => json_encode(subject_instructor::all()->toArray()),
                'program_offerings' => json_encode(program_offerings::all()->toArray()),
                'course_sections' => json_encode(Course_Sections::all()->toArray()),
                'department_curriculum' => json_encode(Department_Curriculum::all()->toArray()),
                'instructors' => json_encode(Instructor::all()->toArray()),
                'departments' => json_encode(Departments::all()->toArray()),
            ];

            // Define available time slots and days as strings
            $timeSlots = implode(', ', [
                '08:00-09:30',
                '09:30-11:00', 
                '11:00-12:30',
                '13:00-14:30',
                '14:30-16:00',
                '16:00-17:30'
            ]);

            $days = implode(', ', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

            $prompt = <<<PROMPT
    Create an optimized class schedule using the following data. The response must ONLY be in JSON format as specified.

    AVAILABLE TIME SLOTS: {$timeSlots}
    AVAILABLE DAYS: {$days}

    DATA CONSTRAINTS:
    1. ROOMS: {$data['rooms']}
    2. SUBJECTS: {$data['subjects']}
    3. DEPARTMENT-ROOM ASSIGNMENTS: {$data['department_rooms']}
    4. INSTRUCTOR QUALIFICATIONS: {$data['subject_instructors']}
    5. PROGRAM OFFERINGS: {$data['program_offerings']}
    6. COURSE SECTIONS: {$data['course_sections']}
    7. INSTRUCTORS: {$data['instructors']}

    RULES:
    1. Assign subjects to rooms of matching department (department_short_name)
    2. Laboratory subjects must go to lab rooms
    3. Assign qualified instructors only
    4. No double-booking of rooms (same room/time/day)
    5. Distribute sections evenly across time slots
    6. Maximum 3 consecutive hours per instructor
    7. Include breaks between classes when possible
    8. A subject should only be assigned to 2 days. Some subjects are an exception to only 1 day.
    9. 2 day subjects will only have 1 hour and 30 minutes or 2 hour per day.
    10. 1 day subjects will have 3 to 5 hours.

    RESPONSE FORMAT:
    {
    "schedule": [
        {
        "subject_code": "CS101",
        "subject_name": "Data Structures",
        "time_slot": "08:00-09:30",
        "day_slot": "Monday",
        "room_number": "R101",
        "section_name": "BSCS-1A",
        "instructor": "Dr. Smith",
        "department": "CS"
        }
    ]
    }
    PROMPT;

            $response = $deepseek->query($prompt)->run();
            $decodedResponse = json_decode(preg_replace('/^```json|```$/m', '', trim($response)), true);
            

            return response()->json([
                'success' => true,
                'message' => $decodedResponse,
                'decoded' => $decodedResponse
            ]);
            
        } catch (\Exception $e) {
            \Log::error('DeepSeek API Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Schedule generation failed: ' . $e->getMessage()
            ], 500);
        }
    }
}