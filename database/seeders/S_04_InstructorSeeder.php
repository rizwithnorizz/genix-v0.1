<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_04_InstructorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('instructors')->insert([
            [
                'name' => 'Dr. Smith',
                'prof_subject_instructor' => true,
                'department_short_name' => 'CS'
            ],
            [
                'name' => 'Prof. Johnson',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CS'
            ],
            [
                'name' => 'Dr. Williams',
                'prof_subject_instructor' => true,
                'department_short_name' => 'IT'
            ],
            [
                'name' => 'Prof. Brown',
                'prof_subject_instructor' => false,
                'department_short_name' => 'EE'
            ],
            [
                'name' => 'Dr. Davis',
                'prof_subject_instructor' => true,
                'department_short_name' => 'ME'
            ],
        ]);
    }
}
