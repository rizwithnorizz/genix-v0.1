<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class RoomAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('room_assignments')->insert([
            [
                'section_name' => 'BSCS-1A',
                'room_number' => 'R101',
            ],
            [
                'section_name' => 'BSCS-1B',
                'room_number' => 'R102',
            ],
            [
                'section_name' => 'BSIT-2A',
                'room_number' => 'Lab1',
            ],
            [
                'section_name' => 'BSEE-3A',
                'room_number' => 'Lab2',
            ],
            [
                'section_name' => 'BSME-4A',
                'room_number' => 'R201',
            ],
        ]);
    }
}
