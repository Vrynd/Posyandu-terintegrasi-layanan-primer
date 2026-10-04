<?php

namespace App\Actions\Reports;

use App\Enums\ParticipantCategory;
use App\Models\Examination;
use App\Models\Participant;
use Illuminate\Support\Collection;

class AttendanceReport
{
    /**
     * Menghitung statistik cakupan kehadiran Kemenkes (D/S) dan daftar presensi warga pada periode ini.
     *
     * @return array{
     *     summary: list<array<string, mixed>>,
     *     attendances: Collection<int, mixed>
     * }
     */
    public function execute(int $year, int $month): array
    {
        $categories = [
            'Balita' => ParticipantCategory::Toddler,
            'Ibu Hamil' => ParticipantCategory::PregnantMother,
            'Usia Remaja' => ParticipantCategory::Teenager,
            'Usia Produktif' => ParticipantCategory::Productive,
            'Usia Lansia' => ParticipantCategory::Adult,
        ];

        $summary = [];
        $totalTarget = 0;
        $totalHealthPost = 0;
        $totalHomeVisit = 0;

        foreach ($categories as $label => $category) {
            $targetCount = Participant::where('category', $category)->where('is_active', true)->count();
            $healthPostCount = Examination::whereYear('examination_date', $year)
                ->whereMonth('examination_date', $month)
                ->where('location', 'health_post')
                ->whereHas('participant', fn ($q) => $q->where('category', $category))
                ->distinct('participant_id')
                ->count('participant_id');

            $homeVisitCount = Examination::whereYear('examination_date', $year)
                ->whereMonth('examination_date', $month)
                ->where('location', 'home_visit')
                ->whereHas('participant', fn ($q) => $q->where('category', $category))
                ->distinct('participant_id')
                ->count('participant_id');

            $servedCount = $healthPostCount + $homeVisitCount;
            $absentCount = max(0, $targetCount - $servedCount);
            $coveragePercentage = $targetCount > 0 ? round(($servedCount / $targetCount) * 100, 1) : 0;

            $totalTarget += $targetCount;
            $totalHealthPost += $healthPostCount;
            $totalHomeVisit += $homeVisitCount;

            $summary[] = [
                'category' => $label,
                'target' => $targetCount,
                'health_post' => $healthPostCount,
                'home_visit' => $homeVisitCount,
                'served' => $servedCount,
                'absent' => $absentCount,
                'coverage' => $coveragePercentage.' %',
            ];
        }

        $attendances = Participant::where('is_active', true)
            ->with(['examinations' => fn ($q) => $q->whereYear('examination_date', $year)->whereMonth('examination_date', $month)->latest('examination_date')])
            ->get()
            ->map(function (Participant $p, int $index): array {
                $lastExam = $p->examinations->first();
                $attendanceStatus = 'Tidak Hadir';
                $attendanceDate = '-';

                if ($lastExam) {
                    $attendanceStatus = $lastExam->location->value === 'health_post' ? 'Hadir di Posyandu' : 'Kunjungan Rumah';
                    $attendanceDate = $lastExam->examination_date->format('d/m/Y');
                }

                return [
                    'no' => $index + 1,
                    'nik' => $p->nik ?? '-',
                    'name' => $p->name,
                    'category' => $p->category->label(),
                    'rt_rw' => 'RT '.($p->rt ?? '-').' / RW '.($p->rw ?? '-'),
                    'attendance_status' => $attendanceStatus,
                    'attendance_date' => $attendanceDate,
                ];
            });

        return [
            'summary' => $summary,
            'attendances' => $attendances,
        ];
    }
}
