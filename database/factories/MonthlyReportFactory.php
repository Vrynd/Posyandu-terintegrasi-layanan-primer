<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Models\MonthlyReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MonthlyReport>
 */
class MonthlyReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'year' => (int) date('Y'),
            'month' => (int) date('n'),
            'status' => ReportStatus::Draft,
            'finalized_at' => null,
            'finalized_by' => null,
            'notes' => null,
        ];
    }
}
