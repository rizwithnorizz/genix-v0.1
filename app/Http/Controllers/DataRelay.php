<?php

namespace App\Http\Controllers;
use App\Models\Classroom; 
use App\Models\DepartmentRoom;
use App\Models\CourseSubject;
use App\Models\subject_instructor;
use App\Models\program_offerings;
use App\Models\Subject;
use App\Models\Course_Sections;
use App\Models\Department_Curriculum;
use App\Models\Schedules;
use App\Models\Instructor;
use App\Models\Departments;
use Illuminate\Http\Request;

class DataRelay extends Controller
{
    public function getDashboardCount () 
    {
        $classrooms = Classroom::count();
        $departments = Departments::count();

        return response()->json([
            'classrooms' => $classrooms,
            'departments' => $departments,
        ]);
    }
    public function getRoom()
    {
        $classrooms = classroom::all();
        return response()->json([
            'name' => "classrooms",
            'data' => $classrooms,
            'length' => $classrooms->count(),
        ]);
    }

    public function getDepartments()
    {
        $departments = Departments::all();
        return response()->json([
            'name' => "departments",
            'data' => $departments,
            'length' => $departments->count(),
        ]);
    }
    
    public function getDepartmentRoom()
    {
        $departmentRoom = DepartmentRoom::all();
        return response()->json([
            'name' => "department_room",
            'data' => $departmentRoom,
        ]);
    }

    public function getCourseSubject()
    {
        $courseSubject = CourseSubject::all();
        return response()->json([
            'name' => "course_subject",
            'data' => $courseSubject,
        ]);
    }

    public function getSubjectInstructor()
    {
        $subjectInstructor = subject_instructor::all();
        return response()->json([
            'name' => "subject_instructor",
            'data' => $subjectInstructor,

        ]);
    }

    public function getProgramOfferings()
    {
        $programOfferings = program_offerings::all();
        return response()->json([
            'name' => "program_offerings",
            'data' => $programOfferings
        ]);
    }   
    public function getCourseSections()
    {
        $courseSections = Course_Sections::all();
        return response()->json([
            'name' => "course_sections",
            'data' => $courseSections
        ]);
    }

    public function getDepartmentCurriculum()
    {
        $departmentCurriculum = Department_Curriculum::all();
        return response()->json([
            'name' => "department_curriculum",
            'data' => $departmentCurriculum
        ]);
    }

    public function getSchedules()
    {
        $schedules = Schedules::all();
        return response()->json([
            'name' => "schedules",
            'data' => $schedules
        ]);
    }

    public function getInstructor()
    {
        $instructors = Instructor::all();
        return response()->json([
            'name' => "instructors",
            'data' => $instructors
        ]);
    }


    public function getSubject()
    {
        $subjects = Subject::all();
        return response()->json([
            'name' => "subjects",
            'data' => $subjects
        ]);
    }



}
