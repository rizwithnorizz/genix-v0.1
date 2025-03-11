<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleAuthRedirect;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('login');
});

Route::get('admin/dashboard-sa', [RoleAuthRedirect::class, 'adminsuperIndex'])->middleware(['auth', 'verified', 'rolemanager:sa_admin'])->name('sa-dashboard');

Route::get('dep-admin/dashboard', [RoleAuthRedirect::class, 'depadminIndex'])->middleware(['auth', 'verified', 'rolemanager:dep_admin'])->name('dep-dashboard');

Route::get('guest/dashboard', [RoleAuthRedirect::class, 'guestIndex'])->middleware(['auth', 'verified', 'rolemanager:guest'])->name('guest-dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
