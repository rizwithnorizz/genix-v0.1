<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class guestPageController extends Controller
{
    public function student()
    {
        return Inertia::render('guest/student');
    }
    public function instructor()
    {
        return Inertia::render('guest/instructor');
    }
}
