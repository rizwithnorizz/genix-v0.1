<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'superadmin',
            'email' => 'admin@localhost',
            'password' => Hash::make('password'),
            'user_type' => 0, // Super Admin
        ]);                                                             

        User::create([
            'name' => 'department admin',
            'email' => 'depadmin@localhost',
            'password' => Hash::make('password'),
            'user_type' => 1, // Department Admin
        ]);

        User::create([
            'name' => 'guest',
            'email' => 'guest@localhost',
            'password' => Hash::make('password'),
            'user_type' => 2, // Guest
        ]);
    }
}
