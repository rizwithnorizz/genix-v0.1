<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgramOfferingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('program_offerings')->insert([
            [
                'program_name' => 'Bachelor of Science in Computer Science',
                'program_short_name' => 'BSCS',
                'curriculum_name' => 'CS-2020',
                'department_short_name' => 'CS'
            ],
            [
                'program_name' => 'Bachelor of Science in Information Technology',
                'program_short_name' => 'BSIT',
                'curriculum_name' => 'IT-2020',
                'department_short_name' => 'IT'
            ],
            [
                'program_name' => 'Bachelor of Science in Electrical Engineering',
                'program_short_name' => 'BSEE',
                'curriculum_name' => 'EE-2020',
                'department_short_name' => 'EE'
            ],
            [
                'program_name' => 'Bachelor of Science in Mechanical Engineering',
                'program_short_name' => 'BSME',
                'curriculum_name' => 'ME-2020',
                'department_short_name' => 'ME'
            ],
            [
                'program_name' => 'Bachelor of Science in Civil Engineering',
                'program_short_name' => 'BSCE',
                'curriculum_name' => 'CE-2020',
                'department_short_name' => 'CE'
            ],
        ]);
    }
}
