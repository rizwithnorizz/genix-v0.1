<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentCurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('department_curriculums')->insert([
            ['department_short_name' => 'CS', 'curriculum_name' => 'CS-2020'],
            ['department_short_name' => 'IT', 'curriculum_name' => 'IT-2020'],
            ['department_short_name' => 'EE', 'curriculum_name' => 'EE-2020'],
            ['department_short_name' => 'ME', 'curriculum_name' => 'ME-2020'],
            ['department_short_name' => 'CE', 'curriculum_name' => 'CE-2020'],
        ]);
    }
}
