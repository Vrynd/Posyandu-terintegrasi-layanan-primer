<?php

namespace App\Actions\Reports;

use App\Enums\ParticipantCategory;
use App\Models\Examination;
use Illuminate\Support\Collection;

class ExaminationReport
{
    /**
     * Mengambil rekapitulasi data pemeriksaan 4 siklus hidup pada periode bulan dan tahun tertentu.
     *
     * @return array{
     *     toddler: Collection<int, mixed>,
     *     pregnant: Collection<int, mixed>,
     *     teen: Collection<int, mixed>,
     *     adult: Collection<int, mixed>
     * }
     */
    public function execute(int $year, int $month): array
    {
        $baseQuery = Examination::query()
            ->whereYear('examination_date', $year)
            ->whereMonth('examination_date', $month)
            ->with(['participant', 'creator']);

        $toddlers = (clone $baseQuery)
            ->whereHas('participant', fn ($q) => $q->where('category', ParticipantCategory::Toddler))
            ->with(['toddler', 'participant.toddler'])
            ->get()
            ->map(fn (Examination $e, int $i): array => [
                'no' => $i + 1,
                'tanggal' => $e->examination_date->format('d/m/Y'),
                'lokasi' => $e->location_label,
                'nik' => $e->participant->nik ?? '-',
                'nama' => $e->participant->name,
                'nama_ortu' => $e->participant->toddler ? $e->participant->toddler->parent_name : '-',
                'gender' => $e->participant->gender->label(),
                'umur_bulan' => $e->toddler ? $e->toddler->age_in_months ?? '-' : '-',
                'bb' => $e->weight ?? '-',
                'tb' => $e->toddler ? $e->toddler->height ?? '-' : '-',
                'lk' => $e->toddler ? $e->toddler->head_circumference ?? '-' : '-',
                'lila' => $e->toddler ? $e->toddler->arm_circumference ?? '-' : '-',
                'status_bb' => $e->toddler ? ($e->toddler->weight_status ? $e->toddler->weight_status->value : '-') : '-',
                'gejala_sakit' => ($e->toddler && $e->toddler->has_illness_symptoms) ? 'Ada' : 'Tidak Ada',
                'intervensi' => ($e->toddler && ! empty($e->toddler->interventions)) ? implode(', ', (array) $e->toddler->interventions) : '-',
                'tbc' => ! empty($e->skrining_tbc) ? 'Gejala Terdeteksi' : 'Normal',
                'rujuk' => $e->is_referred ? 'Ya' : 'Tidak',
                'petugas' => $e->creator ? $e->creator->name : 'Kader',
            ]);

        $pregnant = (clone $baseQuery)
            ->whereHas('participant', fn ($q) => $q->where('category', ParticipantCategory::PregnantMother))
            ->with(['pregnantMother', 'pregnantMother.pregnancy'])
            ->get()
            ->map(fn (Examination $e, int $i): array => [
                'no' => $i + 1,
                'tanggal' => $e->examination_date->format('d/m/Y'),
                'lokasi' => $e->location_label,
                'nik' => $e->participant->nik ?? '-',
                'nama' => $e->participant->name,
                'nama_suami' => ($e->pregnantMother && $e->pregnantMother->pregnancy) ? $e->pregnantMother->pregnancy->husband_name : '-',
                'hamil_ke' => ($e->pregnantMother && $e->pregnantMother->pregnancy) ? $e->pregnantMother->pregnancy->pregnancy_number : '-',
                'usia_kehamilan' => ($e->pregnantMother && $e->pregnantMother->gestational_age_weeks) ? $e->pregnantMother->gestational_age_weeks.' Minggu' : '-',
                'bb' => $e->weight ?? '-',
                'lila' => $e->pregnantMother ? $e->pregnantMother->upper_arm_circumference ?? '-' : '-',
                'status_kek' => ($e->pregnantMother && $e->pregnantMother->upper_arm_circumference && $e->pregnantMother->upper_arm_circumference < 23.5) ? 'KEK' : 'Normal',
                'tensi' => ($e->pregnantMother && $e->pregnantMother->systolic_pressure && $e->pregnantMother->diastolic_pressure)
                    ? "{$e->pregnantMother->systolic_pressure}/{$e->pregnantMother->diastolic_pressure}" : '-',
                'ttd' => ($e->pregnantMother && $e->pregnantMother->has_iron_tablets) ? 'Ya' : 'Tidak',
                'konseling' => ($e->pregnantMother && $e->pregnantMother->exclusive_breastfeeding_counseling) ? 'Ya' : 'Tidak',
                'pmt_kek' => ($e->pregnantMother && $e->pregnantMother->receives_pmt_kek) ? 'Ya' : 'Tidak',
                'kelas_bumil' => ($e->pregnantMother && $e->pregnantMother->attends_prenatal_class) ? 'Ya' : 'Tidak',
                'rujuk' => $e->is_referred ? 'Ya' : 'Tidak',
                'petugas' => $e->creator ? $e->creator->name : 'Kader',
            ]);

        $teens = (clone $baseQuery)
            ->whereHas('participant', fn ($q) => $q->where('category', ParticipantCategory::Teenager))
            ->with(['teen'])
            ->get()
            ->map(fn (Examination $e, int $i): array => [
                'no' => $i + 1,
                'tanggal' => $e->examination_date->format('d/m/Y'),
                'lokasi' => $e->location_label,
                'nik' => $e->participant->nik ?? '-',
                'nama' => $e->participant->name,
                'gender' => $e->participant->gender->label(),
                'bb' => $e->weight ?? '-',
                'tb' => $e->teen ? $e->teen->height ?? '-' : '-',
                'lp' => $e->teen ? $e->teen->abdominal_circumference ?? '-' : '-',
                'imt' => $e->teen ? ($e->teen->bmi_category ? $e->teen->bmi_category->value : '-') : '-',
                'tensi' => ($e->teen && $e->teen->systolic_pressure && $e->teen->diastolic_pressure)
                    ? "{$e->teen->systolic_pressure}/{$e->teen->diastolic_pressure}" : '-',
                'gds' => $e->teen ? $e->teen->blood_sugar ?? '-' : '-',
                'hb' => $e->teen ? $e->teen->hemoglobin ?? '-' : '-',
                'rujuk' => $e->is_referred ? 'Ya' : 'Tidak',
                'petugas' => $e->creator ? $e->creator->name : 'Kader',
            ]);

        $adults = (clone $baseQuery)
            ->whereHas('participant', fn ($q) => $q->whereIn('category', [ParticipantCategory::Adult, ParticipantCategory::Productive]))
            ->with(['adult'])
            ->get()
            ->map(fn (Examination $e, int $i): array => [
                'no' => $i + 1,
                'tanggal' => $e->examination_date->format('d/m/Y'),
                'lokasi' => $e->location_label,
                'nik' => $e->participant->nik ?? '-',
                'nama' => $e->participant->name,
                'gender' => $e->participant->gender->label(),
                'kategori' => $e->participant->category->label(),
                'bb' => $e->weight ?? '-',
                'tb' => $e->adult ? $e->adult->height ?? '-' : '-',
                'lp' => $e->adult ? $e->adult->abdominal_circumference ?? '-' : '-',
                'imt' => $e->adult ? ($e->adult->bmi_category ? $e->adult->bmi_category->value : '-') : '-',
                'tensi' => ($e->adult && $e->adult->systolic_pressure && $e->adult->diastolic_pressure)
                    ? "{$e->adult->systolic_pressure}/{$e->adult->diastolic_pressure}" : '-',
                'gds' => $e->adult ? $e->adult->blood_sugar ?? '-' : '-',
                'kolesterol' => $e->adult ? $e->adult->cholesterol ?? '-' : '-',
                'asam_urat' => $e->adult ? $e->adult->uric_acid ?? '-' : '-',
                'merokok' => ($e->adult && $e->adult->is_smoking) ? 'Ya' : 'Tidak',
                'kemandirian_adl' => $e->adult ? ($e->adult->independence_level ? $e->adult->independence_level->value : '-') : '-',
                'rujuk' => $e->is_referred ? 'Ya' : 'Tidak',
                'petugas' => $e->creator ? $e->creator->name : 'Kader',
            ]);

        return [
            'toddler' => $toddlers,
            'pregnant' => $pregnant,
            'teen' => $teens,
            'adult' => $adults,
        ];
    }
}
