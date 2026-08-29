<?php

namespace Database\Seeders;

use App\Enums\ScheduleStatus;
use App\Enums\UserRole;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari user administrator untuk pemilik jadwal
        $admin = User::where('role', UserRole::Administrator)->first() ?? User::first();
        $adminId = $admin?->id;
        $now = Carbon::now();
        Schedule::query()->delete();

        $schedules = [
            // --- HARI INI (3 KEGIATAN) ---
            [
                'title' => 'Posyandu Lansia & Skrining PTM Hari Ini',
                'start_date' => $now->toDateString(),
                'end_date' => $now->toDateString(),
                'start_time' => '08:30',
                'end_time' => '11:30',
                'location' => 'Balai Pertemuan RW 03',
                'status' => ScheduleStatus::Ongoing,
            ],
            [
                'title' => 'Kelas Edukasi PMT Balita Gizi Kurang',
                'start_date' => $now->toDateString(),
                'end_date' => $now->toDateString(),
                'start_time' => '13:00',
                'end_time' => '15:00',
                'location' => 'Posyandu Mawar RW 03',
                'status' => ScheduleStatus::Scheduled,
            ],
            [
                'title' => 'Pemeriksaan Tumbuh Kembang & Imunisasi Lanjutan',
                'start_date' => $now->toDateString(),
                'end_date' => $now->toDateString(),
                'start_time' => '15:30',
                'end_time' => '17:00',
                'location' => 'Puskesmas Pembantu (Pustu)',
                'status' => ScheduleStatus::Scheduled,
            ],

            // --- 3 HARI LAGI (2 KEGIATAN) ---
            [
                'title' => 'Posyandu Integrasi Layanan Primer (ILP) Balai RW 01',
                'start_date' => $now->copy()->addDays(3)->toDateString(),
                'end_date' => $now->copy()->addDays(3)->toDateString(),
                'start_time' => '08:30',
                'end_time' => '11:30',
                'location' => 'Balai Dusun Sukamaju RW 01',
                'status' => ScheduleStatus::Scheduled,
            ],
            [
                'title' => 'Kunjungan Rumah Balita Risiko Stunting',
                'start_date' => $now->copy()->addDays(3)->toDateString(),
                'end_date' => $now->copy()->addDays(3)->toDateString(),
                'start_time' => '13:30',
                'end_time' => '15:30',
                'location' => 'Rumah Warga RW 01',
                'status' => ScheduleStatus::Scheduled,
            ],

            // --- 7 HARI LAGI ---
            [
                'title' => 'Posyandu Balita & Pemberian Vitamin A',
                'start_date' => $now->copy()->addDays(7)->toDateString(),
                'end_date' => $now->copy()->addDays(7)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '11:00',
                'location' => 'Posyandu Melati RW 02',
                'status' => ScheduleStatus::Scheduled,
            ],

            // --- KEGIATAN SELESAI (MASA LALU) ---
            [
                'title' => 'Posyandu Remaja & Edukasi Gizi Anemia',
                'start_date' => $now->copy()->subDays(10)->toDateString(),
                'end_date' => $now->copy()->subDays(10)->toDateString(),
                'start_time' => '13:30',
                'end_time' => '16:00',
                'location' => 'Gedung Karang Taruna Desa',
                'status' => ScheduleStatus::Completed,
            ],
            [
                'title' => 'Pemeriksaan Rutin Ibu Hamil & Kelas Bumil',
                'start_date' => $now->copy()->subDays(20)->toDateString(),
                'end_date' => $now->copy()->subDays(20)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '11:30',
                'location' => 'Pustu Desa Karanganyar',
                'status' => ScheduleStatus::Completed,
            ],
            [
                'title' => 'Pelayanan Vaksinasi Tambahan (Dibatalkan Cuaca Ekstrem)',
                'start_date' => $now->copy()->subDays(5)->toDateString(),
                'end_date' => $now->copy()->subDays(5)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '10:30',
                'location' => 'Posyandu Mawar RW 04',
                'status' => ScheduleStatus::Cancelled,
            ],
        ];

        foreach ($schedules as $schedule) {
            Schedule::create([
                ...$schedule,
                'user_id' => $adminId,
            ]);
        }
    }
}
