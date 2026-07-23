<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvitationCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kaderAni = User::firstOrCreate(
            ['email' => 'kader.ani@posyandu.test'],
            [
                'name' => 'Kader Ani',
                'nik' => '3512345678901234',
                'password' => bcrypt('password'),
                'role' => UserRole::Kader,
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

        $kaderBudi = User::firstOrCreate(
            ['email' => 'kader.budi@posyandu.test'],
            [
                'name' => 'Kader Budi',
                'nik' => '3512345678905678',
                'password' => bcrypt('password'),
                'role' => UserRole::Kader,
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

        $this->command->info('Kode Undangan Acak (16 Karakter) Berhasil Dibuat:');
        $this->command->line(" 1. Kode: {$codeAni} (Kader Ani)");
        $this->command->line(" 2. Kode: {$codeBudi} (Kader Budi)");
    }
}
