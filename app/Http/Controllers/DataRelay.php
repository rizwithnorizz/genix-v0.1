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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
    
    public function getDepartmentRoom($department)
    {
        $departmentRoom = DB::table('department_room')
            ->where('department_room.department_short_name',$department)
            ->join('classrooms', 'department_room.room_number', '=', 'classrooms.room_number')
            ->select('department_room.*', 'classrooms.room_type')
            ->get();
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

    public function getCourseSections()
    {
        $userDepartmentShortName = auth()->user()->department_short_name;
        $courseSections = Course_Sections::join('program_offerings', 'course_sections.program_short_name', '=', 'program_offerings.program_short_name')
            ->select('course_sections.*')
            ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
                return $query->where('program_offerings.department_short_name', $userDepartmentShortName);
            })
            ->get();
        return response()->json([
            'name' => "course_sections",
            'data' => $courseSections
        ]);
    }

    public function getDepartmentCurriculum()
    {
        if (!auth()->check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Retrieve the authenticated user's department_short_name
        $userDepartmentShortName = auth()->user()->department_short_name;
        $departmentCurriculum = Department_Curriculum::join('program_offerings', 'department_curriculums.program_short_name', '=', 'program_offerings.program_short_name')
            ->select('department_curriculums.*', 'program_offerings.*')
            ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
                return $query->where('department_curriculums.department_short_name', $userDepartmentShortName);
            })
            ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
                return $query->where('program_offerings.department_short_name', $userDepartmentShortName);
            })
            ->get();
        \Log::info('Department Curriculum Data:', ['curriculum' => $departmentCurriculum]);
        return response()->json([
            'name' => "department_curriculum",
            'data' => $departmentCurriculum
        ]);
    }

    public function yearLevel(String $yearLevel)
    {
        switch($yearLevel) {
            case '1st':
                return 1;
            case '2nd':
                return 2;
            case '3rd':
                return 3;
            case '4th':
                return 4;
            default:
                return null; // or handle the error as needed
        }
    }
    
    public function getCourseSubjects(Request $request)
    {
        $userDepartmentShortName = auth()->user()->department_short_name;
        $programShortName = $request->input('program_short_name'); 
        $curriculumName = $request->input('curriculum_name');
        $courseSubjects = CourseSubject::join('program_offerings', 'course_subjects.program_short_name', '=', 'program_offerings.program_short_name')
            ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
                return $query->where('program_offerings.department_short_name', $userDepartmentShortName);
            })
            ->when($programShortName, function ($query, $programShortName) {
                return $query->where('course_subjects.program_short_name', $programShortName);
            })
            ->when($curriculumName, function ($query, $curriculumName) {
                return $query->where('course_subjects.curriculum_name', $curriculumName);
            })
            ->join('subjects', 'course_subjects.subject_code', '=', 'subjects.subject_code')
            ->select('subjects.*', 'course_subjects.*')
            ->get();

        return response()->json([
            'name' => "course_subjects",
            'data' => $courseSubjects,
        ]);
    }
    public function getSchedules()
    {
        $schedules = DB::table('schedule_repos')
            ->where('department_short_name', auth()->user()->department_short_name)
            ->get();
        \Log::info('-----------------Schedules Data:', ['schedules' => $schedules]);
        return response()->json([
            'name' => "schedules",
            'data' => $schedules
        ]);
    }

    public function getInstructors()
    {
        $department = auth()->user()->department_short_name;
        $instructors = DB::table('instructors')
            ->where('department_short_name', $department)   
            ->get();
        return response()   ->json([
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

    public function getStudentFeedback()
    {
        $userDepartmentShortName = auth()->user()->department_short_name;
        $studentFeedback = DB::table('course_subject_feedback')
        ->join('course_sections', 'course_subject_feedback.section_name', '=', 'course_sections.section_name')
        ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
            return $query->where('course_subject_feedback.department_short_name', $userDepartmentShortName);
        })
        ->select('course_subject_feedback.*', 'course_sections.section_name')
        ->get();    
        \Log::info('Student Feedback Data:', ['feedback' => $studentFeedback]);
        return response()->json([
            'name' => "student_feedback",
            'data' => $studentFeedback
        ]);
    }

    public function getInstructorFeedback()
    {
        $userDepartmentShortName = auth()->user()->department_short_name;
        $instructorFeedback = DB::table('instructor_feedback')
            ->join('instructors', 'instructor_feedback.instructor_id', '=', 'instructors.id')
            ->when($userDepartmentShortName, function ($query, $userDepartmentShortName) {
                return $query->where('instructor_feedback.department_short_name', $userDepartmentShortName);
            })
            ->select('instructor_feedback.*', 'instructors.name as name')
            ->get();

        \Log::info('Instructor Feedback Data:', ['feedback' => $instructorFeedback]);
        return response()->json([
            'name' => "instructor_feedback",
            'data' => $instructorFeedback
        ]);
    }
    public function getInstructorsWithSubjects()
    {
        $department = auth()->user()->department_short_name;
        $instructors = Instructor::with(['subjects'])
        ->where('department_short_name', $department)
        ->get();

        return response()->json([
            'data' => $instructors->map(function ($instructor) {
                $nameParts = explode(' ', $instructor->name);
                $initials = strtoupper(implode('', array_map(fn($part) => $part[0], $nameParts)));

                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'initials' => $initials,
                    'subjects' => $instructor->subjects->map(function ($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'subject_code' => $subject->subject_code,
                            'prof_sub' => $subject->prof_subject,
                        ];
                    }),
                ];
            }),
        ]);
    }
    public function getAllSubjects()
    {
        $department = auth()->user()->department_short_name;
        $subjects = DB::table('subjects')
            ->join('course_subjects', 'subjects.subject_code', '=', 'course_subjects.subject_code')
            ->join('program_offerings', 'course_subjects.program_short_name', '=', 'program_offerings.program_short_name')
            ->where('program_offerings.department_short_name', $department)
            ->select('subjects.*')
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $subjects->unique('subject_code')->values()->all(),
            ], 200);
    }

    public function getFeedback()
    {
        $instructorFeedback = DB::table('instructor_feedback')
            ->where('status', true)
            ->join('instructors', 'instructor_feedback.instructor_id', '=', 'instructors.id')
            ->select(
                'instructor_feedback.feedback as feedback',
                'instructor_feedback.created_at as feedback_date',
                'instructors.name as sender',
                'instructors.department_short_name'
            )
            ->get();

        $courseSectionFeedback = DB::table('course_subject_feedback')
            ->where('status', true)
            ->join('course_sections', 'course_subject_feedback.section_name', '=', 'course_sections.section_name')
            ->select(
                'course_subject_feedback.feedback as feedback',
                'course_subject_feedback.created_at as feedback_date',
                'course_sections.section_name as sender',
                'course_subject_feedback.department_short_name'
            )
            ->get();

        $compiledFeedback = collect($instructorFeedback)
            ->merge($courseSectionFeedback)
            ->groupBy('department_short_name')
            ->map(function ($feedbacks, $department) {
                return [
                    'department_short_name' => $department,
                    'feedbackData' => $feedbacks->values()->all(),
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'status' => 'success',
            'data' => $compiledFeedback,
        ], 200);
    }

    public function getDepartmentAdmins ($department) {
        $departmentAdmins = DB::table('users')
            ->where('user_type', 1)
            ->where('department_short_name', $department)
            ->select('name', 'email', 'department_short_name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $departmentAdmins,
        ], 200);
    }
}
