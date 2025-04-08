<?php

namespace App\Http\Controllers;

use DeepSeekClient;
use Illuminate\Http\Request;

class DeepSeekController extends Controller
{
    public function index()
{
    try {
        $deepseek = new \App\Libraries\DeepSeekClient();
        $response = $deepseek->query('Hello deepseek')->run();
        
        return response()->json([
            'success' => true,
            'message' => $response
        ]);
        
    } catch (\Exception $e) {
        \Log::error('DeepSeek API Failure: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}