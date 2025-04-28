<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class sadminPageController extends Controller
{
    public function dashboard(){
        return Inertia::render('admin/superadmin_dashboard');
    }

    public function departments()
    {
        return Inertia::render('admin/departments');
    }

    public function rooms()
    {
        return Inertia::render('admin/rooms');
    }

    public function schedules()
    {
        return Inertia::render('admin/schedules');
    }

    public function feedback(){
        return Inertia::render('admin/feedback');
    }

    public function help()
    {
        return Inertia::render('help');
    }

    public function about()
    {
        return Inertia::render('about');
    }

    public function chat()
    {
        return Inertia::render('admin/deepseektest');
    }
}
