<?php

namespace Database\Seeders;

use App\Models\InvitationCode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InvitationSeeder extends Seeder
{
    /**
     * Run the database seeds for invitation codes sample data.
     */
    public function run(): void
    {
        // 1. Kode Aktif Tambahan (4 Data Baru -> Total 5 Aktif bersama data lama Ratna Wulandari)
        $newActiveCadres = [
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@posyandu.test'],
            ['name' => 'Citra Lestari', 'email' => 'citra.lestari@posyandu.test'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.prasetyo@posyandu.test'],
            ['name' => 'Maya Kartika', 'email' => 'maya.kartika@posyandu.test'],
        ];

        foreach ($newActiveCadres as $cadre) {
            InvitationCode::updateOrCreate(
                ['recipient_email' => $cadre['email']],
                [
                    'user_id' => null,
                    'recipient_name' => $cadre['name'],
                    'code_hash' => InvitationCode::hash(strtoupper(Str::random(16))),
                    'is_used' => false,
                    'used_at' => null,
                    'expires_at' => now()->addDays(7),
                ]
            );
        }

        // 2. Kode Terpakai Tambahan (3 Data Baru -> Total 4 Terpakai bersama data lama Sari Dewi)
        $newUsedCadres = [
            ['name' => 'Fajar Nugraha', 'email' => 'fajar.nugraha@posyandu.test'],
            ['name' => 'Gita Gutawa', 'email' => 'gita.gutawa@posyandu.test'],
            ['name' => 'Hendra Wijaya', 'email' => 'hendra.wijaya@posyandu.test'],
        ];

        foreach ($newUsedCadres as $index => $cadre) {
            InvitationCode::updateOrCreate(
                ['recipient_email' => $cadre['email']],
                [
                    'user_id' => null,
                    'recipient_name' => $cadre['name'],
                    'code_hash' => InvitationCode::hash(strtoupper(Str::random(16))),
                    'is_used' => true,
                    'used_at' => now()->subDays($index + 1),
                    'expires_at' => now()->addDays(7 - $index),
                ]
            );
        }

        // 3. Kode Kadaluarsa Tambahan (3 Data Baru -> Total 3 Kadaluarsa)
        $newExpiredCadres = [
            ['name' => 'Indah Permata', 'email' => 'indah.permata@posyandu.test'],
            ['name' => 'Joko Widodo', 'email' => 'joko.widodo@posyandu.test'],
            ['name' => 'Kiki Amalia', 'email' => 'kiki.amalia@posyandu.test'],
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
                ]
            );
        }
    }
}
