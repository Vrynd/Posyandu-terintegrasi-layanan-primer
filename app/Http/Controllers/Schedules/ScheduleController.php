<?php

namespace App\Http\Controllers\Schedules;

use App\Enums\ScheduleStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    /**
     * Menampilkan papan kalender jadwal kegiatan posyandu.
     */
    public function index(Request $request): Response
    {
        $year = $request->integer('year', now()->year);

        $schedules = Schedule::query()
            ->with('creator:id,name')
            ->inYear($year)
            ->sorted('oldest')
            ->get();

        return Inertia::render('schedules/Index', [
            'schedules' => $schedules,
            'currentYear' => $year,
            'statuses' => ScheduleStatus::toOptions(),
        ]);
    }

    /**
     * Memperbarui status kegiatan posyandu oleh kader / admin.
     */
    public function updateStatus(Request $request, Schedule $schedule): RedirectResponse
    {
        $user = $request->user();

        $allowedStatuses = $user->role === UserRole::Administrator
            ? ScheduleStatus::cases()
            : [ScheduleStatus::Completed];

        $validated = $request->validate([
            'status' => ['required', Rule::in(array_column($allowedStatuses, 'value'))],
        ]);

        $schedule->update([
            'status' => $validated['status'],
        ]);

        $status = ScheduleStatus::from($validated['status']);

        $message = match ($status) {
            ScheduleStatus::Completed => "Kegiatan \"{$schedule->title}\" berhasil ditandai selesai.",
            ScheduleStatus::Cancelled => "Kegiatan \"{$schedule->title}\" berhasil dibatalkan.",
            ScheduleStatus::Ongoing => "Kegiatan \"{$schedule->title}\" ditandai sedang berlangsung.",
            ScheduleStatus::Scheduled => "Kegiatan \"{$schedule->title}\" dikembalikan ke status terjadwal.",
        };

        session()->flash('success', $message);

        return back();
    }
}
