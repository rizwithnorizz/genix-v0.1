<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class RoleAuthRedirect extends Controller
{
    public function adminsuperIndex(){
        return Inertia::render('admin/superadmin_dashboard');
    }

    public function depadminIndex(){
        return Inertia::render('depadmin/depadmin_dashboard');
    }

    public function guestIndex(){
        return Inertia::render('GuestViewSchedule/schedule');
    }
}

