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
                'semester' => '1st',
                'curriculum_name' => 'CS-2020',
            ],
            [
                'section_name' => 'BSCS-1B',
                'program_short_name' => 'BSCS',
                'year_level' => 1,
                'semester' => '1st',
                'curriculum_name' => 'CS-2020',
            ],
            [
                'section_name' => 'BSIT-2A',
                'program_short_name' => 'BSIT',
                'year_level' => 2,
                'semester' => '1st',
                'curriculum_name' => 'IT-2020',
            ],
            [
                'section_name' => 'BSEE-3A',
                'program_short_name' => 'BSEE',
                'year_level' => 3,
                'semester' => '2nd',
                'curriculum_name' => 'EE-2020',
            ],
            [
                'section_name' => 'BSME-4A',
                'program_short_name' => 'BSME',
                'year_level' => 4,
                'semester' => '2nd',
                'curriculum_name' => 'ME-2020',
            ],
        ]);
    }
}
