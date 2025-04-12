<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_03_DepartmentCurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('department_curriculums')->insert([
            ['department_short_name' => 'CS', 'curriculum_name' => 'CS-2020', 'program_short_name' => 'BSCS'],
            ['department_short_name' => 'IT', 'curriculum_name' => 'IT-2020', 'program_short_name' => 'BSIT'],
            ['department_short_name' => 'EE', 'curriculum_name' => 'EE-2020', 'program_short_name' => 'BSEE'],
            ['department_short_name' => 'ME', 'curriculum_name' => 'ME-2020', 'program_short_name' => 'BSME'],
            ['department_short_name' => 'CE', 'curriculum_name' => 'CE-2020', 'program_short_name' => 'BSCE'],
        ]);
    }
}
