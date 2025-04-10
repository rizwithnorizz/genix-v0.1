<?php

namespace App\Http\Controllers;
use App\Http\Models\Department;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DataCreate extends Controller
{
    public function createDepartment(Request $request){
        \Log::error('This is a test');
        Department::create([
            'department_short_name' => $request->input('depName'),
            'department_full_name' => $request->input('depShortName'),
            'logo_img_path' => $request->input('logo_img_path'),
        ]);
        return view('admin.departments');
    }
}
