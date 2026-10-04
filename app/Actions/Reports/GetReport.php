<?php

namespace App\Actions\Reports;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\MonthlyReport;
use Carbon\Carbon;

class GetReport
{
    /**
     * @return array{
     *     period: array{year: int, month: int, monthName: string},
     *     reports: array<int, array{id: string, title: string, description: string, status: string, statusLabel: string, createdAt: string}>
     * }
     */
    public function execute(int $year, int $month): array
    {
        $existingReports = MonthlyReport::where('year', $year)
            ->where('month', $month)
            ->get()
            ->keyBy(fn (MonthlyReport $report) => $report->report_type->value);

        $reports = collect(ReportType::cases())->map(function (ReportType $type) use ($existingReports): array {
            $record = $existingReports->get($type->value);
            $isCompleted = $record instanceof MonthlyReport && $record->status === ReportStatus::Completed;

            // Format tanggal dibuat (menggunakan locale Indonesia)
            $createdAt = '-';
            if ($record instanceof MonthlyReport && $record->finalized_at) {
                $finalizedDate = $record->finalized_at->copy();
                $finalizedDate->locale('id');
                $createdAt = $finalizedDate->translatedFormat('d F Y');
            }

            return [
                'id' => $type->value,
                'title' => $type->label(),
                'description' => $type->description(),
                'status' => $isCompleted ? 'completed' : 'pending',
                'statusLabel' => $isCompleted ? 'Selesai' : 'Belum Dibuat',
                'createdAt' => $createdAt,
            ];
        })->values()->all();

        // Nama bulan resmi dalam Bahasa Indonesia (contoh: "Oktober")
        $monthDate = Carbon::createFromDate($year, $month, 1);
        $monthDate->locale('id');
        $monthName = $monthDate->translatedFormat('F');

        return [
            'period' => [
                'year' => $year,
                'month' => $month,
                'monthName' => $monthName,
            ],
            'reports' => $reports,
        ];
    }
}
