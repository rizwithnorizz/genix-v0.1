<?php

namespace App\Http\Controllers;

use DeepSeekClient;
use Illuminate\Http\Request;
use App\Models\Classroom;
use App\Models\Room_Assigments;
use App\Models\Subject;
use App\Models\DepartmentRoom;
use App\Models\CourseSubject;
use App\Models\subject_instructor;
use App\Models\program_offerings;
class DeepSeekController extends Controller
{
    public function index()
    {
    
    $room = json_encode(Classroom::all());
    $subject = json_encode(Subject::all());
    $departmentRoom = json_encode(DepartmentRoom::all());
    $courseSubject = json_encode(CourseSubject::all());
    $sub_Instructor =json_encode(subject_instructor::all());
    $program_offerings = json_encode(program_offerings::all());
    try {
        $deepseek = new \App\Libraries\DeepSeekClient();
        $response = $deepseek->query('Create a schedule with data from these json variables.
                                        Ensure that every subject assigned to a program offering get assigned
                                        to a room that is assigned to the department_short_name from table
                                        department_room.
                                        Return only json format text',
                                        $room,
                                        $subject,
                                        $departmentRoom,
                                        $courseSubject,
                                        $sub_Instructor,
                                        $program_offerings)->run();
        
        return response()->json([
            'success' => true,
            'message' => $response
        ]);
        
    } catch (\Exception $e) {
        \Log::error('DeepSeek API Failure: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}