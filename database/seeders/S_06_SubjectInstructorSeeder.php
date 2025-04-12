<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_06_SubjectInstructorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('subject_instructors')->insert([
            ['subject_code' => 1, 'instructor_id' => 1],
            ['subject_code' => 2, 'instructor_id' => 1],
            ['subject_code' => 3, 'instructor_id' => 3],
            ['subject_code' => 4, 'instructor_id' => 4],
            ['subject_code' => 5, 'instructor_id' => 5],
        ]);
    }
}
