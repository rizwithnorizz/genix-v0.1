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
}
