<?php

namespace App\Actions\Reports;

use App\Enums\ParticipantCategory;
use App\Models\Examination;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GetReport
{
    /**
     * 1. Data Sasaran Peserta Aktif
     *
     * @return Collection<int, mixed>
     */
    public function getParticipants(): Collection
    {
        return Participant::query()
            ->with(['toddler', 'latestPregnancy', 'teen', 'adult'])
            ->orderBy('name')
            ->get()
            ->map(function (Participant $p, int $index): array {
                $infoKhusus = match ($p->category) {
                    ParticipantCategory::Toddler => $p->toddler ? 'Ortu: '.$p->toddler->parent_name : '-',
                    ParticipantCategory::PregnantMother => $p->latestPregnancy ? 'Suami: '.$p->latestPregnancy->husband_name : '-',
                    ParticipantCategory::Teenager => $p->teen ? 'Ortu: '.$p->teen->parent_name : '-',
                    ParticipantCategory::Adult, ParticipantCategory::Productive => $p->adult ? 'Pekerjaan: '.$p->adult->employment_label : '-',
                };

                return [
                    'no' => $index + 1,
                    'nik' => $p->nik ?? '-',
                    'name' => $p->name,
                    'category' => $p->category->label(),
                    'gender' => $p->gender->label(),
                    'birth_date' => $p->birth_date->format('d/m/Y'),
                    'age' => $p->birth_date->diff(Carbon::now())->format('%y Thn %m Bln'),
                    'address' => $p->address ?? '-',
                    'rt_rw' => 'RT '.($p->rt ?? '-').' / RW '.($p->rw ?? '-'),
                    'phone' => $p->phone ?? '-',
                    'has_bpjs' => $p->has_bpjs ? 'Ya' : 'Tidak',
                    'bpjs_number' => $p->bpjs_number ?? '-',
                    'info_khusus' => $infoKhusus,
                    'status' => $p->is_active ? 'Aktif' : 'Nonaktif',
                ];
            });
    }

    /**
     * 2. Data Pemeriksaan & Layanan (4 Kategori)
     *
     * @return array{
     *     toddler: Collection<int, mixed>,
     *     pregnant: Collection<int, mixed>,
     *     teen: Collection<int, mixed>,
     *     adult: Collection<int, mixed>
     * }
     */
    public function getExaminations(int $year, int $month): array
    {
        $baseQuery = Examination::query()
            ->whereYear('examination_date', $year)
            ->whereMonth('examination_date', $month)
            ->with(['participant', 'creator']);

        $toddlers = (clone $baseQuery)
            ->whereHas('participant', fn ($q) => $q->where('category', ParticipantCategory::Toddler))
            ->with(['toddler', 'participant.toddler'])
            ->get()
            ->map(fn (Examination $e, int $i) => [
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
            ->map(fn (Examination $e, int $i) => [
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
            ->map(fn (Examination $e, int $i) => [
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
            ->map(fn (Examination $e, int $i) => [
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

    /**
     * 3. Data Kasus Risiko & Rujukan
     *
     * @return Collection<int, mixed>
     */
    public function getRisks(int $year, int $month): Collection
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
            ->map(function (Examination $e, int $index) {
                $masalah = [];
                $pengukuran = [];

                if ($e->toddler) {
                    if ($e->toddler->weight_status?->value === 'below_red_line') {
                        $masalah[] = 'Balita BGM (Bawah Garis Merah)';
                    }
                    $pengukuran[] = "BB: {$e->weight} kg, PB: {$e->toddler->height} cm, LiLA: {$e->toddler->arm_circumference} cm";
                }

                if ($e->pregnantMother) {
                    if ($e->pregnantMother->upper_arm_circumference && $e->pregnantMother->upper_arm_circumference < 23.5) {
                        $masalah[] = 'Ibu Hamil KEK (LiLA < 23.5 cm)';
                    }
                    $pengukuran[] = "LiLA: {$e->pregnantMother->upper_arm_circumference} cm, TD: {$e->pregnantMother->systolic_pressure}/{$e->pregnantMother->diastolic_pressure} mmHg";
                }

                if ($e->adult) {
                    if ($e->adult->systolic_pressure && $e->adult->systolic_pressure >= 140) {
                        $masalah[] = 'Hipertensi';
                    }
                    if ($e->adult->blood_sugar && $e->adult->blood_sugar >= 200) {
                        $masalah[] = 'Diabetes / Gula Darah Tinggi';
                    }
                    $pengukuran[] = "TD: {$e->adult->systolic_pressure}/{$e->adult->diastolic_pressure} mmHg, GDS: {$e->adult->blood_sugar} mg/dL";
                }

                if (! empty($e->skrining_tbc)) {
                    $masalah[] = 'Terduga Gejala TBC';
                }

                if (empty($masalah) && $e->is_referred) {
                    $masalah[] = 'Rujukan Pemeriksaan Lanjutan';
                }

                return [
                    'no' => $index + 1,
                    'tanggal' => $e->examination_date->format('d/m/Y'),
                    'nik' => $e->participant->nik ?? '-',
                    'nama' => $e->participant->name,
                    'kategori' => $e->participant->category->label(),
                    'umur_gender' => $e->participant->gender->label().' / '.$e->participant->birth_date->age.' Thn',
                    'rt_rw' => 'RT '.($e->participant->rt ?? '-').' / RW '.($e->participant->rw ?? '-'),
                    'phone' => $e->participant->phone ?? '-',
                    'masalah' => implode(', ', $masalah),
                    'pengukuran_kunci' => implode(' | ', $pengukuran),
                    'status_rujuk' => $e->is_referred ? 'Dirujuk ke Puskesmas' : 'Pemantauan Posyandu',
                    'lokasi' => $e->location_label,
                    'edukasi' => ! empty($e->edukasi) ? implode(', ', (array) $e->edukasi) : 'Edukasi KIE Standar',
                ];
            });
    }

    /**
     * 4. Data Kehadiran Posyandu (Statistik & Presensi)
     *
     * @return array{
     *     rekap: list<array<string, mixed>>,
     *     presensi: Collection<int, mixed>
     * }
     */
    public function getAttendance(int $year, int $month): array
    {
        $categories = [
            'Balita' => ParticipantCategory::Toddler,
            'Ibu Hamil' => ParticipantCategory::PregnantMother,
            'Usia Remaja' => ParticipantCategory::Teenager,
            'Usia Produktif' => ParticipantCategory::Productive,
            'Usia Lansia' => ParticipantCategory::Adult,
        ];

        $rekap = [];
        $totalS = 0;
        $totalH = 0;
        $totalK = 0;

        foreach ($categories as $label => $category) {
            $sasaran = Participant::where('category', $category)->where('is_active', true)->count();
            $posyandu = Examination::whereYear('examination_date', $year)
                ->whereMonth('examination_date', $month)
                ->where('location', 'health_post')
                ->whereHas('participant', fn ($q) => $q->where('category', $category))
                ->distinct('participant_id')
                ->count('participant_id');

            $kunjungan = Examination::whereYear('examination_date', $year)
                ->whereMonth('examination_date', $month)
                ->where('location', 'home_visit')
                ->whereHas('participant', fn ($q) => $q->where('category', $category))
                ->distinct('participant_id')
                ->count('participant_id');

            $terlayani = $posyandu + $kunjungan;
            $absen = max(0, $sasaran - $terlayani);
            $persen = $sasaran > 0 ? round(($terlayani / $sasaran) * 100, 1) : 0;

            $totalS += $sasaran;
            $totalH += $posyandu;
            $totalK += $kunjungan;

            $rekap[] = [
                'kelompok' => $label,
                'sasaran' => $sasaran,
                'posyandu' => $posyandu,
                'kunjungan' => $kunjungan,
                'terlayani' => $terlayani,
                'absen' => $absen,
                'persen' => $persen.' %',
            ];
        }

        $presensi = Participant::where('is_active', true)
            ->with(['examinations' => fn ($q) => $q->whereYear('examination_date', $year)->whereMonth('examination_date', $month)->latest('examination_date')])
            ->get()
            ->map(function (Participant $p, int $i) {
                $lastExam = $p->examinations->first();
                $statusHadir = 'Tidak Hadir';
                $tglHadir = '-';

                if ($lastExam) {
                    $statusHadir = $lastExam->location->value === 'health_post' ? 'Hadir di Posyandu' : 'Kunjungan Rumah';
                    $tglHadir = $lastExam->examination_date->format('d/m/Y');
                }

                return [
                    'no' => $i + 1,
                    'nik' => $p->nik ?? '-',
                    'nama' => $p->name,
                    'kategori' => $p->category->label(),
                    'rt_rw' => 'RT '.($p->rt ?? '-').' / RW '.($p->rw ?? '-'),
                    'status_hadir' => $statusHadir,
                    'tanggal_hadir' => $tglHadir,
                ];
            });

        return [
            'rekap' => $rekap,
            'presensi' => $presensi,
        ];
    }
}
