<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SimpleEmail;
use Illuminate\Support\Facades\Validator;

class EmailService extends Controller
{
    public function send(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'subject' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        $request->merge([
            'to' => 'ubcictkyoto@gmail.com'
        ]);

        try {
            Mail::to($request->to)
                ->send(new SimpleEmail(
                    $request->message,
                ));

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}