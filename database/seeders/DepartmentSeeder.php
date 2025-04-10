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
            ['department_short_name' => 'CS', 'department_full_name' => 'Computer Science', 'logo_img_path' => ''],
            ['department_short_name' => 'IT', 'department_full_name' => 'Information Technology', 'logo_img_path' => ''],
            ['department_short_name' => 'EE', 'department_full_name' => 'Electrical Engineering', 'logo_img_path' => ''],
            ['department_short_name' => 'ME', 'department_full_name' => 'Mechanical Engineering', 'logo_img_path' => ''],
            ['department_short_name' => 'CE', 'department_full_name' => 'Civil Engineering', 'logo_img_path' => ''],
        ]);
    }
}
