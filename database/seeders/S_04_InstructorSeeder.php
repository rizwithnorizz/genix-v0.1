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
                'department_short_name' => 'CICT'
            ],
            [
                'name' => 'Prof. Johnson',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CICT'
            ],
            [
                'name' => 'Dr. Williams',
                'prof_subject_instructor' => true,
                'department_short_name' => 'CICT'
            ],
            [
                'name' => 'Prof. Brown',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CENG'
            ],
            [
                'name' => 'Dr. Davis',
                'prof_subject_instructor' => true,
                'department_short_name' => 'CENG'
            ],
            [
                'name' => 'Prof. Miller',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CENG'
            ],
            [
                'name' => 'Dr. Wilson',
                'prof_subject_instructor' => true,
                'department_short_name' => 'CNM'
            ],
            [
                'name' => 'Prof. Moore',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CNM'
            ],
            [
                'name' => 'Dr. Taylor',
                'prof_subject_instructor' => true,
                'department_short_name' => 'CBAHM'
            ],
            [
                'name' => 'Prof. Anderson',
                'prof_subject_instructor' => false,
                'department_short_name' => 'CBAHM'
            ],
        ]);
    }
}
