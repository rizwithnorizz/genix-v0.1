<?php

namespace App\Http\Controllers;
use App\Models\classroom;
use Illuminate\Http\Request;

class DataRelay extends Controller
{
    public function getRoom()
    {
        $classrooms = classroom::all();
        return response()->json($classrooms);
    }
}
