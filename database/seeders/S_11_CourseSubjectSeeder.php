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
            ['subject_code' => 'CS101', 'program_short_name' => 'BSCS', 'curriculum_name' => 'CS-2020', 'year_level' => 1, 'semester' => '1st'],
            ['subject_code' => 'CS102', 'program_short_name' => 'BSCS', 'curriculum_name' => 'CS-2020', 'year_level' => 1, 'semester' => '1st'],
            ['subject_code' => 'IT101', 'program_short_name' => 'BSIT', 'curriculum_name' => 'IT-2020', 'year_level' => 1, 'semester' => '1st'],
            ['subject_code' => 'EE101', 'program_short_name' => 'BSEE', 'curriculum_name' => 'EE-2020', 'year_level' => 1, 'semester' => '1st'],
            ['subject_code' => 'ME101', 'program_short_name' => 'BSME', 'curriculum_name' => 'ME-2020', 'year_level' => 1, 'semester' => '1st'],
        ]);
    }
}
