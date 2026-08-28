<?php

namespace App\Http\Controllers\Schedules;

use App\Enums\ScheduleStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Schedules\IndexScheduleRequest;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    private const historySyncKey = 'schedules:last-synced';

    private const historySyncInterval = 5;

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

    public function history(IndexScheduleRequest $request): Response
    {
        Cache::remember(
            self::historySyncKey,
            now()->addMinutes(self::historySyncInterval),
            function () {
                Schedule::syncScheduleStatuses();

                return true;
            },
        );

        $filters = $request->toFilters();
        $month = $filters['month'];
        $year = $filters['year'] ?? now()->year;

        $baseQuery = fn (string $status) => Schedule::query()
            ->with('creator:id,name')
            ->ofStatus($status)
            ->inMonth($month)
            ->inYear($year)
            ->sorted('latest');

        return Inertia::render('schedules/History', [
            'completedSchedules' => $baseQuery(ScheduleStatus::Completed->value)->get(),
            'cancelledSchedules' => $baseQuery(ScheduleStatus::Cancelled->value)->get(),
            'filters' => [
                'month' => $month,
                'year' => $year,

            ],
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

    public function destroy(Schedule $schedule): RedirectResponse
    {
        if (! in_array($schedule->status, [ScheduleStatus::Completed, ScheduleStatus::Cancelled], true)) {
            abort(422, 'Hanya kegiatan yang sudah selesai atau dibatalkan yang bisa dihapus.');
        }

        $title = $schedule->title;
        $schedule->delete();

        session()->flash('success', "Riwayat kegiatan \"{$title}\" berhasil dihapus.");

        return back();
    }

    public function clear(): RedirectResponse
    {
        Schedule::query()
            ->whereIn('status', [ScheduleStatus::Completed->value, ScheduleStatus::Cancelled->value])
            ->delete();

        session()->flash('success', 'Seluruh riwayat kegiatan berhasil dihapus.');

        return redirect()->route('schedules.history');
    }
}
