<?php

namespace App\Http\Controllers\Reports;

use App\Actions\Reports\ExportReport;
use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Examination;
use App\Models\MonthlyReport;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        protected ExportReport $exportAction
    ) {}

    public function index(Request $request): Response
    {
        $year = (int) $request->input('year', Carbon::now()->year);
        $month = (int) $request->input('month', Carbon::now()->month);

        $reportRecord = MonthlyReport::where('year', $year)
            ->where('month', $month)
            ->first();

        $isFinalized = $reportRecord?->isFinalized() ?? false;
        $finalizedDate = $reportRecord?->finalized_at?->translatedFormat('d F Y') ?? null;

        $examinationCount = Examination::whereYear('examination_date', $year)
            ->whereMonth('examination_date', $month)
            ->count();

        $reports = [
            [
                'id' => 'examination',
                'title' => 'Laporan Pemeriksaan & Layanan',
                'description' => 'Rekapitulasi hasil penimbangan, antropometri, dan pemeriksaan posyandu ILP.',
                'status' => $isFinalized ? 'completed' : 'pending',
                'statusLabel' => $isFinalized ? 'Selesai' : 'Belum Selesai',
                'createdAt' => $finalizedDate ?? 'Belum Difinalisasi',
            ],
            [
                'id' => 'participant',
                'title' => 'Laporan Data Sasaran Peserta',
                'description' => 'Rekapitulasi demografi peserta aktif, kelompok siklus hidup, dan registrasi warga.',
                'status' => 'completed',
                'statusLabel' => 'Selesai',
                'createdAt' => Carbon::now()->translatedFormat('d F Y'),
            ],
            [
                'id' => 'risk',
                'title' => 'Laporan Kasus Risiko & Rujukan',
                'description' => 'Deteksi dini risiko kesehatan sasaran, tindak lanjut, dan rujukan faskes.',
                'status' => $isFinalized ? 'completed' : 'pending',
                'statusLabel' => $isFinalized ? 'Selesai' : 'Belum Selesai',
                'createdAt' => $finalizedDate ?? 'Belum Difinalisasi',
            ],
            [
                'id' => 'attendance',
                'title' => 'Laporan Kehadiran Posyandu',
                'description' => 'Tingkat presensi dan rekap kehadiran kunjungan sasaran per hari buka posyandu.',
                'status' => $isFinalized ? 'completed' : 'pending',
                'statusLabel' => $isFinalized ? 'Selesai' : 'Belum Selesai',
                'createdAt' => $finalizedDate ?? 'Belum Difinalisasi',
            ],
        ];

        return Inertia::render('reports/Index', [
            'reports' => $reports,
            'currentPeriod' => [
                'year' => $year,
                'month' => $month,
                'monthName' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F'),
                'isFinalized' => $isFinalized,
                'finalizedAt' => $finalizedDate,
                'examinationCount' => $examinationCount,
            ],
        ]);
    }

    public function finalize(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'year' => ['required', 'integer'],
            'month' => ['required', 'integer', 'between:1,12'],
        ]);

        MonthlyReport::updateOrCreate(
            ['year' => $validated['year'], 'month' => $validated['month']],
            [
                'status' => ReportStatus::Completed,
                'finalized_at' => Carbon::now(),
                'finalized_by' => $request->user()?->id,
            ]
        );

        return back()->with('success', 'Laporan posyandu berhasil difinalisasi dan siap diunduh.');
    }

    public function reopen(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'year' => ['required', 'integer'],
            'month' => ['required', 'integer', 'between:1,12'],
        ]);

        MonthlyReport::updateOrCreate(
            ['year' => $validated['year'], 'month' => $validated['month']],
            [
                'status' => ReportStatus::Draft,
                'finalized_at' => null,
            ]
        );

        return back()->with('success', 'Kunci laporan berhasil dibuka untuk perubahan data.');
    }

    public function download(Request $request, string $type): StreamedResponse
    {
        $year = (int) $request->input('year', Carbon::now()->year);
        $month = (int) $request->input('month', Carbon::now()->month);

        return match ($type) {
            'participant' => $this->exportAction->exportParticipants(),
            'examination' => $this->exportAction->exportExaminations($year, $month),
            'risk' => $this->exportAction->exportRisks($year, $month),
            'attendance' => $this->exportAction->exportAttendance($year, $month),
            default => abort(404, 'Jenis laporan tidak ditemukan.'),
        };
    }
}
