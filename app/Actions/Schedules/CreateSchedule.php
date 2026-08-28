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
            'activity_type' => $validated['activity_type'] ?? null,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'location' => $validated['location'],
            'description' => $validated['description'] ?? null,
            'status' => ScheduleStatus::Scheduled->value,
        ]);
    }
}
