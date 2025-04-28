<?php

namespace App\Http\Controllers;
use App\Models\Classroom; 
use App\Models\DepartmentRoom;
use App\Models\CourseSubject;
use App\Models\Subject_Instructor;
use App\Models\ProgramOfferings;
use App\Models\Subject;
use App\Models\Course_Sections;
use App\Models\DepartmentCurriculum;
use App\Models\Schedules;
use App\Models\Instructor;
use App\Models\Departments;
use App\Models\ScheduleRepo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class DataRelay extends Controller
{

    public function getInstructorCounts()
    {
        try {
            // Query to count the number of instructors assigned to each subject
            $instructorCounts = DB::table('subject_instructors')
                ->select('subject_code', DB::raw('COUNT(instructor_id) as instructor_count'))
                ->groupBy('subject_code')
                ->get();

            // Return the counts as a JSON response
            return response()->json([
                'success' => true,
                'data' => $instructorCounts
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching instructor counts: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getFeedbackAccumulate()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $department = auth()->user()->departmentID;    
        $feedback = DB::table('instructor_feedback')
            ->where('departmentID', $department)
            ->where('status', true)
            ->select('id', 'feedback')
            ->union(
                DB::table('course_subject_feedback')
                    ->where('departmentID', $department)
                    ->where('status', true)
                    ->select('id', 'feedback')
            )
            ->get();
        return response()->json([
            'name' => "feedback_accumulate",
            'data' => $feedback,
        ]);
    }

    public function getDashboardCount () 
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $classrooms = Classroom::count();
        $departments = Departments::count();
        $schedul_repo = ScheduleRepo::count();
        return response()->json([
            'classrooms' => $classrooms,
            'departments' => $departments,
            'schedules' => $schedul_repo,
        ]);
    }
    public function getRoom()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $classrooms = classroom::all();
        return response()->json([
            'name' => "classrooms",
            'data' => $classrooms,
            'length' => $classrooms->count(),
        ]);
    }

    public function getDepartments()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $departments = Departments::all();
        return response()->json([
            'name' => "departments",
            'data' => $departments,
            'length' => $departments->count(),
        ]);
    }
    
    public function getDepartmentRoom($department)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $departmentRoom = DB::table('department_room')
            ->where('department_room.departmentID',$department)
            ->join('classrooms', 'department_room.roomID', '=', 'classrooms.id')
            ->select('department_room.roomID', 'classrooms.room_number', 'classrooms.room_type')
            ->get();
        return response()->json([
            'name' => "department_room",
            'data' => $departmentRoom,
        ]);
    }


    public function getCourseSections()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $userDepartment = auth()->user()->departmentID;
        $courseSections = DB::table('course_sections')
            ->join('program_offerings', 'course_sections.programID', '=', 'program_offerings.id')
            ->when($userDepartment, function ($query, $userDepartment) {
                return $query->where('program_offerings.departmentID', $userDepartment);
            })
            ->select('course_sections.*', 'program_offerings.program_short_name as program_short_name')
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
        $userDepartment = auth()->user()->departmentID;
        $departmentCurriculum = DB::table('department_curriculums')
            ->join('program_offerings', 'department_curriculums.programID', '=', 'program_offerings.id')
            ->select('department_curriculums.*', 'program_offerings.*')
            ->when($userDepartment, function ($query, $userDepartment) {
                return $query->where('department_curriculums.departmentID', $userDepartment);
            })
            ->when($userDepartment, function ($query, $userDepartment) {
                return $query->where('program_offerings.departmentID', $userDepartment);
            })
            ->select('department_curriculums.id as curriculumID', 'department_curriculums.curriculum_name', 'program_offerings.id as programID', 'program_offerings.program_short_name', 'program_offerings.program_name')
            ->get();
        \Log::info('Department Curriculum Data:', ['curriculum' => $departmentCurriculum]);
        return response()->json([
            'name' => "department_curriculum",
            'data' => $departmentCurriculum
        ]);
    }

    public function getCourseSubjects(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $validator = Validator::make($request->all(), [
            'programID' => 'required|integer|exists:program_offerings,id',
            'curriculumID' => 'required|integer|exists:department_curriculums,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
        $userDepartment = auth()->user()->departmentID;
        $programID = $request->input('programID'); 
        $curriculumID = $request->input('curriculumID');
        $courseSubjects = CourseSubject::join('program_offerings', 'course_subjects.programID', '=', 'program_offerings.id')
            ->when($userDepartment, function ($query, $userDepartment) {
                return $query->where('program_offerings.departmentID', $userDepartment);
            })
            ->when($programID, function ($query, $programID) {
                return $query->where('course_subjects.programID', $programID);
            })
            ->when($curriculumID, function ($query, $curriculumID) {
                return $query->where('course_subjects.curriculumID', $curriculumID);
            })
            ->join('subjects', 'course_subjects.subjectID', '=', 'subjects.id')
            ->select('subjects.*', 'course_subjects.*')
            ->get();
        
            \Log::error("dfddf");
        return response()->json([
            'name' => "course_subjects",
            'data' => $courseSubjects,
        ]);
    }
    public function getArchivedSchedules()
    {
       $archived = DB::table('class_schedule_archives')
        ->get();
        $sections = DB::table('course_sections')->pluck('section_name', 'id');
        $subjects = DB::table('subjects')->pluck('subject_code', 'id');
        $rooms = DB::table('classrooms')->pluck('room_number', 'id');
        $instructor = DB::table('instructors')->pluck('name', 'id');
        $decodedSchedules = $archived->map(function ($archived) use ($sections, $subjects, $rooms, $instructor) {
            $scheduleData = collect(json_decode($archived->schedule)); // Convert to Collection

            $department_short_name = DB::table('departments')
                ->where('departmentID', $archived->departmentID)
                ->select('department_short_name')
                ->get();
            // Map over each entry in the schedule data
            $scheduleArray = $scheduleData->map(function ($entry) use ($sections, $subjects, $rooms, $instructor) {
                $entry->section_name = $sections[$entry->sectionID] ?? null;
                $entry->instructor_name = $instructor[$entry->instructor_id] ?? null;
                $entry->subject_code = $subjects[$entry->subjectID] ?? null;
                $entry->room_number = $rooms[$entry->roomID] ?? null;
                return $entry;
            })->filter(function ($entry) {
                return $entry->section_name && $entry->subject_code && $entry->room_number;
            })->values()->all(); // Convert back to array and filter out null values
            
            return [
                'id' => $archived->id,
                'schedules' => $scheduleArray,
                'repo_name' => $archived->repo_name,
                'departmentID' => $archived->departmentID,
                'department_short_name' => $department_short_name[0]->department_short_name,
                'status' => $archived->status,
            ];
        });


        return response()->json([
            'name' => "schedules",
            'data' => $decodedSchedules,
        ]);
    }
    public function getPublishedSchedules()
    {
        $published = DB::table('schedules')
        ->get();
        $sections = DB::table('course_sections')->pluck('section_name', 'id');
        $subjects = DB::table('subjects')->pluck('subject_code', 'id');
        $rooms = DB::table('classrooms')->pluck('room_number', 'id');
        $instructor = DB::table('instructors')->pluck('name', 'id');
        $department = DB::table('departments')->pluck('department_short_name', 'departmentID');
        $scheduleArray = $published->map(function ($entry) use ($sections, $subjects, $rooms, $instructor, $department) {
            $entry->section_name = $sections[$entry->sectionID] ?? null;
            $entry->instructor_name = $instructor[$entry->instructor_id] ?? null;
            $entry->subject_code = $subjects[$entry->subjectID] ?? null;
            $entry->room_number = $rooms[$entry->roomID] ?? null;
            $entry->department_short_name = $department[$entry->departmentID] ?? null;
            return $entry;
        })->filter(function ($entry) {
            return $entry->section_name && $entry->subject_code && $entry->room_number;
        })->values()->all(); // Convert back to array and filter out null values

        return response()->json([
            'name' => "schedules",
            'data' => $scheduleArray,
        ]);
    }
    public function getSchedules()
    {
        \Log::error("User type: " . auth()->user()->user_type);
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        if (auth()->user()->user_type == 1){
            \Log::info('User is a department admin');
            $schedulesRetrieve = DB::table('schedule_repos')
            ->where('departmentID', auth()->user()->departmentID)
            ->get();
        } else if (auth()->user()->user_type == 0) {
            \Log::info('User is a super admin');
            $schedulesRetrieve = DB::table('schedule_repos')
            ->where('status', true)
            ->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sections = DB::table('course_sections')->pluck('section_name', 'id');
        $subjects = DB::table('subjects')->pluck('subject_code', 'id');
        $rooms = DB::table('classrooms')->pluck('room_number', 'id');
        $instructor = DB::table('instructors')->pluck('name', 'id');
        $decodedSchedules = $schedulesRetrieve->map(function ($scheduleRetrieve) use ($sections, $subjects, $rooms, $instructor) {
            $scheduleData = collect(json_decode($scheduleRetrieve->schedule)); // Convert to Collection

            $department_short_name = DB::table('departments')
                ->where('departmentID', $scheduleRetrieve->departmentID)
                ->select('department_short_name')
                ->get();
            // Map over each entry in the schedule data
            $scheduleArray = $scheduleData->map(function ($entry) use ($sections, $subjects, $rooms, $instructor) {
                $entry->section_name = $sections[$entry->sectionID] ?? null;
                $entry->instructor_name = $instructor[$entry->instructor_id] ?? null;
                $entry->subject_code = $subjects[$entry->subjectID] ?? null;
                $entry->room_number = $rooms[$entry->roomID] ?? null;
                return $entry;
            })->filter(function ($entry) {
                return $entry->section_name && $entry->subject_code && $entry->room_number;
            })->values()->all(); // Convert back to array and filter out null values
            
            return [
                'id' => $scheduleRetrieve->id,
                'schedules' => $scheduleArray,
                'repo_name' => $scheduleRetrieve->repo_name,
                'departmentID' => $scheduleRetrieve->departmentID,
                'department_short_name' => $department_short_name[0]->department_short_name,
                'status' => $scheduleRetrieve->status,
            ];
        });


        return response()->json([
            'name' => "schedules",
            'data' => $decodedSchedules,
        ]);
    }

    public function getInstructors()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $department = auth()->user()->departmentID;
        $instructors = DB::table('instructors')
            ->where('departmentID', $department)   
            ->get();
        return response()   ->json([
            'name' => "instructors",
            'data' => $instructors
        ]);
    }


    public function getStudentFeedback()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $userDepartment = auth()->user()->departmentID;
        $studentFeedback = DB::table('course_subject_feedback')
        ->join('course_sections', 'course_subject_feedback.sectionID', '=', 'course_sections.id')
        ->when($userDepartment, function ($query, $userDepartment) {
            return $query->where('course_subject_feedback.departmentID', $userDepartment);
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
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $userDepartment = auth()->user()->departmentID;
        $instructorFeedback = DB::table('instructor_feedback')
            ->join('instructors', 'instructor_feedback.instructor_id', '=', 'instructors.id')
            ->when($userDepartment, function ($query, $userDepartment) {
                return $query->where('instructor_feedback.departmentID', $userDepartment);
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
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $department = auth()->user()->departmentID;
        $instructors = Instructor::with(['subjects'])
        ->where('departmentID', $department)
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
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $department = auth()->user()->departmentID;
        $subjects = DB::table('subjects')
            ->join('course_subjects', 'subjects.id', '=', 'course_subjects.subjectID')
            ->join('program_offerings', 'course_subjects.programID', '=', 'program_offerings.id')
            ->where('program_offerings.departmentID', $department)
            ->select('subjects.*')
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $subjects->unique('subject_code')->values()->all(),
            ], 200);
    }

    public function getFeedback()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $instructorFeedback = DB::table('instructor_feedback')
            ->where('status', true)
            ->join('instructors', 'instructor_feedback.instructor_id', '=', 'instructors.id')
            ->select(
                'instructor_feedback.feedback as feedback',
                'instructor_feedback.created_at as feedback_date',
                'instructors.name as sender',
                'instructors.departmentID'
            )
            ->get();

        $courseSectionFeedback = DB::table('course_subject_feedback')
            ->where('status', true)
            ->join('course_sections', 'course_subject_feedback.sectionID', '=', 'course_sections.id')
            ->select(
                'course_subject_feedback.feedback as feedback',
                'course_subject_feedback.created_at as feedback_date',
                'course_sections.section_name as sender',
                'course_subject_feedback.departmentID'
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
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $validator = Validator::make(['department' => $department], [
            'department' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
        $departmentAdmins = DB::table('users')
            ->where('user_type', 1)
            ->where('departmentID', $department)
            ->select('name', 'email', 'departmentID', 'actualPassword as password')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $departmentAdmins,
        ], 200);
    }
}
