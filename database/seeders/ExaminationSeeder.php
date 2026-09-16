<?php

namespace Database\Seeders;

use App\Enums\BmiCategory;
use App\Enums\ExaminationLocation;
use App\Enums\IndependenceLevel;
use App\Enums\ParticipantCategory;
use App\Enums\SensoryTestResult;
use App\Enums\WeightStatus;
use App\Models\Examination;
use App\Models\ExaminationAdult;
use App\Models\ExaminationPregnantMother;
use App\Models\ExaminationTeen;
use App\Models\ExaminationToddler;
use App\Models\Participant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ExaminationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        ExaminationAdult::truncate();
        ExaminationTeen::truncate();
        ExaminationPregnantMother::truncate();
        ExaminationToddler::truncate();
        Examination::truncate();
        Schema::enableForeignKeyConstraints();

        $kader = User::where('email', 'kader@posyandu.id')->first() ?? User::first();
        $userId = $kader?->id;

        $participants = Participant::with(['latestPregnancy'])->get();

        foreach ($participants as $participant) {
            match ($participant->category) {
                ParticipantCategory::Toddler => $this->seedToddlerExaminations($participant, $userId),
                ParticipantCategory::PregnantMother => $this->seedPregnantMotherExaminations($participant, $userId),
                ParticipantCategory::Teenager => $this->seedTeenagerExaminations($participant, $userId),
                ParticipantCategory::Productive => $this->seedProductiveExaminations($participant, $userId),
                ParticipantCategory::Adult => $this->seedAdultExaminations($participant, $userId),
            };
        }
    }

    private function seedToddlerExaminations(Participant $participant, ?int $userId): void
    {
        $ageMonths = max(6, Carbon::parse($participant->birth_date)->diffInMonths(now()));

        // 1. Pemeriksaan Bulan Lalu
        $prevDate = now()->subMonth()->startOfMonth()->addDays(8);
        $prevExam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $prevDate->toDateString(),
            'weight' => 11.20,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Demam tidak diketahui sebab: Tidak',
                'BB tidak naik / turun: Tidak',
            ],
            'edukasi' => [
                'Pemberian gizi seimbang balita',
                'Pola asuh dan stimulasi motorik',
            ],
        ]);

        ExaminationToddler::create([
            'examination_id' => $prevExam->id,
            'age_in_months' => $ageMonths - 1,
            'weight_status' => WeightStatus::Increased,
            'height' => 84.20,
            'head_circumference' => 46.50,
            'arm_circumference' => 14.80,
            'has_illness_symptoms' => false,
            'interventions' => ['Vitamin A Kapsul Biru'],
        ]);

        // 2. Pemeriksaan Terbaru Bulan Ini
        $currentDate = now()->startOfMonth()->addDays(10);
        $currentExam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $currentDate->toDateString(),
            'weight' => 11.80,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Demam tidak diketahui sebab: Tidak',
                'BB tidak naik / turun: Tidak',
            ],
            'edukasi' => [
                'Pantau tumbuh kembang di Buku KIA',
                'Sanitasi lingkungan dan cuci tangan pakai sabun',
            ],
        ]);

        ExaminationToddler::create([
            'examination_id' => $currentExam->id,
            'age_in_months' => $ageMonths,
            'weight_status' => WeightStatus::Increased,
            'height' => 85.50,
            'head_circumference' => 47.00,
            'arm_circumference' => 15.10,
            'has_illness_symptoms' => false,
            'interventions' => ['PMT Pemulihan Berbahan Pangan Lokal'],
        ]);
    }

    private function seedPregnantMotherExaminations(Participant $participant, ?int $userId): void
    {
        // 1. Pemeriksaan Bulan Lalu (Trimester 2 awal)
        $prevDate = now()->subMonth()->startOfMonth()->addDays(8);
        $prevExam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $prevDate->toDateString(),
            'weight' => 56.50,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Demam tidak jelas: Tidak',
            ],
            'edukasi' => [
                'Konsumsi makanan kaya protein & zat besi',
                'Istirahat teratur minimal 8 jam sehari',
            ],
        ]);

        ExaminationPregnantMother::create([
            'examination_id' => $prevExam->id,
            'pregnancy_id' => $participant->latestPregnancy?->id,
            'gestational_age_weeks' => 20,
            'upper_arm_circumference' => 24.20,
            'systolic_pressure' => 112,
            'diastolic_pressure' => 74,
            'has_iron_tablets' => true,
            'exclusive_breastfeeding_counseling' => true,
            'receives_pmt_kek' => false,
            'attends_prenatal_class' => true,
        ]);

        // 2. Pemeriksaan Terbaru Bulan Ini
        $currentDate = now()->startOfMonth()->addDays(10);
        $currentExam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $currentDate->toDateString(),
            'weight' => 58.00,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Demam tidak jelas: Tidak',
            ],
            'edukasi' => [
                'Mengenali tanda bahaya kehamilan',
                'Persiapan persalinan aman di fasilitas kesehatan',
            ],
        ]);

        ExaminationPregnantMother::create([
            'examination_id' => $currentExam->id,
            'pregnancy_id' => $participant->latestPregnancy?->id,
            'gestational_age_weeks' => 24,
            'upper_arm_circumference' => 24.80,
            'systolic_pressure' => 116,
            'diastolic_pressure' => 76,
            'has_iron_tablets' => true,
            'exclusive_breastfeeding_counseling' => true,
            'receives_pmt_kek' => false,
            'attends_prenatal_class' => true,
        ]);
    }

    private function seedTeenagerExaminations(Participant $participant, ?int $userId): void
    {
        $currentDate = now()->startOfMonth()->addDays(9);
        $exam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $currentDate->toDateString(),
            'weight' => 48.50,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Keringat malam tanpa aktivitas: Tidak',
            ],
            'edukasi' => [
                'Pentingnya tablet tambah darah untuk remaja putri',
                'Gaya hidup aktif dan hindari screen time berlebihan',
            ],
        ]);

        ExaminationTeen::create([
            'examination_id' => $exam->id,
            'height' => 158.00,
            'abdominal_circumference' => 68.00,
            'systolic_pressure' => 110,
            'diastolic_pressure' => 70,
            'blood_sugar' => 92.00,
            'hemoglobin' => '12.8',
            'bmi_category' => BmiCategory::Normal,
            'mental_screenings' => [
                'Skor SRQ-20: 2 (Kondisi Emosional Normal)',
                'Tidak mengalami gangguan tidur / cemas berlebih',
            ],
        ]);
    }

    private function seedProductiveExaminations(Participant $participant, ?int $userId): void
    {
        $currentDate = now()->startOfMonth()->addDays(10);
        $exam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $currentDate->toDateString(),
            'weight' => 65.20,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk terus menerus: Tidak',
                'Penurunan berat badan drastis: Tidak',
            ],
            'edukasi' => [
                'Batasi konsumsi gula, garam, dan lemak (GGL)',
                'Lakukan aktivitas fisik minimal 30 menit sehari',
            ],
        ]);

        ExaminationAdult::create([
            'examination_id' => $exam->id,
            'height' => 167.50,
            'abdominal_circumference' => 81.00,
            'systolic_pressure' => 120,
            'diastolic_pressure' => 80,
            'blood_sugar' => 104.00,
            'uric_acid' => 5.40,
            'cholesterol' => 182.00,
            'eye_test' => SensoryTestResult::Normal,
            'ear_test' => SensoryTestResult::Normal,
            'contraceptive' => 'Kondom',
            'bmi_category' => BmiCategory::Normal,
            'is_smoking' => false,
            'high_sugar_intake' => false,
            'high_salt_intake' => false,
            'high_fat_intake' => false,
            'puma_score' => 2,
            'puma_screenings' => [
                'Skor PUMA: 2 (Risiko Rendah PPOK)',
            ],
            'adl_score' => 20,
            'independence_level' => IndependenceLevel::Independent,
            'adl_screenings' => [
                'Semua instrumen ADL mandiri tanpa bantuan',
            ],
        ]);
    }

    private function seedAdultExaminations(Participant $participant, ?int $userId): void
    {
        $currentDate = now()->startOfMonth()->addDays(10);
        $exam = Examination::create([
            'participant_id' => $participant->id,
            'created_by' => $userId,
            'examination_date' => $currentDate->toDateString(),
            'weight' => 59.00,
            'is_referred' => false,
            'location' => ExaminationLocation::HealthPost,
            'skrining_tbc' => [
                'Batuk > 2 minggu: Tidak',
                'Keringat dingin malam hari: Tidak',
            ],
            'edukasi' => [
                'Kurangi asupan garam untuk menjaga tekanan darah',
                'Konsumsi air putih cukup dan senam lansia',
            ],
        ]);

        ExaminationAdult::create([
            'examination_id' => $exam->id,
            'height' => 156.00,
            'abdominal_circumference' => 86.50,
            'systolic_pressure' => 136,
            'diastolic_pressure' => 84,
            'blood_sugar' => 116.00,
            'uric_acid' => 6.40,
            'cholesterol' => 212.00,
            'eye_test' => SensoryTestResult::Impaired,
            'ear_test' => SensoryTestResult::Normal,
            'contraceptive' => 'Tidak menggunakan',
            'bmi_category' => BmiCategory::Overweight,
            'is_smoking' => false,
            'high_sugar_intake' => false,
            'high_salt_intake' => true,
            'high_fat_intake' => false,
            'puma_score' => 3,
            'puma_screenings' => [
                'Skor PUMA: 3 (Risiko Ringan PPOK)',
            ],
            'adl_score' => 18,
            'independence_level' => IndependenceLevel::Mild,
            'adl_screenings' => [
                'Mandi & berpakaian: Mandiri',
                'Naik tangga: Memerlukan pegangan / bantuan ringan',
            ],
        ]);
    }
}
