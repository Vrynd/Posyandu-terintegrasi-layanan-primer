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
            [
                'title' => 'Posyandu Integrasi Layanan Primer (ILP) Balai RW 01',
                'activity_type' => 'Posyandu Siklus Hidup (ILP)',
                'date' => $now->copy()->addDays(3)->toDateString(),
                'start_time' => '08:30',
                'end_time' => '11:30',
                'location' => 'Balai Dusun Sukamaju RW 01',
                'description' => 'Pelayanan kesehatan terintegrasi untuk balita, ibu hamil, remaja, dan lansia.',
                'status' => ScheduleStatus::Scheduled,
            ],
            [
                'title' => 'Posyandu Balita & Pemberian Vitamin A',
                'activity_type' => 'Bulan Timbang & Vitamin A',
                'date' => $now->copy()->addDays(7)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '11:00',
                'location' => 'Posyandu Melati RW 02',
                'description' => 'Penimbangan berat badan, pengukuran tinggi badan balita, dan distribusi kapsul vitamin A biru/merah.',
                'status' => ScheduleStatus::Scheduled,
            ],
            [
                'title' => 'Posyandu Lansia & Skrining PTM Hari Ini',
                'activity_type' => 'Posyandu Lansia & PTM',
                'date' => $now->toDateString(), // Hari ini
                'start_time' => '08:30',
                'end_time' => '12:00',
                'location' => 'Balai Pertemuan RW 03',
                'description' => 'Pemeriksaan tensi darah, cek gula darah sewaktu, asam urat, kolesterol, dan senam lansia bersama.',
                'status' => ScheduleStatus::Ongoing,
            ],
            [
                'title' => 'Posyandu Remaja & Edukasi Gizi Anemia',
                'activity_type' => 'Posyandu Remaja',
                'date' => $now->copy()->subDays(10)->toDateString(),
                'start_time' => '13:30',
                'end_time' => '16:00',
                'location' => 'Gedung Karang Taruna Desa',
                'description' => 'Pemeriksaan status Hb remaja putri, pembagian tablet tambah darah (TTD), dan konseling kesehatan reproduksi.',
                'status' => ScheduleStatus::Completed,
            ],
            [
                'title' => 'Pemeriksaan Rutin Ibu Hamil & Kelas Bumil',
                'activity_type' => 'Kelas Ibu Hamil',
                'date' => $now->copy()->subDays(20)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '11:30',
                'location' => 'Pustu Desa Karanganyar',
                'description' => 'Pemeriksaan kehamilan rutin bersama Bidan Desa dan sesi senam ibu hamil trimester 2 & 3.',
                'status' => ScheduleStatus::Completed,
            ],
            [
                'title' => 'Pelayanan Vaksinasi Tambahan (Dibatalkan Cuaca Ekstrem)',
                'activity_type' => 'Imunisasi Tambahan',
                'date' => $now->copy()->subDays(5)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '10:30',
                'location' => 'Posyandu Mawar RW 04',
                'description' => 'Jadwal ditunda dan dijadwalkan ulang karena lokasi terkena genangan air banjir.',
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
