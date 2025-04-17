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
            ['department_short_name' => 'CICT', 'curriculum_name' => 'CS-2020', 'program_short_name' => 'BSCS'],
            ['department_short_name' => 'CICT', 'curriculum_name' => 'IT-2020', 'program_short_name' => 'BSIT'],
            ['department_short_name' => 'CENG', 'curriculum_name' => 'EE-2020', 'program_short_name' => 'BSEE'],
            ['department_short_name' => 'CENG', 'curriculum_name' => 'ME-2020', 'program_short_name' => 'BSME'],
            ['department_short_name' => 'CENG', 'curriculum_name' => 'CE-2020', 'program_short_name' => 'BSCE'],
            ['department_short_name' => 'CENG', 'curriculum_name' => 'ECE-2020', 'program_short_name' => 'BSEE'],
            ['department_short_name' => 'CNM', 'curriculum_name' => 'Nursing-2020', 'program_short_name' => 'BSN'],
            ['department_short_name' => 'CNM', 'curriculum_name' => 'Midwifery-2020', 'program_short_name' => 'BSM'],
            ['department_short_name' => 'CBAHM', 'curriculum_name' => 'HRM-2020', 'program_short_name' => 'BSHRM'],
            ['department_short_name' => 'CBAHM', 'curriculum_name' => 'BSTM-2020', 'program_short_name' => 'BSTM'],
        ]);
    }
}
