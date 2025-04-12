<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            S_00_DepartmentSeeder::class,
            S_01_ProgramOfferingsTableSeeder::class,
            S_02_UserTableSeeder::class,
            S_03_DepartmentCurriculumSeeder::class,
            S_04_InstructorSeeder::class,
            S_05_SubjectTableSeeder::class,
            S_06_SubjectInstructorSeeder::class,
            S_07_ClassroomSeeder::class,
            S_08_CourseSectionSeeder::class,
            S_09_DepartmentRoomSeeder::class,
            S_10_ScheduleSeeder::class,
            S_11_CourseSubjectSeeder::class,
        ]);
    }
}
