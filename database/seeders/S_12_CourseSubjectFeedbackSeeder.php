<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_12_CourseSubjectFeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('course_subject_feedback')->insert([
            [
                'section_name' => 'BSCS-1A',
                'subject_code' => 'CS101',
                'department_short_name' => 'CICT',
                'feedback' => 'Need more vacant time to study the subject.',
                'status' => false,
            ],
            [
                'section_name' => 'BSCS-1B',
                'subject_code' => 'CS101',
                'department_short_name' => 'CICT',
                'feedback' => 'The subject is very challenging but the instructor is very helpful.',
                'status' => false,
            ],
            [
                'section_name' => 'BSIT-2A',
                'subject_code' => 'IT101',
                'department_short_name' => 'CICT',
                'feedback' => 'The subject is very boring and the instructor is not engaging.',
                'status' => false,
            ],
        ]);
    }
}
