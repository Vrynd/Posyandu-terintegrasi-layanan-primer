<?php

use App\Enums\ReportStatus;
use App\Enums\ReportType;
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
            ->has('period')
        );
});

test('user can generate report and change status to completed', function () {
    $user = User::factory()->create();
    $year = Carbon::now()->year;
    $month = Carbon::now()->month;

    $response = $this->actingAs($user)->post(route('reports.generate'), [
        'year' => $year,
        'month' => $month,
        'type' => ReportType::Examination->value,
    ]);

    $response->assertRedirect();

    $report = MonthlyReport::where('year', $year)
        ->where('month', $month)
        ->where('report_type', ReportType::Examination)
        ->first();

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
