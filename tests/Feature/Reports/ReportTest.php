<?php

use App\Enums\ReportStatus;
use App\Models\MonthlyReport;
use App\Models\User;
use Carbon\Carbon;

test('authenticated user can view report index with dynamic period', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('reports.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reports/Index')
            ->has('reports', 4)
            ->has('currentPeriod')
        );
});

test('user can finalize monthly report and change status to completed', function () {
    $user = User::factory()->create();
    $year = Carbon::now()->year;
    $month = Carbon::now()->month;

    $response = $this->actingAs($user)->post(route('reports.finalize'), [
        'year' => $year,
        'month' => $month,
    ]);

    $response->assertRedirect();

    $report = MonthlyReport::where('year', $year)->where('month', $month)->first();
    expect($report)->not->toBeNull()
        ->and($report->status)->toBe(ReportStatus::Completed)
        ->and($report->finalized_by)->toBe($user->id);
});

test('user can download participant excel report', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('reports.download', ['type' => 'participant']));

    $response->assertOk()
        ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
});
