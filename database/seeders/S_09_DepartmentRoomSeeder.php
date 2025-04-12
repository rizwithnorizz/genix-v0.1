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
            ['department_short_name' => 'CS', 'room_number' => 'R101'],
            ['department_short_name' => 'IT', 'room_number' => 'R102'],
            ['department_short_name' => 'EE', 'room_number' => 'Lab1'],
            ['department_short_name' => 'ME', 'room_number' => 'Lab2'],
            ['department_short_name' => 'CE', 'room_number' => 'R201'],
        ]);
    }
}
