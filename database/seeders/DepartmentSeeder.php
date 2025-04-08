<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('departments')->insert([
            ['department_short_name' => 'CS', 'department_full_name' => 'Computer Science'],
            ['department_short_name' => 'IT', 'department_full_name' => 'Information Technology'],
            ['department_short_name' => 'EE', 'department_full_name' => 'Electrical Engineering'],
            ['department_short_name' => 'ME', 'department_full_name' => 'Mechanical Engineering'],
            ['department_short_name' => 'CE', 'department_full_name' => 'Civil Engineering'],
        ]);
    }
}
