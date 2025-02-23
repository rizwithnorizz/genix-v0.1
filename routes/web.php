<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleAuthRedirect;

Route::get('/', function () {
    return redirect('/login');
});
Route::get('admin/dashboard-sa', [RoleAuthRedirect::class, 'index'])->middleware(['auth', 'verified', 'rolemanager:admin'])->name('sa-dashboard');
Route::get('/dashboard', [RoleAuthRedirect::class, 'userindex'])->middleware(['auth', 'verified', 'rolemanager:user'])->name('dep-dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
