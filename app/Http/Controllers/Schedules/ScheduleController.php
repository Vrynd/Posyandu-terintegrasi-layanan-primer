<?php

namespace App\Http\Controllers\Schedules;

use App\Enums\ScheduleStatus;
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
     * Menampilkan papan kanban jadwal kegiatan posyandu.
     */
    public function index(): Response
    {
        Schedule::syncScheduleStatuses();
        $schedules = Schedule::query()
            ->with('creator:id,name')
            ->sorted('oldest')
            ->get();

        return Inertia::render('schedules/Index', [
            'schedules' => $schedules,
        ]);
    }

    /**
     * Memperbarui status kegiatan posyandu oleh kader / admin.
     */
    public function updateStatus(Request $request, Schedule $schedule): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(ScheduleStatus::class)],
        ]);

        $schedule->update([
            'status' => $validated['status'],
        ]);

        session()->flash('success', "Kegiatan \"{$schedule->title}\" berhasil ditandai selesai.");

        return back();
    }
}
