<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InvitationSeeder extends Seeder
{
    /**
     * Run the database seeds for invitation codes sample data.
     */
    public function run(): void
    {
        // 1. Kode Aktif
        $newActiveCadres = [
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@posyandu.test'],
            ['name' => 'Citra Lestari', 'email' => 'citra.lestari@posyandu.test'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.prasetyo@posyandu.test'],
            ['name' => 'Ratna Wulandari', 'email' => 'ratna.wulandari@posyandu.test'],
            ['name' => 'Maya Kartika', 'email' => 'maya.kartika@posyandu.test'],
            ['name' => 'Nia Ramadhani', 'email' => 'nia.ramadhani@posyandu.test'],
            ['name' => 'Oki Setiana', 'email' => 'oki.setiana@posyandu.test'],
        ];

        foreach ($newActiveCadres as $index => $cadre) {
            InvitationCode::updateOrCreate(
                ['recipient_email' => $cadre['email']],
                [
                    'user_id' => null,
                    'recipient_name' => $cadre['name'],
                    'code_hash' => InvitationCode::hash(strtoupper(Str::random(16))),
                    'is_used' => false,
                    'used_at' => null,
                    'expires_at' => now()->addDays($index + 2),
                    'created_at' => now()->subHours($index * 6),
                ]
            );
        }

        // 2. Kode Terpakai
        $newUsedCadres = [
            ['name' => 'Fajar Nugraha', 'email' => 'fajar.nugraha@posyandu.test'],
            ['name' => 'Gita Gutawa', 'email' => 'gita.gutawa@posyandu.test'],
            ['name' => 'Hendra Wijaya', 'email' => 'hendra.wijaya@posyandu.test'],
            ['name' => 'Sari Dewi', 'email' => 'sari.dewi@posyandu.test'],
            ['name' => 'Putri Ayu', 'email' => 'putri.ayu@posyandu.test'],
            ['name' => 'Rian Dmasiv', 'email' => 'rian.dmasiv@posyandu.test'],
        ];

        foreach ($newUsedCadres as $index => $cadre) {
            $user = User::updateOrCreate(
                ['email' => $cadre['email']],
                [
                    'name' => $cadre['name'],
                    'nik' => '351234567890000'.($index + 3),
                    'role' => UserRole::Kader,
                    'password' => Hash::make('Kader@Posyandu2026!'),
                    'email_verified_at' => now(),
                ]
            );

            InvitationCode::updateOrCreate(
                ['recipient_email' => $cadre['email']],
                [
                    'user_id' => $user->id,
                    'recipient_name' => $cadre['name'],
                    'code_hash' => InvitationCode::hash(strtoupper(Str::random(16))),
                    'is_used' => true,
                    'used_at' => now()->subDays($index + 1),
                    'expires_at' => now()->addDays(7 - $index),
                    'created_at' => now()->subDays($index + 2),
                ]
            );
        }

        // 3. Kode Kadaluarsa
        $newExpiredCadres = [
            ['name' => 'Indah Permata', 'email' => 'indah.permata@posyandu.test'],
            ['name' => 'Joko Widodo', 'email' => 'joko.widodo@posyandu.test'],
            ['name' => 'Kiki Amalia', 'email' => 'kiki.amalia@posyandu.test'],
            ['name' => 'Lukman Sardi', 'email' => 'lukman.sardi@posyandu.test'],
            ['name' => 'Titi Kamal', 'email' => 'titi.kamal@posyandu.test'],
        ];

        foreach ($newExpiredCadres as $index => $cadre) {
            InvitationCode::updateOrCreate(
                ['recipient_email' => $cadre['email']],
                [
                    'user_id' => null,
                    'recipient_name' => $cadre['name'],
                    'code_hash' => InvitationCode::hash(strtoupper(Str::random(16))),
                    'is_used' => false,
                    'used_at' => null,
                    'expires_at' => now()->subDays($index + 1),
                    'created_at' => now()->subDays($index + 5),
                ]
            );
        }
    }
}
