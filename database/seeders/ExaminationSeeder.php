<?php

namespace Database\Seeders;

use App\Enums\BmiCategory;
use App\Enums\ContraceptiveMethod;
use App\Enums\DiseaseHistory;
use App\Enums\EducationTopic;
use App\Enums\ExaminationLocation;
use App\Enums\IndependenceLevel;
use App\Enums\Intervention;
use App\Enums\RiskBehavior;
use App\Enums\SensoryTestResult;
use App\Enums\TbcSymptom;
use App\Enums\WeightStatus;
use App\Models\Examination;
use App\Models\ExaminationAdult;
use App\Models\ExaminationPregnantMother;
use App\Models\ExaminationTeen;
use App\Models\ExaminationToddler;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
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

        $participants = Participant::with(['latestPregnancy'])->get()->keyBy('name');

        $thisMonthDate = now()->startOfMonth()->addDays(9)->toDateString();
        $lastMonthDate = now()->subMonth()->startOfMonth()->addDays(9)->toDateString();

        $this->seedToddlerExaminations($participants, $userId, $thisMonthDate, $lastMonthDate);
        $this->seedPregnantMotherExaminations($participants, $userId, $thisMonthDate, $lastMonthDate);
        $this->seedTeenagerExaminations($participants, $userId, $thisMonthDate);
        $this->seedProductiveExaminations($participants, $userId, $thisMonthDate);
        $this->seedAdultExaminations($participants, $userId, $thisMonthDate);
    }

    /**
     * 1. Pemeriksaan Balita (6 total: 5 diperiksa, 1 belum pernah periksa)
     *
     * @param  Collection<string, Participant>  $participants
     */
    private function seedToddlerExaminations(Collection $participants, ?int $userId, string $thisMonthDate, string $lastMonthDate): void
    {
        // Balita 1: Aditya Pratama (24 bulan) - 2 Riwayat (Bulan Lalu & Bulan Ini, BB Naik)
        if ($p = $participants->get('Aditya Pratama')) {
            $prev = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $lastMonthDate,
                'weight' => 11.20,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value, EducationTopic::Phbs->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $prev->id,
                'age_in_months' => 23,
                'weight_status' => WeightStatus::Increased,
                'height' => 84.50,
                'head_circumference' => 46.50,
                'arm_circumference' => 14.80,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::VitaminA->value, Intervention::Deworming->value],
            ]);

            $curr = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 11.70,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value, EducationTopic::Phbs->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $curr->id,
                'age_in_months' => 24,
                'weight_status' => WeightStatus::Increased,
                'height' => 85.50,
                'head_circumference' => 47.00,
                'arm_circumference' => 15.00,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::ComplementaryFeeding->value],
            ]);
        }

        // Balita 2: Bilqis Humaira (18 bulan) - 2 Riwayat (Bulan Lalu & Bulan Ini, Imunisasi Lengkap)
        if ($p = $participants->get('Bilqis Humaira')) {
            $prev = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $lastMonthDate,
                'weight' => 9.80,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $prev->id,
                'age_in_months' => 17,
                'weight_status' => WeightStatus::Increased,
                'height' => 78.00,
                'head_circumference' => 45.00,
                'arm_circumference' => 13.80,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::VitaminA->value],
            ]);

            $curr = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 10.20,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value, EducationTopic::Phbs->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $curr->id,
                'age_in_months' => 18,
                'weight_status' => WeightStatus::Increased,
                'height' => 79.20,
                'head_circumference' => 45.30,
                'arm_circumference' => 14.00,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::RoutineImmunization->value],
            ]);
        }

        // Balita 3: Danendra Alvaro (12 bulan) - 2 Riwayat (Bulan lalu BB Tetap & PMT Pemulihan, Bulan ini BB Naik)
        if ($p = $participants->get('Danendra Alvaro')) {
            $prev = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $lastMonthDate,
                'weight' => 8.90,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $prev->id,
                'age_in_months' => 11,
                'weight_status' => WeightStatus::Same,
                'height' => 74.00,
                'head_circumference' => 44.00,
                'arm_circumference' => 13.50,
                'has_illness_symptoms' => true,
                'interventions' => [Intervention::PmtRecovery->value],
            ]);

            $curr = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 9.40,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value, EducationTopic::Phbs->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $curr->id,
                'age_in_months' => 12,
                'weight_status' => WeightStatus::Increased,
                'height' => 75.40,
                'head_circumference' => 44.50,
                'arm_circumference' => 13.90,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::RoutineImmunization->value, Intervention::ComplementaryFeeding->value],
            ]);
        }

        // Balita 4: Gibran Alfarizi (8 bulan) - 1 Riwayat (Bulan Ini, MP-ASI & ASI Eksklusif)
        if ($p = $participants->get('Gibran Alfarizi')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 7.60,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::MpAsiAnimalProtein->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $exam->id,
                'age_in_months' => 8,
                'weight_status' => WeightStatus::Increased,
                'height' => 68.00,
                'head_circumference' => 42.50,
                'arm_circumference' => 13.00,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::ExclusiveBreastfeeding->value, Intervention::ComplementaryFeeding->value],
            ]);
        }

        // Balita 5: Kenzo Rafandra (5 bulan) - 1 Riwayat (Bulan Ini, Masih ASI Eksklusif)
        if ($p = $participants->get('Kenzo Rafandra')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 6.80,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Phbs->value],
            ]);
            ExaminationToddler::create([
                'examination_id' => $exam->id,
                'age_in_months' => 5,
                'weight_status' => WeightStatus::Increased,
                'height' => 63.50,
                'head_circumference' => 41.00,
                'arm_circumference' => 12.80,
                'has_illness_symptoms' => false,
                'interventions' => [Intervention::ExclusiveBreastfeeding->value],
            ]);
        }

        // Balita 6: Zahra Salsabila (1 bulan) - BELUM PERNAH PERIKSA (Dibiarkan kosong)
    }

    /**
     * 2. Pemeriksaan Ibu Hamil (10 total: 8 diperiksa, 2 belum pernah periksa)
     *
     * @param  Collection<string, Participant>  $participants
     */
    private function seedPregnantMotherExaminations(Collection $participants, ?int $userId, string $thisMonthDate, string $lastMonthDate): void
    {
        // Bumil 1: Dewi Ratnasari - 2 Kunjungan (Trimester 2)
        if ($p = $participants->get('Dewi Ratnasari')) {
            $prev = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $lastMonthDate,
                'weight' => 56.50,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $prev->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 20,
                'upper_arm_circumference' => 24.50,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);

            $curr = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 58.20,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value, EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $curr->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 24,
                'upper_arm_circumference' => 24.80,
                'systolic_pressure' => 115,
                'diastolic_pressure' => 75,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 2: Siti Rahmawati - Trimester 1 Awal (1 Kunjungan)
        if ($p = $participants->get('Siti Rahmawati')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 50.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 10,
                'upper_arm_circumference' => 23.80,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => false,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 3: Rina Marlina - Trimester 3 Menjelang HPL (2 Kunjungan)
        if ($p = $participants->get('Rina Marlina')) {
            $prev = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $lastMonthDate,
                'weight' => 61.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $prev->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 30,
                'upper_arm_circumference' => 25.50,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);

            $curr = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 63.20,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value, EducationTopic::Phbs->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $curr->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 34,
                'upper_arm_circumference' => 25.80,
                'systolic_pressure' => 125,
                'diastolic_pressure' => 80,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 4: Fitri Handayani - Bumil KEK (LiLA < 23.5 cm, Mendapat PMT KEK, Dirujuk)
        if ($p = $participants->get('Fitri Handayani')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 45.80,
                'is_referred' => true, // Dirujuk untuk tata laksana KEK di Puskesmas
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value, EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 18,
                'upper_arm_circumference' => 22.00, // < 23.5 cm (Bumil KEK)
                'systolic_pressure' => 100,
                'diastolic_pressure' => 65,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => true,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 5: Dian Permatasari - Trimester 2
        if ($p = $participants->get('Dian Permatasari')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 58.50,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 22,
                'upper_arm_circumference' => 25.00,
                'systolic_pressure' => 118,
                'diastolic_pressure' => 76,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 6: Anisa Rahayu - Trimester 1
        if ($p = $participants->get('Anisa Rahayu')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 53.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 14,
                'upper_arm_circumference' => 24.20,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => false,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 7: Mega Utami - Trimester 2
        if ($p = $participants->get('Mega Utami')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 60.50,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 26,
                'upper_arm_circumference' => 26.20,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 8: Putri Wulandari - Trimester 3
        if ($p = $participants->get('Putri Wulandari')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 55.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationPregnantMother::create([
                'examination_id' => $exam->id,
                'pregnancy_id' => $p->latestPregnancy?->id,
                'gestational_age_weeks' => 32,
                'upper_arm_circumference' => 24.20,
                'systolic_pressure' => 115,
                'diastolic_pressure' => 75,
                'has_iron_tablets' => true,
                'exclusive_breastfeeding_counseling' => true,
                'receives_pmt_kek' => false,
                'attends_prenatal_class' => true,
            ]);
        }

        // Bumil 9 & 10: Nurul Hidayah, Eka Novitasari - BELUM PERNAH PERIKSA (Dibiarkan kosong)
    }

    /**
     * 3. Pemeriksaan Remaja (12 total: 10 diperiksa, 2 belum pernah periksa)
     *
     * @param  Collection<string, Participant>  $participants
     */
    private function seedTeenagerExaminations(Collection $participants, ?int $userId, string $thisMonthDate): void
    {
        $defaultMental = [
            'comfortable_at_home' => true,
            'school_pressure' => false,
            'body_image' => true,
            'substance_use' => false,
            'sexual_activity' => false,
            'environmental_safety' => true,
            'peer_relationship' => true,
            'suicidal_ideation' => false,
        ];

        // 1. Nadia Putri Azzahra (P) - Remaja Putri Hb Normal
        if ($p = $participants->get('Nadia Putri Azzahra')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 47.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::AnemiaPrevention->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 156.00,
                'abdominal_circumference' => 67.00,
                'systolic_pressure' => 108,
                'diastolic_pressure' => 72,
                'blood_sugar' => 90.00,
                'hemoglobin' => '12.8',
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 2. Rizky Dwi Prasetyo (L)
        if ($p = $participants->get('Rizky Dwi Prasetyo')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 56.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 168.00,
                'abdominal_circumference' => 73.00,
                'systolic_pressure' => 112,
                'diastolic_pressure' => 72,
                'blood_sugar' => 88.00,
                'hemoglobin' => null,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 3. Bagas Saputra (L)
        if ($p = $participants->get('Bagas Saputra')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 55.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 167.00,
                'abdominal_circumference' => 72.00,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'blood_sugar' => 88.00,
                'hemoglobin' => null,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'risk_behaviors' => [RiskBehavior::LackOfVegetablesAndFruits->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 4. Amanda Cantika (P) - Anemia Ringan (Hb 11.2 g/dL), Underweight, Dirujuk
        if ($p = $participants->get('Amanda Cantika')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 41.50,
                'is_referred' => true, // Dirujuk untuk penanganan anemia remaja putri
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::AnemiaPrevention->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 153.00,
                'abdominal_circumference' => 64.00,
                'systolic_pressure' => 100,
                'diastolic_pressure' => 65,
                'blood_sugar' => 86.00,
                'hemoglobin' => '11.2',
                'bmi_category' => BmiCategory::Underweight,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::LackOfVegetablesAndFruits->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 5. Dimas Arya Wijaya (L)
        if ($p = $participants->get('Dimas Arya Wijaya')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 54.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 166.00,
                'abdominal_circumference' => 71.00,
                'systolic_pressure' => 112,
                'diastolic_pressure' => 74,
                'blood_sugar' => 94.00,
                'hemoglobin' => null,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 6. Tiara Maharani (P)
        if ($p = $participants->get('Tiara Maharani')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 45.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 152.00,
                'abdominal_circumference' => 65.00,
                'systolic_pressure' => 105,
                'diastolic_pressure' => 68,
                'blood_sugar' => 87.00,
                'hemoglobin' => '12.4',
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 7. Farhan Maulana (L)
        if ($p = $participants->get('Farhan Maulana')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 62.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 172.00,
                'abdominal_circumference' => 75.00,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'blood_sugar' => 95.00,
                'hemoglobin' => null,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 8. Zaskia Nur Aini (P)
        if ($p = $participants->get('Zaskia Nur Aini')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 49.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 157.00,
                'abdominal_circumference' => 67.00,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'blood_sugar' => 91.00,
                'hemoglobin' => '13.0',
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 9. Bayu Tri Atmojo (L) - Overweight
        if ($p = $participants->get('Bayu Tri Atmojo')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 72.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::PhysicalActivity->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 169.00,
                'abdominal_circumference' => 84.00,
                'systolic_pressure' => 122,
                'diastolic_pressure' => 80,
                'blood_sugar' => 102.00,
                'hemoglobin' => null,
                'bmi_category' => BmiCategory::Overweight,
                'family_disease_history' => [DiseaseHistory::Diabetes->value],
                'risk_behaviors' => [RiskBehavior::ExcessiveGgl->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // 10. Salsa Bella Putri (P)
        if ($p = $participants->get('Salsa Bella Putri')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 48.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::AnemiaPrevention->value],
            ]);
            ExaminationTeen::create([
                'examination_id' => $exam->id,
                'height' => 156.00,
                'abdominal_circumference' => 66.00,
                'systolic_pressure' => 106,
                'diastolic_pressure' => 70,
                'blood_sugar' => 89.00,
                'hemoglobin' => '12.6',
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'risk_behaviors' => [RiskBehavior::None->value],
                'mental_screenings' => $defaultMental,
            ]);
        }

        // Remaja 11 & 12: Galang Daniswara, Nabila Syahrani - BELUM PERNAH PERIKSA (Dibiarkan kosong)
    }

    /**
     * 4. Pemeriksaan Usia Produktif (15 total: 12 diperiksa, 3 belum pernah periksa)
     *
     * @param  Collection<string, Participant>  $participants
     */
    private function seedProductiveExaminations(Collection $participants, ?int $userId, string $thisMonthDate): void
    {
        $defaultPuma = [
            'shortness_of_breath' => false,
            'phlegm_cough' => false,
            'chronic_cough' => false,
            'spirometry_history' => false,
        ];

        // 1. Rudi Hermawan (L) - Merokok, KB Kondom
        if ($p = $participants->get('Rudi Hermawan')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 68.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::SmokingHazard->value, EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 168.00,
                'abdominal_circumference' => 83.00,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'blood_sugar' => 105.00,
                'uric_acid' => 5.60,
                'cholesterol' => 185.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Condom->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => true,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 1,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 2. Agus Setiawan (L) - Merokok, Overweight
        if ($p = $participants->get('Agus Setiawan')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 74.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::SmokingHazard->value, EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 167.00,
                'abdominal_circumference' => 88.00,
                'systolic_pressure' => 130,
                'diastolic_pressure' => 85,
                'blood_sugar' => 112.00,
                'uric_acid' => 6.20,
                'cholesterol' => 205.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::None->value,
                'bmi_category' => BmiCategory::Overweight,
                'is_smoking' => true,
                'high_sugar_intake' => false,
                'high_salt_intake' => true,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 1,
                'puma_screenings' => [
                    'shortness_of_breath' => false,
                    'phlegm_cough' => true,
                    'chronic_cough' => false,
                    'spirometry_history' => false,
                ],
            ]);
        }

        // 3. Wahyu Hidayat (L)
        if ($p = $participants->get('Wahyu Hidayat')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 65.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 165.00,
                'abdominal_circumference' => 80.00,
                'systolic_pressure' => 125,
                'diastolic_pressure' => 82,
                'blood_sugar' => 102.00,
                'uric_acid' => 5.20,
                'cholesterol' => 190.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::None->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 4. Endang Tri Astuti (P) - KB Implan
        if ($p = $participants->get('Endang Tri Astuti')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 54.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 152.00,
                'abdominal_circumference' => 72.00,
                'systolic_pressure' => 118,
                'diastolic_pressure' => 76,
                'blood_sugar' => 95.00,
                'uric_acid' => 4.00,
                'cholesterol' => 168.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Implant->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 5. Hendra Gunawan (L)
        if ($p = $participants->get('Hendra Gunawan')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 70.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 171.00,
                'abdominal_circumference' => 82.00,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'blood_sugar' => 100.00,
                'uric_acid' => 5.00,
                'cholesterol' => 180.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::None->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 6. Sri Wahyuni (P) - KB Suntik
        if ($p = $participants->get('Sri Wahyuni')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 56.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 155.00,
                'abdominal_circumference' => 74.00,
                'systolic_pressure' => 115,
                'diastolic_pressure' => 75,
                'blood_sugar' => 98.00,
                'uric_acid' => 4.20,
                'cholesterol' => 172.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Injection->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 7. Ahmad Fauzi (L)
        if ($p = $participants->get('Ahmad Fauzi')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 67.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 169.00,
                'abdominal_circumference' => 81.00,
                'systolic_pressure' => 124,
                'diastolic_pressure' => 80,
                'blood_sugar' => 106.00,
                'uric_acid' => 5.40,
                'cholesterol' => 182.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::None->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 8. Suryani Indah (P) - KB Pil
        if ($p = $participants->get('Suryani Indah')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 58.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 154.00,
                'abdominal_circumference' => 75.00,
                'systolic_pressure' => 122,
                'diastolic_pressure' => 78,
                'blood_sugar' => 108.00,
                'uric_acid' => 4.50,
                'cholesterol' => 188.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Pill->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 9. Bambang Pamungkas (L) - Prahipertensi & Kolesterol Tinggi
        if ($p = $participants->get('Bambang Pamungkas')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 78.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value, EducationTopic::PhysicalActivity->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 170.00,
                'abdominal_circumference' => 91.00,
                'systolic_pressure' => 135,
                'diastolic_pressure' => 85,
                'blood_sugar' => 118.00,
                'uric_acid' => 6.80,
                'cholesterol' => 215.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::None->value,
                'bmi_category' => BmiCategory::Overweight,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => true,
                'high_fat_intake' => true,
                'family_disease_history' => [DiseaseHistory::Hypertension->value, DiseaseHistory::HighCholesterol->value],
                'personal_disease_history' => [DiseaseHistory::HighCholesterol->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 10. Retno Kusuma (P) - KB Suntik
        if ($p = $participants->get('Retno Kusuma')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 52.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 156.00,
                'abdominal_circumference' => 70.00,
                'systolic_pressure' => 112,
                'diastolic_pressure' => 72,
                'blood_sugar' => 92.00,
                'uric_acid' => 3.60,
                'cholesterol' => 165.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Injection->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 11. Joko Susilo (L) - Merokok, KB Kondom
        if ($p = $participants->get('Joko Susilo')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 69.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::SmokingHazard->value, EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 168.00,
                'abdominal_circumference' => 82.00,
                'systolic_pressure' => 120,
                'diastolic_pressure' => 80,
                'blood_sugar' => 104.00,
                'uric_acid' => 5.50,
                'cholesterol' => 180.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Condom->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => true,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 1,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // 12. Lestari Anggraini (P) - KB IUD
        if ($p = $participants->get('Lestari Anggraini')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 62.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 158.00,
                'abdominal_circumference' => 78.00,
                'systolic_pressure' => 110,
                'diastolic_pressure' => 70,
                'blood_sugar' => 94.00,
                'uric_acid' => 3.80,
                'cholesterol' => 175.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'contraceptive' => ContraceptiveMethod::Iud->value,
                'bmi_category' => BmiCategory::Normal,
                'is_smoking' => false,
                'high_sugar_intake' => false,
                'high_salt_intake' => false,
                'high_fat_intake' => false,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'puma_score' => 0,
                'puma_screenings' => $defaultPuma,
            ]);
        }

        // Produktif 13, 14, 15: Tri Wibowo, Maya Rosita, Eko Prasetyo - BELUM PERNAH PERIKSA (Dibiarkan kosong)
    }

    /**
     * 5. Pemeriksaan Usia Lansia (10 total: 8 diperiksa, 2 belum pernah periksa)
     *
     * @param  Collection<string, Participant>  $participants
     */
    private function seedAdultExaminations(Collection $participants, ?int $userId, string $thisMonthDate): void
    {
        $independentAdl = [
            'bowel_control' => '2',
            'bladder_control' => '2',
            'grooming' => '1',
            'toilet_use' => '2',
            'feeding' => '2',
            'transfer' => '3',
            'mobility' => '3',
            'stairs' => '2',
        ];

        // 1. Sukirno (L) - Hipertensi Gr. 1, Mata Ada Gangguan (Presbiopi)
        if ($p = $participants->get('Sukirno')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 58.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value, EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 162.00,
                'abdominal_circumference' => 82.00,
                'systolic_pressure' => 138,
                'diastolic_pressure' => 85,
                'blood_sugar' => 115.00,
                'uric_acid' => 6.20,
                'cholesterol' => 205.00,
                'eye_test' => SensoryTestResult::Impaired,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::Hypertension->value],
                'adl_score' => 20,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => $independentAdl,
            ]);
        }

        // 2. Kartini (P) - Mandiri Normal
        if ($p = $participants->get('Kartini')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 52.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 150.00,
                'abdominal_circumference' => 76.00,
                'systolic_pressure' => 125,
                'diastolic_pressure' => 80,
                'blood_sugar' => 104.00,
                'uric_acid' => 4.80,
                'cholesterol' => 192.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'adl_score' => 20,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => $independentAdl,
            ]);
        }

        // 3. Sunardi (L) - Hipertensi, Asam Urat, Ketergantungan Ringan (ADL 17), Dirujuk
        if ($p = $participants->get('Sunardi')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 60.00,
                'is_referred' => true, // Dirujuk karena Hipertensi & Asam Urat Tinggi
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 160.00,
                'abdominal_circumference' => 85.00,
                'systolic_pressure' => 142,
                'diastolic_pressure' => 88,
                'blood_sugar' => 122.00,
                'uric_acid' => 6.70,
                'cholesterol' => 218.00,
                'eye_test' => SensoryTestResult::Impaired,
                'ear_test' => SensoryTestResult::Impaired,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::Hypertension->value],
                'adl_score' => 17,
                'independence_level' => IndependenceLevel::Mild,
                'adl_screenings' => array_merge($independentAdl, [
                    'stairs' => '1',
                    'transfer' => '2',
                ]),
            ]);
        }

        // 4. Sutikno (L) - Mandiri
        if ($p = $participants->get('Sutikno')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 64.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 165.00,
                'abdominal_circumference' => 84.00,
                'systolic_pressure' => 130,
                'diastolic_pressure' => 82,
                'blood_sugar' => 110.00,
                'uric_acid' => 5.80,
                'cholesterol' => 198.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'adl_score' => 20,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => $independentAdl,
            ]);
        }

        // 5. Darmo (L) - Ketergantungan Ringan (ADL 18)
        if ($p = $participants->get('Darmo')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 54.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 158.00,
                'abdominal_circumference' => 79.00,
                'systolic_pressure' => 136,
                'diastolic_pressure' => 84,
                'blood_sugar' => 118.00,
                'uric_acid' => 6.00,
                'cholesterol' => 202.00,
                'eye_test' => SensoryTestResult::Impaired,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'adl_score' => 18,
                'independence_level' => IndependenceLevel::Mild,
                'adl_screenings' => array_merge($independentAdl, [
                    'stairs' => '1',
                    'mobility' => '2',
                ]),
            ]);
        }

        // 6. Sumarni (P) - Mandiri
        if ($p = $participants->get('Sumarni')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 56.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 152.00,
                'abdominal_circumference' => 80.00,
                'systolic_pressure' => 128,
                'diastolic_pressure' => 82,
                'blood_sugar' => 106.00,
                'uric_acid' => 5.10,
                'cholesterol' => 188.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'adl_score' => 20,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => $independentAdl,
            ]);
        }

        // 7. Parto Suwito (L) - Mandiri
        if ($p = $participants->get('Parto Suwito')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 59.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::Germas->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 163.00,
                'abdominal_circumference' => 83.00,
                'systolic_pressure' => 140,
                'diastolic_pressure' => 86,
                'blood_sugar' => 120.00,
                'uric_acid' => 6.40,
                'cholesterol' => 210.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::Hypertension->value],
                'personal_disease_history' => [DiseaseHistory::Hypertension->value],
                'adl_score' => 19,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => array_merge($independentAdl, [
                    'stairs' => '1',
                ]),
            ]);
        }

        // 8. Suparmi (P) - Mandiri
        if ($p = $participants->get('Suparmi')) {
            $exam = Examination::create([
                'participant_id' => $p->id,
                'created_by' => $userId,
                'examination_date' => $thisMonthDate,
                'weight' => 53.00,
                'is_referred' => false,
                'location' => ExaminationLocation::HealthPost,
                'skrining_tbc' => [TbcSymptom::NoSymptoms->value],
                'edukasi' => [EducationTopic::BalancedNutrition->value],
            ]);
            ExaminationAdult::create([
                'examination_id' => $exam->id,
                'height' => 151.00,
                'abdominal_circumference' => 75.00,
                'systolic_pressure' => 122,
                'diastolic_pressure' => 78,
                'blood_sugar' => 99.00,
                'uric_acid' => 4.50,
                'cholesterol' => 180.00,
                'eye_test' => SensoryTestResult::Normal,
                'ear_test' => SensoryTestResult::Normal,
                'bmi_category' => BmiCategory::Normal,
                'family_disease_history' => [DiseaseHistory::None->value],
                'personal_disease_history' => [DiseaseHistory::None->value],
                'adl_score' => 20,
                'independence_level' => IndependenceLevel::Independent,
                'adl_screenings' => $independentAdl,
            ]);
        }

        // Lansia 9 & 10: Kastono, Wagiman - BELUM PERNAH PERIKSA (Dibiarkan kosong)
    }
}
