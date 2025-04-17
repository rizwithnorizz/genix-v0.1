<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_01_ProgramOfferingsTableSeeder extends Seeder
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
                'department_short_name' => 'CICT',
            ],
            [
                'program_name' => 'Bachelor of Science in Information Technology',
                'program_short_name' => 'BSIT',
                'department_short_name' => 'CICT',
            ],
            [
                'program_name' => 'Bachelor of Science in Electrical Engineering',
                'program_short_name' => 'BSEE',
                'department_short_name' => 'CENG',
            ],
            [
                'program_name' => 'Bachelor of Science in Mechanical Engineering',
                'program_short_name' => 'BSME',
                'department_short_name' => 'CENG',
            ],
            [
                'program_name' => 'Bachelor of Science in Civil Engineering',
                'program_short_name' => 'BSCE',
                'department_short_name' => 'CENG',
            ],
            [
                'program_name' => 'Bachelor of Science in Nursing',
                'program_short_name' => 'BSN',
                'department_short_name' => 'CNM',
            ],
            [
                'program_name' => 'Bachelor of Science in Midwifery',
                'program_short_name' => 'BSM',
                'department_short_name' => 'CNM',
            ],
            [
                'program_name' => 'Bachelor of Science in Hotel and Restaurant Management',
                'program_short_name' => 'BSHRM',
                'department_short_name' => 'CBAHM',
            ],
            [
                'program_name' => 'Bachelor of Science in Tourism Management',
                'program_short_name' => 'BSTM',
                'department_short_name' => 'CBAHM',
            ],
        ]);
    }
}
