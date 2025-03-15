<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleAuthRedirect;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneticAlgorithmController;
use App\Http\Controllers\FeedbackController;

Route::get('/', function () {
    return redirect('login');
});

Route::get('dep-admin/dashboard', [RoleAuthRedirect::class, 'depadminIndex'])->middleware(['auth', 'verified', 'rolemanager:dep_admin'])->name('dep-dashboard');

Route::get('guest/dashboard', [RoleAuthRedirect::class, 'guestIndex'])->middleware(['auth', 'verified', 'rolemanager:guest'])->name('guest-dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Department Admin Routes
Route::middleware(['auth', 'rolemanager:dep_admin'])->group(function () {
    Route::get('dep-admin/dashboard', [RoleAuthRedirect::class, 'depadminIndex'])->name('dep-dashboard');
    //Route::get('dep-admin/course-sections', [CourseSectionController::class, 'index'])->name('dep.course-sections');
    //Route::get('dep-admin/subjects', [SubjectController::class, 'index'])->name('dep.subjects');
    // Add more routes for department admin
});


//Guest Routes
Route::middleware(['auth', 'rolemanager:guest'])->group(function () {
    Route::get('guest/dashboard', [RoleAuthRedirect::class, 'guestIndex'])->name('guest-dashboard');
    // Add more routes for guest
});

//Super Admin Routes
Route::middleware(['auth', 'rolemanager:sa_admin'])->group(function () {
    Route::get('admin/dashboard-sa', [RoleAuthRedirect::class, 'adminsuperIndex'])->name('sa-dashboard');
    //Route::get('admin/departments', [DepartmentController::class, 'index'])->name('admin.departments');
    //Route::get('admin/schedules', [ScheduleController::class, 'index'])->name('admin.schedules');
    Route::get('admin/feedback', [FeedbackController::class, 'index'])->name('admin.feedback'); 
    // Add more routes for super admin
});

Route::get('/run-genetic-algorithm', [GeneticAlgorithmController::class, 'run']);

require __DIR__.'/auth.php';
