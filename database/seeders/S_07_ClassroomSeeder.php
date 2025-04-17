<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_07_ClassroomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('classrooms')->insert([
            ['room_number' => 'R101', 'room_type' => 'Laboratory'],
            ['room_number' => 'R102', 'room_type' => 'Laboratory'],
            ['room_number' => 'Lab1', 'room_type' => 'Laboratory'],
            ['room_number' => 'Lab2', 'room_type' => 'Laboratory'],
            ['room_number' => 'R201', 'room_type' => 'Lecture'],
        ]);
    }
}
