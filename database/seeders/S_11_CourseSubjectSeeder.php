<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_11_CourseSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('course_subjects')->insert([
            ['subject_code' => 'CS101', 'program_short_name' => 'BSCS'],
            ['subject_code' => 'CS102', 'program_short_name' => 'BSCS'],
            ['subject_code' => 'IT101', 'program_short_name' => 'BSIT'],
            ['subject_code' => 'EE101', 'program_short_name' => 'BSEE'],
            ['subject_code' => 'ME101', 'program_short_name' => 'BSME'],
        ]);
    }
}
