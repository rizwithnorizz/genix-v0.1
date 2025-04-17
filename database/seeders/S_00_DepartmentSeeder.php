<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class S_00_DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('departments')->insert([
            ['department_short_name' => 'CICT', 'department_full_name' => 'College of Information and Communications Technology'],
            ['department_short_name' => 'CIT', 'department_full_name' => 'College of Industrial Technology'],
            ['department_short_name' => 'CENG', 'department_full_name' => 'College of Engineering'],
            ['department_short_name' => 'CNM', 'department_full_name' => 'College of Nursing and Midwifery'],
            ['department_short_name' => 'CBAHM', 'department_full_name' => 'College of Business, Accountancy, and Hotel Management' ],
        ]);
    }
}
