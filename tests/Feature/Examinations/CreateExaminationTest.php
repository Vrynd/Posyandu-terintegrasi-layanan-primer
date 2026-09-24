<?php

use App\Enums\BmiCategory;
use App\Enums\IndependenceLevel;
use App\Enums\ParticipantCategory;
use App\Enums\SensoryTestResult;
use App\Enums\WeightStatus;
use App\Models\Participant;
use App\Models\Pregnancy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view examination create page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('examinations.create'));
    $response->assertOk();
});

test('can record toddler examination', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $toddler = Participant::factory()->create([
        'category' => ParticipantCategory::Toddler,
    ]);

    $data = [
        'participant_id' => $toddler->id,
        'examination_date' => now()->toDateString(),
        'weight' => 12.5,
        'location' => 'health_post',
        'is_referred' => false,
        'skrining_tbc' => ['Batuk berdahak >= 2 minggu'],
        'edukasi' => ['MP-ASI Kaya Protein Hewani', 'Kebersihan Diri & Lingkungan (PHBS)'],
        // Data balita
        'age_in_months' => 24,
        'weight_status' => WeightStatus::Increased->value,
        'height' => 85.5,
        'head_circumference' => 47.0,
        'arm_circumference' => 14.5,
        'has_illness_symptoms' => false,
        'interventions' => ['Vitamin A', 'Imunisasi Rutin Lengkap'],
    ];

    $response = $this->post(route('examinations.store'), $data);

    $response->assertRedirect(route('examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'participant_id' => $toddler->id,
        'weight' => 12.5,
        'location' => 'health_post',
        'is_referred' => false,
    ]);

    $this->assertDatabaseHas('examination_toddlers', [
        'age_in_months' => 24,
        'weight_status' => WeightStatus::Increased->value,
        'height' => 85.5,
        'head_circumference' => 47.0,
        'arm_circumference' => 14.5,
        'has_illness_symptoms' => false,
    ]);
});

test('can record pregnant mother examination', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $bumil = Participant::factory()->create([
        'category' => ParticipantCategory::PregnantMother,
    ]);

    $pregnancy = Pregnancy::create([
        'participant_id' => $bumil->id,
        'husband_name' => 'Ahmad',
        'pregnancy_number' => 2,
        'status' => 'active',
    ]);

    $data = [
        'participant_id' => $bumil->id,
        'pregnancy_id' => $pregnancy->id,
        'examination_date' => now()->toDateString(),
        'weight' => 62.0,
        'location' => 'health_post',
        'is_referred' => false,
        'skrining_tbc' => [],
        'edukasi' => ['Germas (Gerakan Masyarakat Hidup Sehat)'],
        // Data bumil
        'gestational_age_weeks' => 26,
        'upper_arm_circumference' => 25.5,
        'systolic_pressure' => 120,
        'diastolic_pressure' => 80,
        'has_iron_tablets' => true,
        'exclusive_breastfeeding_counseling' => true,
        'receives_pmt_kek' => false,
        'attends_prenatal_class' => true,
    ];

    $response = $this->post(route('examinations.store'), $data);

    $response->assertRedirect(route('examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'participant_id' => $bumil->id,
        'weight' => 62.0,
    ]);

    $this->assertDatabaseHas('examination_pregnant_mothers', [
        'pregnancy_id' => $pregnancy->id,
        'gestational_age_weeks' => 26,
        'upper_arm_circumference' => 25.5,
        'systolic_pressure' => 120,
        'diastolic_pressure' => 80,
        'has_iron_tablets' => true,
    ]);
});

test('can record teenager examination with mental screening and disease history', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $teen = Participant::factory()->create([
        'category' => ParticipantCategory::Teenager,
    ]);

    $data = [
        'participant_id' => $teen->id,
        'examination_date' => now()->toDateString(),
        'weight' => 48.0,
        'location' => 'health_post',
        'is_referred' => false,
        'skrining_tbc' => [],
        'edukasi' => ['Pencegahan Anemia', 'Aktivitas Fisik Rutin'],
        // Data remaja
        'height' => 156.0,
        'abdominal_circumference' => 68.0,
        'systolic_pressure' => 110,
        'diastolic_pressure' => 70,
        'blood_sugar' => 90.0,
        'hemoglobin' => '12.5',
        'bmi_category' => BmiCategory::Normal->value,
        'family_disease_history' => ['Hipertensi', 'Asma'],
        'risk_behaviors' => ['Kurang Aktivitas Fisik', 'Kurang Sayur dan Buah'],
        'mental_screenings' => [
            'beban_sekolah' => 'tidak',
            'citra_tubuh' => 'ya',
            'teman_luar_grup' => 'ya',
            'zat_adiktif' => 'tidak',
            'seksual_pranikah' => 'tidak',
            'keamanan_lingkungan' => 'tidak',
            'ingin_bunuh_diri' => 'tidak',
        ],
    ];

    $response = $this->post(route('examinations.store'), $data);

    $response->assertRedirect(route('examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'participant_id' => $teen->id,
        'weight' => 48.0,
    ]);

    $this->assertDatabaseHas('examination_teens', [
        'height' => 156.0,
        'systolic_pressure' => 110,
        'blood_sugar' => 90.0,
        'hemoglobin' => '12.5',
    ]);
});

test('can record productive adult examination with puma screening, lifestyle, and contraceptive', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $productive = Participant::factory()->create([
        'category' => ParticipantCategory::Productive,
    ]);

    $data = [
        'participant_id' => $productive->id,
        'examination_date' => now()->toDateString(),
        'weight' => 65.0,
        'location' => 'health_post',
        'is_referred' => false,
        'skrining_tbc' => [],
        'edukasi' => ['Germas (Gerakan Masyarakat Hidup Sehat)'],
        // Data usia produktif
        'height' => 168.0,
        'abdominal_circumference' => 78.0,
        'systolic_pressure' => 125,
        'diastolic_pressure' => 80,
        'blood_sugar' => 105.0,
        'uric_acid' => 5.2,
        'cholesterol' => 180.0,
        'eye_test' => SensoryTestResult::Normal->value,
        'ear_test' => SensoryTestResult::Normal->value,
        'contraceptive' => 'Spiral',
        'bmi_category' => BmiCategory::Normal->value,
        'is_smoking' => false,
        'high_sugar_intake' => true,
        'high_salt_intake' => false,
        'high_fat_intake' => false,
        'family_disease_history' => ['Diabetes Melitus'],
        'personal_disease_history' => ['Tidak Ada'],
        'puma_score' => 1,
        'puma_screenings' => [
            'napas_pendek' => 'ya',
            'dahak_paru' => 'tidak',
            'batuk_non_flu' => 'tidak',
            'pernah_spirometri' => 'tidak',
        ],
    ];

    $response = $this->post(route('examinations.store'), $data);

    $response->assertRedirect(route('examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'participant_id' => $productive->id,
        'weight' => 65.0,
    ]);

    $this->assertDatabaseHas('examination_adults', [
        'height' => 168.0,
        'systolic_pressure' => 125,
        'contraceptive' => 'Spiral',
        'high_sugar_intake' => true,
        'puma_score' => 1,
    ]);
});

test('can record elderly examination with barthel adl screening and independence level', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $elderly = Participant::factory()->create([
        'category' => ParticipantCategory::Adult,
    ]);

    $data = [
        'participant_id' => $elderly->id,
        'examination_date' => now()->toDateString(),
        'weight' => 58.0,
        'location' => 'home_visit',
        'is_referred' => false,
        'skrining_tbc' => [],
        'edukasi' => ['Germas (Gerakan Masyarakat Hidup Sehat)'],
        // Data lansia
        'height' => 155.0,
        'abdominal_circumference' => 82.0,
        'systolic_pressure' => 135,
        'diastolic_pressure' => 85,
        'blood_sugar' => 110.0,
        'uric_acid' => 6.5,
        'cholesterol' => 195.0,
        'eye_test' => SensoryTestResult::Normal->value,
        'ear_test' => SensoryTestResult::Impaired->value,
        'bmi_category' => BmiCategory::Normal->value,
        'family_disease_history' => ['Hipertensi'],
        'personal_disease_history' => ['Hipertensi'],
        'adl_score' => 18,
        'independence_level' => IndependenceLevel::Mild->value,
        'adl_screenings' => [
            'pengendalian_bab' => 2,
            'pengendalian_bak' => 2,
            'kebersihan_diri' => 1,
            'penggunaan_wc' => 2,
            'makan_minum' => 2,
            'transfer_kursi_roda' => 3,
            'berjalan_tempat_rata' => 3,
            'naik_turun_tangga' => 1,
        ],
    ];

    $response = $this->post(route('examinations.store'), $data);

    $response->assertRedirect(route('examinations.index'));
    $this->assertDatabaseHas('examinations', [
        'participant_id' => $elderly->id,
        'location' => 'home_visit',
    ]);

    $this->assertDatabaseHas('examination_adults', [
        'systolic_pressure' => 135,
        'adl_score' => 18,
        'independence_level' => IndependenceLevel::Mild->value,
    ]);
});

test('validation fails when required basic fields are missing', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('examinations.store'), []);

    $response->assertSessionHasErrors(['participant_id', 'examination_date', 'location']);
});
