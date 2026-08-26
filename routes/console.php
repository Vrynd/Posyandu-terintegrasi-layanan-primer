<?php

use App\Models\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule as CronSchedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

CronSchedule::call(function () {
    Schedule::syncScheduleStatuses();
})->dailyAt('00:01')->name('sync-expired-schedules');
