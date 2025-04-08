<?php

namespace App\Http\Controllers;

use App\Models\Schedules;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        try {
            $schedules = Schedules::with(['subject', 'classroom', 'section'])
                ->orderBy('day_slot')
                ->orderBy('time_slot')
                ->get();
            
            return response()->json([
                'success' => true,
                'schedules' => $schedules,
                'total' => $schedules->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}