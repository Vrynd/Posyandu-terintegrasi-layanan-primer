<?php

namespace App\Actions\Reports;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\MonthlyReport;
use Carbon\Carbon;

class GenerateReport
{
    /**
     * Eksekusi pembuatan atau pembaruan status laporan jenis tertentu pada periode posyandu.
     */
    public function execute(int $year, int $month, ReportType $reportType, ?int $userId = null): MonthlyReport
    {
        return MonthlyReport::updateOrCreate(
            [
                'year' => $year,
                'month' => $month,
                'report_type' => $reportType,
            ],
            [
                'status' => ReportStatus::Completed,
                'finalized_at' => Carbon::now(),
                'finalized_by' => $userId,
            ]
        );
    }
}
