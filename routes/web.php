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


Route::get('/api/schedules', [ScheduleController::class, 'index']);

Route::get('/', function () {
    return redirect('login');
});



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

    
    Route::get('/api/curriculum', [DataRelay::class, 'getDepartmentCurriculum'])->name('depadmin.curriculum');
    Route::get('/api/section', [DataRelay::class, 'getCourseSections'])->name('depadmin.sections');
    //Route::get('dep-admin/course-sections', [CourseSectionController::class, 'index'])->name('dep.course-sections');
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

    Route::get('admin/chat', [sadminPageController::class, 'chat'])->name('admin.chat');
    Route::get('admin/chat/send', [DeepSeekController::class, 'index'])->name('admin.chat.send');

    Route::get('admin/getDashboardCount', [DataRelay::class, 'getDashboardCount'])->name('admin.getDashboardCount');
    

    Route::post('admin/create-department', [DataCreate::class, 'createDepartment'])->name('admin.create-department');
    Route::get('admin/get-departments', [DataRelay::class, 'getDepartments'])->name('admin.getDepartment');
    // Add more routes for super admin
});

Route::middleware('auth')->group(function () {
    Route::get('/getusersidebar', [ProfileController::class, 'getUser']);
});

Route::get('/run-genetic-algorithm', [GeneticAlgorithmController::class, 'run']);



require __DIR__.'/auth.php';
