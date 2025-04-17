<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_09_DepartmentRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('department_room')->insert([
            ['department_short_name' => 'CICT', 'room_number' => 'R101'],
            ['department_short_name' => 'CICT', 'room_number' => 'R102'],
            ['department_short_name' => 'CENG', 'room_number' => 'Lab1'],
            ['department_short_name' => 'CENG', 'room_number' => 'Lab2'],
            ['department_short_name' => 'CENG', 'room_number' => 'R201'],
            ['department_short_name' => 'CIT', 'room_number' => 'R101'],
            ['department_short_name' => 'CIT', 'room_number' => 'R102'],
            ['department_short_name' => 'CNM', 'room_number' => 'Lab1'],
            ['department_short_name' => 'CNM', 'room_number' => 'Lab2'],
            ['department_short_name' => 'CBAHM', 'room_number' => 'R201'],
        ]);
    }
}
