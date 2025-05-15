<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\depadminPageController;
use App\Http\Controllers\guestPageController;
use App\Http\Controllers\sadminPageController;
use App\Http\Controllers\DataRelay;
use App\Http\Controllers\DeepSeekController;
use App\Http\Controllers\DataCreate;
use App\Http\Controllers\DataUpdate; 

use App\Http\Controllers\MailService;

Route::get('/api/schedules', [ScheduleController::class, 'index']);
Route::get("/api/schedules/instructor/published", [DataRelay::class, 'getPublishedSchedules']);
Route::post('/api/feedback/post', [DataCreate::class, 'createFeedback'])->name('feedback');
Route::get('/api/getRemainingFeedback/{id}/{type}', [DataRelay::class, 'getRemainingFeedback'])->name('feedback.count');
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dep-dashboard'); // Redirect to a logged-in user's page, e.g., profile
    }
    return redirect()->route('login'); // Redirect to login if not authenticated
});

Route::get('guest/about', function () {
    return Inertia::render('about');
})->name('about');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Department Admin Routes
Route::middleware(['auth', 'rolemanager:dep_admin'])->group(function () {
    Route::get('dep-admin/dashboard', [depadminPageController::class, 'dashboard'])->name('dep-dashboard');
    Route::get('dep-admin/courseOfferings', [depadminPageController::class, 'courseOfferings'])->name('depadmin.courseofferings');
    Route::get('dep-admin/instructors', [depadminPageController::class, 'instructors'])->name('depadmin.instructor');
    Route::get('dep-admin/about', [depadminPageController::class, 'about'])->name('depadmin.about');
    Route::get('dep-admin/help', [depadminPageController::class, 'help'])->name('depadmin.help');
    Route::get('dep-admin/feedback', [depadminPageController::class, 'feedback'])->name('depadmin.feedback');
    Route::get('/api/feedback-to-versions', [DataRelay::class, 'feedbackToVersions'])->name('depadmin.feedback-to-versions');
    Route::get('/api/genEdInstructors', [DataRelay::class, 'getGenEdInstructors'])->name('depadmin.genEdInstructors');
    Route::get('/api/instructors', [DataRelay::class, 'getInstructors'])->name('depadmin.instructors');
    Route::get('/api/instructors-with-subjects', [DataRelay::class, 'getInstructorsWithSubjects'])->name('depadmin.instructors-with-subjects');
    Route::get('/api/subjects', [DataRelay::class, 'getAllSubjects'])->name('depadmin.subjects')->name('depadmin.subjects');
    Route::post('/api/instructor-subjects', [DataCreate::class, 'assignSubjectToInstructor'])->name('depadmin.assign-subject');
    Route::delete('/api/instructor-subjects', [DataCreate::class, 'removeSubjectFromInstructor'])->name('depadmin.remove-subject'); 

    Route::post('/api/instructor/create', [DataCreate::class, 'createInstructor'])->name('depadmin.create-instructor');
    Route::delete('/api/instructor/{id}', [DataCreate::class, 'deleteInstructor'])->name('depadmin.delete-instructor');

    Route::put('/api/schedules/{scheduleID}/{value}', [DataUpdate::class, 'approveSchedule'])->name('depadmin.approve-schedule');
    Route::delete('/api/schedules/{scheduleID}/delete', [DataUpdate::class, 'deleteSchedule'])->name('depadmin.delete-schedule');

    Route::post('/api/schedules/generate', [ScheduleController::class, 'generateSchedule'])->name('depadmin.generate-schedule');
    Route::get('/api/schedules/list', [DataRelay::class, 'getSchedules'])->name('depadmin.schedules');

    Route::get('/api/curriculum', [DataRelay::class, 'getDepartmentCurriculum'])->name('depadmin.curriculum');
    Route::get('/api/section', [DataRelay::class, 'getCourseSections'])->name('depadmin.sections');
    Route::put('/api/course-subject', [DataRelay::class, 'getCourseSubjects'])->name('depadmin.course-subject');

    Route::post('/api/curriculum/upload', [DataCreate::class, 'uploadCurriculum'])->name('depadmin.upload-curriculum');
    Route::post('/api/curriculum/create', [DataCreate::class, 'createCurriculum'])->name('depadmin.create-curriculum');
    Route::post('/api/section/create', [DataCreate::class, 'createSection'])->name('depadmin.create-section');

    Route::get('/api/feedback/accumulate', [DataRelay::class, 'getFeedbackAccumulate'])->name('depadmin.feedback.accumulate');
    Route::get('/api/feedback/getPending', [DataRelay::class, 'getPendingFeedback'])->name('depadmin.feedback.pending');
    Route::get('/api/feedback/student', [DataRelay::class, 'getStudentFeedback'])->name('depadmin.feedback.student');
    Route::get('/api/feedback/instructor', [DataRelay::class, 'getInstructorFeedback'])->name('depadmin.feedback.instructor');
    Route::get('/api/schedules/generate-from-feedback' , [ScheduleController::class, 'generateScheduleFromFeedback'])->name('depadmin.generate-schedule-from-feedback');

    Route::post('/api/feedback/student/reject', [DataUpdate::class, 'rejectStudentFeedback'])->name('depadmin.reject.student');
    Route::post('/api/feedback/instructor/reject', [DataUpdate::class, 'rejectInstructorFeedback'])->name('depadmin.reject.instructor');
    Route::post('/api/feedback/student/approve', [DataCreate::class, 'approveStudentFeedback'])->name('depadmin.approve.student');
    Route::post('/api/feedback/instructor/approve', [DataCreate::class, 'approveInstructorFeedback'])->name('depadmin.approve.instructor');

    Route::delete('/api/section/delete/{section}', [DataUpdate::class, 'deleteSection'])->name('depadmin.delete-section');
    Route::put('/api/section/update/{sectionID}', [DataUpdate::class, 'updateSection'])->name('depadmin.update-section');

    Route::get('/api/feedback-to-approval', [DataRelay::class, 'feedbackToApproval'])->name('depadmin.feedback-to-approval');

    Route::get('/api/instructor-counts', [DataRelay::class, 'getInstructorCounts'])->name('admin.getInstructorCounts');
    //Route::get('dep-admin/course-sections', [/CourseSectionController::class, 'index'])->name('dep.course-sections');
    //Route::get('dep-admin/subjects', [SubjectController::class, 'index'])->name('dep.subjects');
    // Add more routes for department admin
});


Route::get('guest/student', [guestPageController::class, 'student'])->name('guest.student');
Route::get('guest/instructor', [guestPageController::class, 'instructor'])->name('guest.instructor');

//Super Admin Routes
Route::middleware(['auth', 'rolemanager:sa_admin'])->group(function () {
    Route::get('admin/dashboard-sa', [sadminPageController::class, 'dashboard'])->name('sa-dashboard');
    Route::get('admin/departments', [sadminPageController::class, 'departments'])->name('admin.departments');
    Route::get('admin/rooms' , [sadminPageController::class, 'rooms'])->name('admin.rooms');
    Route::get('admin/schedules', [sadminPageController::class, 'schedules'])->name('admin.schedules');
    Route::get('admin/feedback', [sadminPageController::class, 'feedback'])->name('admin.feedback'); 
    Route::get('admin/help', [sadminPageController::class, 'help'])->name('admin.help');
    Route::get('admin/about', [sadminPageController::class, 'about'])->name('admin.about');

    Route::get('admin/getDashboardCount', [DataRelay::class, 'getDashboardCount'])->name('admin.getDashboardCount');
    Route::get('admin/getFeedback', [DataRelay::class, 'getFeedback'])->name('admin.getFeedback');

    Route::post('admin/create-department', [DataCreate::class, 'createDepartment'])->name('admin.create-department');
    Route::get('admin/get-departments', [DataRelay::class, 'getDepartments'])->name('admin.getDepartment');
    Route::get('admin/departments/{department}/rooms', [DataRelay::class, 'getDepartmentRoom'])->name('admin.getDepartmentDetails');
    Route::get('/api/get-rooms', [DataRelay::class, 'getRoom'])->name('admin.getRoom');
    Route::post('/api/create-room', [DataCreate::class, 'createRoom'])->name('admin.createRoom');
    Route::delete('/api/rooms/{roomID}/delete', [DataUpdate::class, 'deleteRoom'])->name('admin.deleteRoom');
    Route::post('admin/departments/{department}/assign-rooms', [DataCreate::class, 'assignRoomToDepartment'])->name('admin.assignRoom');
    Route::delete('admin/departments/{department}/rooms/{room_number}', [DataUpdate::class, 'deleteDepartmentRoom'])->name('admin.deleteRoom');
    Route::delete('admin/deleteFeedback/{department}', [DataUpdate::class, 'deleteDepartmentFeedback'])->name('admin.delete-department');

    Route::get('/api/schedules/archives', [DataRelay::class, 'getArchivedSchedules'])->name('admin.archived-schedules');
    Route::delete('/api/schedules/reject/{scheduleID}', [DataUpdate::class, 'deleteSchedule'])->name('admin.reject-schedule');
    Route::get('/admin/schedules/list', [DataRelay::class, 'getSchedules'])->name('admin.schedules');
    Route::post('/api/schedules/publish/{scheduleID}', [DataUpdate::class, 'publishSchedule'])->name('admin.publish-schedule');
    Route::delete('admin/departments/delete/{department}', [DataUpdate::class, 'deleteDepartment'])->name('admin.delete-department');
    Route::delete('admin/departments/admins/{email}', [DataUpdate::class, 'deleteDepartmentAdmin'])->name('admin.delete-department-admin');
    Route::post('admin/departments/update/{departmentID}', [DataUpdate::class, 'updateDepartment'])->name('admin.update-department');
    Route::get('admin/departments/{department}/admins', [DataRelay::class, 'getDepartmentAdmins'])->name('admin.department-details');
    // Add more routes for super admin
});

Route::middleware('auth')->group(function () {
    Route::get('/getusersidebar', [ProfileController::class, 'getUser']);
});


require __DIR__.'/auth.php';
