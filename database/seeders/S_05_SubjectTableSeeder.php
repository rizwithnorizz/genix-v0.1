<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_05_SubjectTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('subjects')->insert([
            [
                'name' => 'Data Structures',
                'room_req' => 1,
                'lec' => 2,
                'lab' => 3,
                'subject_code' => 'CS101',
                'prof_subject' => true
            ],
            [
                'name' => 'Algorithms',
                'room_req' => 1,
                'lec' => 2,
                'lab' => 3,
                'subject_code' => 'CS102',
                'prof_subject' => true
            ],
            [
                'name' => 'Database Systems',
                'room_req' => 1,
                'lec' => 2,
                'lab' => 3,
                'subject_code' => 'IT101',
                'prof_subject' => false
            ],
            [
                'name' => 'Circuit Theory',
                'room_req' => 2,
                'lec' => 2,
                'lab' => 3,
                'subject_code' => 'EE101',
                'prof_subject' => false
            ],
            [
                'name' => 'Thermodynamics',
                'room_req' => 2,
                'lec' => 2,
                'lab' => 3,
                'subject_code' => 'ME101',
                'prof_subject' => true
            ],
        ]);
    }
}
