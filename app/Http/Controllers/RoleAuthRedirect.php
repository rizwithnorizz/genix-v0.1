<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoleAuthRedirect extends Controller
{
    public function index(){
        return Inertia::render('admin/superadmin_dashboard');
    }

    public function userindex(){
        return Inertia::render('depadmin/depadmin_dashboard');
    }
}
