<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@posyandu.id'],
            [
                'name' => 'Administrator Posyandu',
                'nik' => '3512345678900001',
                'role' => UserRole::Administrator,
                'password' => Hash::make('Admin@Posyandu2026!'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'kader@posyandu.id'],
            [
                'name' => 'Kader Posyandu',
                'nik' => '3512345678900002',
                'role' => UserRole::Kader,
                'password' => Hash::make('Kader@Posyandu2026!'),
                'email_verified_at' => now(),
            ]
        );
    }
}
