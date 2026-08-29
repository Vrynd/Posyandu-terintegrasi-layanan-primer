<?php

use App\Enums\ScheduleStatus;
use App\Enums\UserRole;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

afterEach(function () {
    Carbon::setTestNow(); // Reset time mock after each test
});

describe('Schedule Effective Status Timeline Scenarios', function () {
    test('skenario jam 10:00 pagi (sebelum jam mulai) berstatus scheduled', function () {
        Carbon::setTestNow('2026-08-26 10:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-26',
            'end_date' => '2026-08-26',
            'start_time' => '13:30:00',
            'end_time' => '16:00:00',
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Scheduled);
    });

    test('skenario jam 14:00 siang (sedang dalam rentang jam kegiatan) otomatis berstatus ongoing', function () {
        Carbon::setTestNow('2026-08-26 14:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-26',
            'end_date' => '2026-08-26',
            'start_time' => '13:30:00',
            'end_time' => '16:00:00',
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Ongoing);
    });

    test('skenario jam 20:00 malam (sudah melewati end_time di hari yang sama) otomatis berstatus completed', function () {
        Carbon::setTestNow('2026-08-26 20:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-26',
            'end_date' => '2026-08-26',
            'start_time' => '13:30:00',
            'end_time' => '16:00:00',
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Completed);
    });

    test('jadwal tanggal kemarin otomatis berstatus completed meskipun status DB masih scheduled', function () {
        Carbon::setTestNow('2026-08-26 09:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-25',
            'end_date' => '2026-08-25',
            'start_time' => '08:00:00',
            'end_time' => '11:00:00',
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Completed);
    });

    test('jadwal masa depan tetap berstatus scheduled', function () {
        Carbon::setTestNow('2026-08-26 09:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-28',
            'end_date' => '2026-08-28',
            'start_time' => '08:00:00',
            'end_time' => '11:00:00',
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Scheduled);
    });

    test('jadwal yang dibatalkan admin tetap berstatus cancelled tanpa terpengaruh waktu', function () {
        Carbon::setTestNow('2026-08-26 14:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-26',
            'end_date' => '2026-08-26',
            'start_time' => '13:30:00',
            'end_time' => '16:00:00',
            'status' => ScheduleStatus::Cancelled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Cancelled);
    });

    test('jadwal hari ini tanpa start_time dan end_time otomatis berstatus ongoing', function () {
        Carbon::setTestNow('2026-08-26 12:00:00');

        $schedule = Schedule::factory()->create([
            'start_date' => '2026-08-26',
            'end_date' => '2026-08-26',
            'start_time' => null,
            'end_time' => null,
            'status' => ScheduleStatus::Scheduled,
        ]);

        expect($schedule->effective_status)->toBe(ScheduleStatus::Ongoing);
    });
});

describe('Schedule Controller and Authorization', function () {
    test('authenticated user can view schedules filtered by year', function () {
        $user = User::factory()->create();

        Schedule::factory()->create([
            'start_date' => '2026-05-10',
            'end_date' => '2026-05-10',
        ]);
        Schedule::factory()->create([
            'start_date' => '2025-05-10',
            'end_date' => '2025-05-10',
        ]);

        $response = $this->actingAs($user)->get('/schedules?year=2026');

        $response->assertOk();
    });

    test('kader can mark schedule as completed', function () {
        $kader = User::factory()->create([
            'role' => UserRole::Kader,
        ]);

        $schedule = Schedule::factory()->create([
            'status' => ScheduleStatus::Scheduled,
        ]);

        $response = $this->actingAs($kader)->patch("/schedules/{$schedule->ulid}/status", [
            'status' => 'completed',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        expect($schedule->fresh()->status)->toBe(ScheduleStatus::Completed);
    });

    test('kader cannot cancel schedule directly', function () {
        $kader = User::factory()->create([
            'role' => UserRole::Kader,
        ]);

        $schedule = Schedule::factory()->create([
            'status' => ScheduleStatus::Scheduled,
        ]);

        $response = $this->actingAs($kader)->patch("/schedules/{$schedule->ulid}/status", [
            'status' => 'cancelled',
        ]);

        $response->assertSessionHasErrors('status');
        expect($schedule->fresh()->status)->toBe(ScheduleStatus::Scheduled);
    });

    test('admin can cancel schedule', function () {
        $admin = User::factory()->create([
            'role' => UserRole::Administrator,
        ]);

        $schedule = Schedule::factory()->create([
            'status' => ScheduleStatus::Scheduled,
        ]);

        $response = $this->actingAs($admin)->patch("/schedules/{$schedule->ulid}/status", [
            'status' => 'cancelled',
        ]);

        $response->assertRedirect();
        expect($schedule->fresh()->status)->toBe(ScheduleStatus::Cancelled);
    });
});

describe('Database Batch Sync Schedules', function () {
    test('syncScheduleStatuses updates past schedules in database to completed', function () {
        Carbon::setTestNow('2026-08-26 00:00:00');

        $pastSchedule = Schedule::factory()->create([
            'start_date' => '2026-08-20',
            'end_date' => '2026-08-20',
            'status' => ScheduleStatus::Scheduled,
        ]);

        $futureSchedule = Schedule::factory()->create([
            'start_date' => '2026-08-28',
            'end_date' => '2026-08-28',
            'status' => ScheduleStatus::Scheduled,
        ]);

        Schedule::syncScheduleStatuses();

        expect($pastSchedule->fresh()->status)->toBe(ScheduleStatus::Completed)
            ->and($futureSchedule->fresh()->status)->toBe(ScheduleStatus::Scheduled);
    });
});
