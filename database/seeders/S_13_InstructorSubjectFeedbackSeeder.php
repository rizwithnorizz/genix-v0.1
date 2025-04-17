<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_13_InstructorSubjectFeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('instructor_feedback')->insert([
            [
                'instructor_id' => 1,
                'subject_code' => 'CS101',
                'department_short_name' => 'CICT',
                'feedback' => 'The instructor is very knowledgeable and helpful.',
                'status' => false,
            ],
            [
                'instructor_id' => 1,
                'subject_code' => 'CS102',
                'department_short_name' => 'CICT',
                'feedback' => 'The instructor is very engaging and makes the subject interesting.',
                'status' => false,
            ],
            [
                'instructor_id' => 3,
                'subject_code' => 'CS102',
                'department_short_name' => 'CICT',
                'feedback' => 'The instructor is very strict but fair.',
                'status' => false,
            ],
        ]);
    }
}
