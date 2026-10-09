<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ParticipantCategory;
use App\Http\Controllers\Controller;
use App\Models\Participant;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request to render the dashboard with real-time statistics.
     */
    public function __invoke(): Response
    {
        $now = now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Agregasi total kumulatif peserta per kategori (1 Query Cepat)
        $countsByCategory = Participant::query()
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $totalParticipants = Participant::count();

        // 2. Agregasi pendaftaran peserta baru bulan ini vs bulan lalu untuk kalkulasi tren
        $newThisMonth = Participant::query()
            ->where('created_at', '>=', $startOfThisMonth)
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $newLastMonth = Participant::query()
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $totalNewThisMonth = Participant::where('created_at', '>=', $startOfThisMonth)->count();
        $totalNewLastMonth = Participant::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        // 3. Kalkulasi data tren masing-masing kartu metrik
        $totalTrend = $this->calculateTrend($totalNewThisMonth, $totalNewLastMonth);
        $pregnantTrend = $this->calculateTrend(
            (int) ($newThisMonth[ParticipantCategory::PregnantMother->value] ?? 0),
            (int) ($newLastMonth[ParticipantCategory::PregnantMother->value] ?? 0)
        );
        $toddlerTrend = $this->calculateTrend(
            (int) ($newThisMonth[ParticipantCategory::Toddler->value] ?? 0),
            (int) ($newLastMonth[ParticipantCategory::Toddler->value] ?? 0)
        );
        $teenagerTrend = $this->calculateTrend(
            (int) ($newThisMonth[ParticipantCategory::Teenager->value] ?? 0),
            (int) ($newLastMonth[ParticipantCategory::Teenager->value] ?? 0)
        );
        $productiveTrend = $this->calculateTrend(
            (int) ($newThisMonth[ParticipantCategory::Productive->value] ?? 0),
            (int) ($newLastMonth[ParticipantCategory::Productive->value] ?? 0)
        );
        $adultTrend = $this->calculateTrend(
            (int) ($newThisMonth[ParticipantCategory::Adult->value] ?? 0),
            (int) ($newLastMonth[ParticipantCategory::Adult->value] ?? 0)
        );

        return Inertia::render('dashboard/Index', [
            'metrics' => [
                'total' => [
                    'value' => $totalParticipants,
                    'change' => $totalTrend['change'],
                    'trend' => $totalTrend['trend'],
                    'period' => $totalTrend['period'],
                ],
                'pregnant' => [
                    'value' => (int) ($countsByCategory[ParticipantCategory::PregnantMother->value] ?? 0),
                    'change' => $pregnantTrend['change'],
                    'trend' => $pregnantTrend['trend'],
                    'period' => $pregnantTrend['period'],
                ],
                'toddler' => [
                    'value' => (int) ($countsByCategory[ParticipantCategory::Toddler->value] ?? 0),
                    'change' => $toddlerTrend['change'],
                    'trend' => $toddlerTrend['trend'],
                    'period' => $toddlerTrend['period'],
                ],
                'teenager' => [
                    'value' => (int) ($countsByCategory[ParticipantCategory::Teenager->value] ?? 0),
                    'change' => $teenagerTrend['change'],
                    'trend' => $teenagerTrend['trend'],
                    'period' => $teenagerTrend['period'],
                ],
                'productive' => [
                    'value' => (int) ($countsByCategory[ParticipantCategory::Productive->value] ?? 0),
                    'change' => $productiveTrend['change'],
                    'trend' => $productiveTrend['trend'],
                    'period' => $productiveTrend['period'],
                ],
                'adult' => [
                    'value' => (int) ($countsByCategory[ParticipantCategory::Adult->value] ?? 0),
                    'change' => $adultTrend['change'],
                    'trend' => $adultTrend['trend'],
                    'period' => $adultTrend['period'],
                ],
            ],
        ]);
    }

    /**
     * Hitung persentase kenaikan/penurunan dan status tren.
     * Jika tidak ada data perbandingan bulan sebelumnya ($previous === 0),
     * tren dan persentase di-set null agar tidak menampilkan indikator semu.
     *
     * @return array{change: ?float, trend: ?string, period: ?string}
     */
    private function calculateTrend(int $current, int $previous): array
    {
        if ($previous === 0) {
            return [
                'change' => null,
                'trend' => null,
                'period' => null,
            ];
        }

        $diff = $current - $previous;
        $change = round(($diff / $previous) * 100, 1);

        return [
            'change' => abs($change),
            'trend' => $diff > 0 ? 'up' : ($diff < 0 ? 'down' : 'neutral'),
            'period' => 'vs bulan lalu',
        ];
    }
}
