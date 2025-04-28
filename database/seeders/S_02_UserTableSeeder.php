<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class S_02_UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'superadmin',
            'email' => 'admin@genix.com',
            'password' => 'password',
            'actualPassword' => 'password',
            'user_type' => 0, // Super Admin
        ]);                                                             

        User::create([
            'name' => 'department admin',
            'email' => 'depadmin@genix.com',
            'password' => 'password',
            'actualPassword' => 'password',
            'user_type' => 1, // Department Admin,
            'departmentID' => 1,
        ]);

        User::create([
            'name' => 'guest',
            'email' => 'guest@localhost',
            'password' => 'password',
            'actualPassword' => 'password',
            'user_type' => 2, // Guest
        ]);
    }
}
