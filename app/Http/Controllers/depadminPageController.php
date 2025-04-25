<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class depadminPageController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('depadmin/depadmin_dashboard');
    }
    public function courseOfferings()
    {
        return Inertia::render('depadmin/courseofferings');
    }
    public function instructors()
    {
        return Inertia::render('depadmin/instructors');
    }
    public function feedback()  
    {
        return Inertia::render('depadmin/feedback');
    }
    public function about()
    {
        return Inertia::render('about');
    }

    public function help()
    {
        return Inertia::render('help');
    }
}
