<?php

namespace App\Actions\Examinations;

use App\Enums\ParticipantCategory;
use App\Models\Examination;
use App\Models\Participant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateExamination
{
    /**
     * Eksekusi penyimpanan data pemeriksaan induk dan anak kategori.
     *
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated): Examination
    {
        return DB::transaction(function () use ($validated) {
            $examination = Examination::create([
                'participant_id' => $validated['participant_id'],
                'created_by' => Auth::id() ?? $validated['created_by'] ?? null,
                'examination_date' => $validated['examination_date'],
                'weight' => $validated['weight'] ?? null,
                'is_referred' => $validated['is_referred'] ?? false,
                'location' => $validated['location'],
                'skrining_tbc' => $validated['skrining_tbc'] ?? null,
                'edukasi' => $validated['edukasi'] ?? null,
            ]);

            $participant = Participant::whereKey($validated['participant_id'])->firstOrFail();

            match ($participant->category) {
                ParticipantCategory::Toddler => $examination->toddler()->create([
                    'age_in_months' => $validated['age_in_months'] ?? null,
                    'weight_status' => $validated['weight_status'] ?? null,
                    'height' => $validated['height'] ?? null,
                    'head_circumference' => $validated['head_circumference'] ?? null,
                    'arm_circumference' => $validated['arm_circumference'] ?? null,
                    'has_illness_symptoms' => $validated['has_illness_symptoms'] ?? false,
                    'interventions' => $validated['interventions'] ?? null,
                ]),

                ParticipantCategory::PregnantMother => $examination->pregnantMother()->create([
                    'pregnancy_id' => $validated['pregnancy_id'] ?? $participant->latestPregnancy?->id,
                    'gestational_age_weeks' => $validated['gestational_age_weeks'] ?? null,
                    'upper_arm_circumference' => $validated['upper_arm_circumference'] ?? null,
                    'systolic_pressure' => $validated['systolic_pressure'] ?? null,
                    'diastolic_pressure' => $validated['diastolic_pressure'] ?? null,
                    'has_iron_tablets' => $validated['has_iron_tablets'] ?? false,
                    'exclusive_breastfeeding_counseling' => $validated['exclusive_breastfeeding_counseling'] ?? false,
                    'receives_pmt_kek' => $validated['receives_pmt_kek'] ?? false,
                    'attends_prenatal_class' => $validated['attends_prenatal_class'] ?? false,
                ]),

                ParticipantCategory::Teenager => $examination->teen()->create([
                    'height' => $validated['height'] ?? null,
                    'abdominal_circumference' => $validated['abdominal_circumference'] ?? null,
                    'systolic_pressure' => $validated['systolic_pressure'] ?? null,
                    'diastolic_pressure' => $validated['diastolic_pressure'] ?? null,
                    'blood_sugar' => $validated['blood_sugar'] ?? null,
                    'hemoglobin' => $validated['hemoglobin'] ?? null,
                    'bmi_category' => $validated['bmi_category'] ?? null,
                    'family_disease_history' => $validated['family_disease_history'] ?? null,
                    'risk_behaviors' => $validated['risk_behaviors'] ?? null,
                    'mental_screenings' => $validated['mental_screenings'] ?? null,
                ]),

                ParticipantCategory::Productive => $examination->adult()->create([
                    'height' => $validated['height'] ?? null,
                    'abdominal_circumference' => $validated['abdominal_circumference'] ?? null,
                    'systolic_pressure' => $validated['systolic_pressure'] ?? null,
                    'diastolic_pressure' => $validated['diastolic_pressure'] ?? null,
                    'blood_sugar' => $validated['blood_sugar'] ?? null,
                    'uric_acid' => $validated['uric_acid'] ?? null,
                    'cholesterol' => $validated['cholesterol'] ?? null,
                    'eye_test' => $validated['eye_test'] ?? null,
                    'ear_test' => $validated['ear_test'] ?? null,
                    'contraceptive' => $validated['contraceptive'] ?? null,
                    'bmi_category' => $validated['bmi_category'] ?? null,
                    'is_smoking' => $validated['is_smoking'] ?? false,
                    'high_sugar_intake' => $validated['high_sugar_intake'] ?? false,
                    'high_salt_intake' => $validated['high_salt_intake'] ?? false,
                    'high_fat_intake' => $validated['high_fat_intake'] ?? false,
                    'family_disease_history' => $validated['family_disease_history'] ?? null,
                    'personal_disease_history' => $validated['personal_disease_history'] ?? null,
                    'puma_score' => $validated['puma_score'] ?? null,
                    'puma_screenings' => $validated['puma_screenings'] ?? null,
                ]),

                ParticipantCategory::Adult => $examination->adult()->create([
                    'height' => $validated['height'] ?? null,
                    'abdominal_circumference' => $validated['abdominal_circumference'] ?? null,
                    'systolic_pressure' => $validated['systolic_pressure'] ?? null,
                    'diastolic_pressure' => $validated['diastolic_pressure'] ?? null,
                    'blood_sugar' => $validated['blood_sugar'] ?? null,
                    'uric_acid' => $validated['uric_acid'] ?? null,
                    'cholesterol' => $validated['cholesterol'] ?? null,
                    'eye_test' => $validated['eye_test'] ?? null,
                    'ear_test' => $validated['ear_test'] ?? null,
                    'bmi_category' => $validated['bmi_category'] ?? null,
                    'family_disease_history' => $validated['family_disease_history'] ?? null,
                    'personal_disease_history' => $validated['personal_disease_history'] ?? null,
                    'adl_score' => $validated['adl_score'] ?? null,
                    'independence_level' => $validated['independence_level'] ?? null,
                    'adl_screenings' => $validated['adl_screenings'] ?? null,
                ]),
            };

            return $examination;
        });
    }
}
