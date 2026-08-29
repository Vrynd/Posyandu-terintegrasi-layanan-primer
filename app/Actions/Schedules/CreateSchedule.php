<?php

namespace App\Actions\Schedules;

use App\Enums\ScheduleStatus;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;

class CreateSchedule
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated): Schedule
    {
        return Schedule::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'location' => $validated['location'],
            'start_date' => $validated['start_date'],
            'end_date' => ! empty($validated['end_date']) ? $validated['end_date'] : $validated['start_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'status' => ScheduleStatus::Scheduled->value,
        ]);
    }
}
