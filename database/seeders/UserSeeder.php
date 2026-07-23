<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Primary Administrator
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

        // 2. Primary Cadre
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

        // 3. Cadre Sample 1 with Random Invitation Code
        $kaderAni = User::updateOrCreate(
            ['email' => 'kader.ani@posyandu.test'],
            [
                'name' => 'Kader Ani',
                'nik' => '3512345678901234',
                'role' => UserRole::Kader,
                'password' => Hash::make('password'),
                'email_verified_at' => null,
            ]
        );

        $codeAni = Str::upper(Str::random(16));
        InvitationCode::updateOrCreate(
            ['user_id' => $kaderAni->id],
            [
                'code_hash' => InvitationCode::hash($codeAni),
                'is_used' => false,
                'used_at' => null,
                'expires_at' => now()->addDays(7),
            ]
        );

        // 4. Cadre Sample 2 with Random Invitation Code
        $kaderBudi = User::updateOrCreate(
            ['email' => 'kader.budi@posyandu.test'],
            [
                'name' => 'Kader Budi',
                'nik' => '3512345678905678',
                'role' => UserRole::Kader,
                'password' => Hash::make('password'),
                'email_verified_at' => null,
            ]
        );

        $codeBudi = Str::upper(Str::random(16));
        InvitationCode::updateOrCreate(
            ['user_id' => $kaderBudi->id],
            [
                'code_hash' => InvitationCode::hash($codeBudi),
                'is_used' => false,
                'used_at' => null,
                'expires_at' => now()->addDays(7),
            ]
        );

        $this->command->info('Data Pengguna & Kode Undangan Kader Berhasil Dibuat:');
        $this->command->line(" 1. Kode: {$codeAni} (Kader Ani)");
        $this->command->line(" 2. Kode: {$codeBudi} (Kader Budi)");
    }
}
