<?php

namespace App\Http\Controllers\Schedules;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    /**
     * Menampilkan papan kanban jadwal kegiatan posyandu.
     */
    public function index(): Response
    {
        $schedules = Schedule::query()
            ->with('creator:id,name')
            ->sorted('oldest')
            ->get();

        return Inertia::render('schedules/Index', [
            'schedules' => $schedules,
        ]);
    }
}
