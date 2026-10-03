<?php

namespace App\Http\Controllers\Reports;

use App\Actions\Reports\ExportReport;
use App\Actions\Reports\GenerateReport;
use App\Actions\Reports\GetReport;
use App\Enums\ReportType;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        protected GetReport $getReportAction,
        protected GenerateReport $generateReportAction,
        protected ExportReport $exportReportAction
    ) {}

    /**
     * Tampilan halaman index laporan posyandu
     */
    public function index(Request $request): Response
    {
        $year = (int) $request->input('year', Carbon::now()->year);
        $month = (int) $request->input('month', Carbon::now()->month);

        return Inertia::render(
            'reports/Index',
            $this->getReportAction->getIndexData($year, $month)
        );
    }

    /**
     * Aksi: Buat Laporan untuk jenis dokumen tertentu pada periode ini
     */
    public function generate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'year' => ['required', 'integer'],
            'month' => ['required', 'integer', 'between:1,12'],
            'type' => ['required', Rule::enum(ReportType::class)],
        ]);

        $this->generateReportAction->execute(
            (int) $validated['year'],
            (int) $validated['month'],
            ReportType::from($validated['type']),
            $request->user()?->id
        );

        return back()->with('success', 'Laporan posyandu berhasil dibuat dan siap diunduh.');
    }

    /**
     * Aksi: Unduh Dokumen Excel Laporan
     */
    public function download(Request $request, string $type): StreamedResponse
    {
        $reportType = ReportType::tryFrom($type);
        if (! $reportType) {
            abort(404, 'Jenis laporan tidak ditemukan.');
        }

        return $this->exportReportAction->download(
            $reportType,
            (int) $request->input('year', Carbon::now()->year),
            (int) $request->input('month', Carbon::now()->month)
        );
    }
}
