<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class RoleAuthRedirect extends Controller
{
    public function index(){
        return Inertia::render('admin/superadmin_dashboard');
    }

    public function userindex(){
        return Inertia::render('Dashboard');
    }
}

