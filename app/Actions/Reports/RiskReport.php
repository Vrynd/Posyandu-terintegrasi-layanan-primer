<?php

namespace App\Actions\Reports;

use App\Models\Examination;
use Illuminate\Support\Collection;

class RiskReport
{
    /**
     * Mengambil dan memetakan kasus sasaran berisiko kesehatan serta rujukan faskes pada periode ini.
     *
     * @return Collection<int, mixed>
     */
    public function execute(int $year, int $month): Collection
    {
        return Examination::query()
            ->whereYear('examination_date', $year)
            ->whereMonth('examination_date', $month)
            ->where(function ($query) {
                $query->where('is_referred', true)
                    ->orWhereNotNull('skrining_tbc')
                    ->orWhereHas('toddler', fn ($q) => $q->whereIn('weight_status', ['below_red_line', 'decreased']))
                    ->orWhereHas('pregnantMother', fn ($q) => $q->where('upper_arm_circumference', '<', 23.5))
                    ->orWhereHas('adult', fn ($q) => $q->where('systolic_pressure', '>=', 140)->orWhere('blood_sugar', '>=', 200));
            })
            ->with(['participant', 'creator', 'toddler', 'pregnantMother', 'teen', 'adult'])
            ->get()
            ->map(function (Examination $examination, int $index): array {
                $healthIssues = [];
                $keyMeasurements = [];

                if ($examination->toddler) {
                    if ($examination->toddler->weight_status?->value === 'below_red_line') {
                        $healthIssues[] = 'Balita BGM (Bawah Garis Merah)';
                    }
                    $keyMeasurements[] = "BB: {$examination->weight} kg, PB: {$examination->toddler->height} cm, LiLA: {$examination->toddler->arm_circumference} cm";
                }

                if ($examination->pregnantMother) {
                    if ($examination->pregnantMother->upper_arm_circumference && $examination->pregnantMother->upper_arm_circumference < 23.5) {
                        $healthIssues[] = 'Ibu Hamil KEK (LiLA < 23.5 cm)';
                    }
                    $keyMeasurements[] = "LiLA: {$examination->pregnantMother->upper_arm_circumference} cm, TD: {$examination->pregnantMother->systolic_pressure}/{$examination->pregnantMother->diastolic_pressure} mmHg";
                }

                if ($examination->adult) {
                    if ($examination->adult->systolic_pressure && $examination->adult->systolic_pressure >= 140) {
                        $healthIssues[] = 'Hipertensi';
                    }
                    if ($examination->adult->blood_sugar && $examination->adult->blood_sugar >= 200) {
                        $healthIssues[] = 'Diabetes / Gula Darah Tinggi';
                    }
                    $keyMeasurements[] = "TD: {$examination->adult->systolic_pressure}/{$examination->adult->diastolic_pressure} mmHg, GDS: {$examination->adult->blood_sugar} mg/dL";
                }

                if (! empty($examination->skrining_tbc)) {
                    $healthIssues[] = 'Terduga Gejala TBC';
                }

                if (empty($healthIssues) && $examination->is_referred) {
                    $healthIssues[] = 'Rujukan Pemeriksaan Lanjutan';
                }

                return [
                    'no' => $index + 1,
                    'date' => $examination->examination_date->format('d/m/Y'),
                    'nik' => $examination->participant->nik ?? '-',
                    'name' => $examination->participant->name,
                    'category' => $examination->participant->category->label(),
                    'age_gender' => $examination->participant->gender->label().' / '.$examination->participant->birth_date->age.' Thn',
                    'rt_rw' => 'RT '.($examination->participant->rt ?? '-').' / RW '.($examination->participant->rw ?? '-'),
                    'phone' => $examination->participant->phone ?? '-',
                    'issues' => implode(', ', $healthIssues),
                    'measurements' => implode(' | ', $keyMeasurements),
                    'referral_status' => $examination->is_referred ? 'Dirujuk ke Puskesmas' : 'Pemantauan Posyandu',
                    'location' => $examination->location_label,
                    'education' => ! empty($examination->edukasi) ? implode(', ', (array) $examination->edukasi) : 'Edukasi KIE Standar',
                ];
            });
    }
}
