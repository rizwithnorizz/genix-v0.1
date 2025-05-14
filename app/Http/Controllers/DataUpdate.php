<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Departments;
use Illuminate\Support\Str;
use App\Mail\EmailAdmins;
use Illuminate\Support\Facades\Mail;

class DataUpdate extends Controller
{
    public function rejectStudentFeedback(Request $request){
        $validated = $request->validate([
            'feedback_id' => 'required|integer|exists:course_subject_feedback,id',
        ]);
        DB::table('course_subject_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => false]);
        return response()->json([
            'success' => true,
            'message' => 'Feedback rejected successfully'
        ], 200);
    }

    public function rejectInstructorFeedback(Request $request){
        $validated = $request->validate([
            'feedback_id' => 'required|integer|exists:instructor_feedback,id',
        ]);
        DB::table('instructor_feedback')
        ->where('id', $request->input('feedback_id'))
        ->update(['status' => false]);
        return response()->json([
            'success' => true,
            'message' => 'Feedback rejected successfully'
        ], 200);
    }
    public function publishSchedule($scheduleID){
        $schedule = DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->first();
        DB::table('schedules')
            ->where('departmentID', $schedule->departmentID)
            ->delete();
        DB::table('class_schedule_archives')->insert([
            'schedule' => $schedule->schedule,
            'repo_name' => $schedule->repo_name,
            'departmentID' => $schedule->departmentID,
            'semester' => $schedule->semester,
            'status' => 1,
        ]);

        $decodedSchedule = json_decode($schedule->schedule);
        foreach ($decodedSchedule as $item) {
            if (!isset($item->id)) {
                \Log::error('Inserting schedule item: ' . json_encode($item));
                DB::table('schedules')->updateOrInsert([
                'subjectID' => $item->subjectID,
                'day_slot' => $item->day_slot,  
                'roomID' => $item->roomID,
                'departmentID' => $schedule->departmentID,
                'semester' => $schedule->semester,
                ], [
                'subjectID' => $item->subjectID,
                'time_start' => $item->time_start,
                'time_end' => $item->time_end,
                'day_slot' => $item->day_slot,  
                'roomID' => $item->roomID,
                'sectionID' => $item->sectionID,
                'instructor_id' => $item->instructor_id,
                'departmentID' => $schedule->departmentID,
                'semester' => $schedule->semester,
                ]);
            } else {
                \Log::error('Updating schedule item: ' . json_encode($item));
                DB::table('schedules')->updateOrInsert([
                'id' => $item->id,
                ], [
                'time_start' => $item->time_start,
                'time_end' => $item->time_end,
                'day_slot' => $item->day_slot,  
                'roomID' => $item->roomID,
                'sectionID' => $item->sectionID,
                'instructor_id' => $item->instructor_id,
                'departmentID' => $schedule->departmentID,
                'semester' => $schedule->semester,
                ]);
            }
        }
        DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->delete();
    }
    public function approveSchedule($scheduleID, $value){
        DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->update(['status' => $value]);
    }
    public function rejectSchedule($scheduleID){
        $schedule = DB::table('schedule_repos')
            ->where('id', $scheduleID)
            ->first();
        DB::table('class_schedule_archives')->insert([
            'schedule' => $schedule->schedule,
            'repo_name' => $schedule->repo_name,
            'departmentID' => $schedule->departmentID,
            'semester' => $schedule->semester,
            'status' => 0,
        ]);
    }
    public function deleteSchedule($scheduleID){
        \Log::error('Deleting schedule with ID: ' . $scheduleID);
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

    public function updateDepartment(Request $request, $departmentID)
    {
        \Log::error('Updating department with ID: ' . $departmentID);
        $validated = $request->validate([
            'department_full_name' => 'required|string|max:255',
            'department_short_name' => 'required|string|max:10',
        ]);
        \Log::error($request->logo_img_path);
        $department = Departments::where('departmentID', $departmentID)->firstOrFail();

        // Handle logo upload
        if ($request->has('logo_img_path')) {
            // Delete the old logo if it exists
            if ($department->logo_img_path != null) {
                $oldLogoPath = public_path($department->logo_img_path);
                if (file_exists($oldLogoPath)) {
                    unlink($oldLogoPath);
                }
            }

            // Save the new logo
            $logoPath = $request->file('logo_img_path')->store('logos', 'public');
            $logo_img_path = '/storage/' . $logoPath;
            \Log::error('Logo path: ' . $logo_img_path);
            DB::table('departments')
            ->where('departmentID', $departmentID)
            ->update([
                'logo_img_path' => $logo_img_path,
            ]);
        }

        if ($request->input('admin_name') != null && $request->input('admin_email') != null) {
            DB::table('users')
                ->insert([
                'name' => $request->admin_name, 
                'email' => $request->admin_email,
                'password' => bcrypt($request->password),
                'actualPassword' => $request->password,
                'departmentID' => $departmentID,
                'user_type' => 1,
                ]);     
            Mail::to($request->admin_email)->send(new EmailAdmins($request->admin_name, $request->admin_email, $request->password, $request->department_full_name));
        }
        DB::table('departments')
            ->where('departmentID', $departmentID)
            ->update([
                'department_full_name' => $validated['department_full_name'],
                'department_short_name' => $validated['department_short_name'],
            ]);
        return response()->json([
            'success' => true,
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
            ->where('departmentID', $department)
            ->delete();
        DB::table('schedule_repos')
            ->where('departmentID', $department)
            ->delete();
        DB::table('course_subject_feedback')
            ->where('departmentID', $department)
            ->delete();
        DB::table('instructor_feedback')
            ->where('departmentID', $department)
            ->delete();
        DB::table('schedules')
            ->where('departmentID', $department)
            ->delete();
        DB::table('subject_instructors')
            ->join('instructors', 'subject_instructors.instructor_id', '=', 'instructors.id')
            ->where('instructors.departmentID', $department)
            ->delete();
        DB::table('instructors')
            ->where('departmentID', $department)
            ->delete();
        DB::table('course_subjects')
            ->join('department_curriculums', 'course_subjects.curriculumID' , '=', 'department_curriculums.id')
            ->where('department_curriculums.departmentID', $department)
            ->delete();
        DB::table('program_offerings')
            ->where('departmentID', $department)
            ->delete();  
        DB::table('department_curriculums')
            ->where('departmentID', $department)
            ->delete();
        DB::table('department_room')
            ->where('departmentID', $department)
            ->delete();
        DB::table('departments')
            ->where('departmentID', $department)
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
