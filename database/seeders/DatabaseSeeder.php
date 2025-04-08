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
            DepartmentSeeder::class,
            DepartmentCurriculumSeeder::class,
            ProgramOfferingsTableSeeder::class,
            UserTableSeeder::class,
            InstructorSeeder::class,
            SubjectTableSeeder::class,
            SubjectInstructorSeeder::class,
            ClassroomSeeder::class,
            CourseSectionSeeder::class,
            RoomAssignmentSeeder::class,
            ScheduleSeeder::class,
        ]);
    }
}
