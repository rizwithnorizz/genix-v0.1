<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class S_08_CourseSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('course_sections')->insert([
            [
                'section_name' => 'BSCS-1A',
                'program_short_name' => 'BSCS',
                'year_level' => 1,
                'curriculum_name' => 'CS-2020',
            ],
            [
                'section_name' => 'BSCS-1B',
                'program_short_name' => 'BSCS',
                'year_level' => 1,
                'curriculum_name' => 'CS-2020',
            ],
            [
                'section_name' => 'BSIT-2A',
                'program_short_name' => 'BSIT',
                'year_level' => 2,
                'curriculum_name' => 'IT-2020',
            ],
            [
                'section_name' => 'BSEE-3A',
                'program_short_name' => 'BSEE',
                'year_level' => 3,
                'curriculum_name' => 'EE-2020',
            ],
            [
                'section_name' => 'BSME-4A',
                'program_short_name' => 'BSME',
                'year_level' => 4,
                'curriculum_name' => 'ME-2020',
            ],
            [
                'section_name' => 'BSCE-4A',
                'program_short_name' => 'BSCE',
                'year_level' => 4,
                'curriculum_name' => 'CE-2020',
            ],
            [
                'section_name' => 'BSEE-4A',
                'program_short_name' => 'BSEE',
                'year_level' => 4,
                'curriculum_name' => 'ECE-2020',
            ],
            [
                'section_name' => 'BSN-1A',
                'program_short_name' => 'BSN',
                'year_level' => 1,
                'curriculum_name' => 'Nursing-2020',
            ],
            [
                'section_name' => 'BSM-1A',
                'program_short_name' => 'BSM',
                'year_level' => 1,
                'curriculum_name' => 'Midwifery-2020',
            ],
            [
                'section_name' => 'BSHRM-2A',
                'program_short_name' => 'BSHRM',
                'year_level' => 2,
                'curriculum_name' => 'HRM-2020',
            ],
            [
                'section_name' => 'BSTM-2A',
                'program_short_name' => 'BSTM',
                'year_level' => 2,
                'curriculum_name' => 'BSTM-2020',
            ],
            [
                'section_name' => 'BSHRM-3A',
                'program_short_name' => 'BSHRM',
                'year_level' => 3,
                'curriculum_name' => 'HRM-2020',
            ],
            [
                'section_name' => 'BSTM-3A',
                'program_short_name' => 'BSTM',
                'year_level' => 3,
                'curriculum_name' => 'BSTM-2020',
            ],
            [
                'section_name' => 'BSHRM-4A',
                'program_short_name' => 'BSHRM',
                'year_level' => 4,
                'curriculum_name' => 'HRM-2020',
            ],
            [
                'section_name' => 'BSTM-4A',
                'program_short_name' => 'BSTM',
                'year_level' => 4,
                'curriculum_name' => 'BSTM-2020',
            ],
        ]);
    }
}
