<?php

namespace App\Http\Controllers;
use App\Models\Departments;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DataCreate extends Controller
{
    public function createDepartment(Request $request){
        \Log::error('This is a test');
        Departments::create([
            'department_short_name' => $request->input('depShortName'),
            'department_full_name' => $request->input('depName'),
            'logo_img_path' => $request->input('logo_img_path'),
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Department created successfully',
        ]);
    }
}
