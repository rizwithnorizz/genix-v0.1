<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class DataUpdate extends Controller
{
    public function approveSchedule($scheduleID, $value){
        DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->update(['status' => $value]);
    }

    public function deleteSchedule($scheduleID){
        DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->delete();
    }

    public function deleteDepartmentFeedback($department){
        DB::table('instructor_feedback')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('course_subject_feedback')
            ->where('department_short_name', $department)
            ->delete();

        response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }

    public function updateDepartment($department_short_name, Request $request)
    {

        DB::table('users')
            ->updateOrInsert([
                'department_short_name' => $request->input('department_short_name'),
                'name' => $request->input('admin_name'),
                'email' => $request->input('admin_email'),
            ], [
                'department_short_name' => $request->input('department_short_name'),
                'name' => $request->input('admin_name'),
                'email' => $request->input('admin_email'),
                'password' => bcrypt($request->input('password')),
                'actualPassword' => $request->input('password'),
            ]); 
        return response()->json([
            'message' => 'Department updated successfully',
        ]); 
    }
    public function deleteRoom($roomID){
        \Log::error('Deleting room with ID: ' . $roomID);
        DB::table('classrooms')
            ->where('id', $roomID)
            ->delete();
        return response()->json([
            'message' => 'Room updated successfully',
        ]);
    }
    public function deleteDepartmentAdmin($email)
    {
        DB::table('users')
            ->where('email', $email)
            ->delete();
        return response()->json([
            'message' => 'Department admin deleted successfully'
        ]);
    }

    public function deleteDepartment($department)
    {
        DB::table('users')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('schedule_repos')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('course_subject_feedback')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('instructor_feedback')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('schedules')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('subject_instructors')
            ->join('instructors', 'subject_instructors.instructor_id', '=', 'instructors.id')
            ->where('instructors.department_short_name', $department)
            ->delete();
        DB::table('instructors')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('course_subjects')
            ->join('department_curriculums', 'course_subjects.curriculum_name' , '=', 'department_curriculums.curriculum_name')
            ->where('department_curriculums.department_short_name', $department)
            ->delete();
        DB::table('program_offerings')
            ->where('department_short_name', $department)
            ->delete();  
        DB::table('department_curriculums')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('department_room')
            ->where('department_short_name', $department)
            ->delete();
        DB::table('departments')
            ->where('department_short_name', $department)
            ->delete();
        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }

    public function deleteDepartmentRoom($department, $room_number)
    {
        DB::table('department_room')
            ->where('department_short_name', $department)
            ->where('room_number', $room_number)
            ->delete();
        return response()->json([
            'message' => 'Room deleted successfully'
        ]);
    }

    public function deleteSection($section)
    {
        DB::table('course_sections')
            ->where('id', $section)
            ->delete();
        return response()->json([
            'message' => 'Section deleted successfully'
        ]);
    }

    public function updateSection($sectionID, Request $request)
{
    $newSectionName = $request->input('section_name');

    $oldSectionName = DB::table('course_sections')
        ->where('id', $sectionID)
        ->value('section_name');

    DB::beginTransaction();

    try {
        DB::table('course_sections')
            ->where('id', $sectionID)
            ->update(['section_name' => $newSectionName]);

        DB::table('schedules')
            ->where('section_name', $oldSectionName)
            ->update(['section_name' => $newSectionName]);

        DB::commit();

        return response()->json([
            'message' => 'Section successfully edited',
            'success' => true,
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error updating section: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to update section.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


}
