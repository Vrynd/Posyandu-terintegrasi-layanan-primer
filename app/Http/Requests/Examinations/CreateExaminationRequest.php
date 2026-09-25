<?php

namespace App\Http\Requests\Examinations;

use App\Enums\BmiCategory;
use App\Enums\ContraceptiveMethod;
use App\Enums\DiseaseHistory;
use App\Enums\EducationTopic;
use App\Enums\ExaminationLocation;
use App\Enums\IndependenceLevel;
use App\Enums\Intervention;
use App\Enums\ParticipantCategory;
use App\Enums\RiskBehavior;
use App\Enums\SensoryTestResult;
use App\Enums\TbcSymptom;
use App\Enums\WeightStatus;
use App\Models\Participant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateExaminationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'participant_id' => ['required', 'exists:participants,id'],
            'examination_date' => ['required', 'date', 'before_or_equal:today'],
            'weight' => ['nullable', 'numeric', 'min:0.5', 'max:250'],
            'is_referred' => ['boolean'],
            'location' => ['required', Rule::enum(ExaminationLocation::class)],
            'skrining_tbc' => ['nullable', 'array'],
            'skrining_tbc.*' => [Rule::enum(TbcSymptom::class)],
            'edukasi' => ['nullable', 'array'],
            'edukasi.*' => [Rule::enum(EducationTopic::class)],
        ];

        $participant = Participant::whereKey($this->input('participant_id'))->first();

        if (! $participant instanceof Participant) {
            return $rules;
        }

        switch ($participant->category) {
            case ParticipantCategory::Toddler:
                $rules = array_merge($rules, [
                    'age_in_months' => ['nullable', 'integer', 'min:0', 'max:72'],
                    'weight_status' => ['nullable', Rule::enum(WeightStatus::class)],
                    'height' => ['nullable', 'numeric', 'min:20', 'max:150'],
                    'head_circumference' => ['nullable', 'numeric', 'min:20', 'max:70'],
                    'arm_circumference' => ['nullable', 'numeric', 'min:5', 'max:35'],
                    'has_illness_symptoms' => ['nullable', 'boolean'],
                    'interventions' => ['nullable', 'array'],
                    'interventions.*' => [Rule::enum(Intervention::class)],
                ]);
                break;

            case ParticipantCategory::PregnantMother:
                $rules = array_merge($rules, [
                    'pregnancy_id' => ['nullable', 'exists:pregnancies,id'],
                    'gestational_age_weeks' => ['nullable', 'integer', 'min:1', 'max:45'],
                    'upper_arm_circumference' => ['nullable', 'numeric', 'min:10', 'max:60'],
                    'systolic_pressure' => ['nullable', 'integer', 'min:60', 'max:250'],
                    'diastolic_pressure' => ['nullable', 'integer', 'min:40', 'max:150'],
                    'has_iron_tablets' => ['nullable', 'boolean'],
                    'exclusive_breastfeeding_counseling' => ['nullable', 'boolean'],
                    'receives_pmt_kek' => ['nullable', 'boolean'],
                    'attends_prenatal_class' => ['nullable', 'boolean'],
                ]);
                break;

            case ParticipantCategory::Teenager:
                $rules = array_merge($rules, [
                    'height' => ['nullable', 'numeric', 'min:50', 'max:220'],
                    'abdominal_circumference' => ['nullable', 'numeric', 'min:30', 'max:180'],
                    'systolic_pressure' => ['nullable', 'integer', 'min:60', 'max:250'],
                    'diastolic_pressure' => ['nullable', 'integer', 'min:40', 'max:150'],
                    'blood_sugar' => ['nullable', 'numeric', 'min:30', 'max:600'],
                    'hemoglobin' => ['nullable', 'string', 'max:20'],
                    'bmi_category' => ['nullable', Rule::enum(BmiCategory::class)],
                    'family_disease_history' => ['nullable', 'array'],
                    'family_disease_history.*' => [Rule::enum(DiseaseHistory::class)],
                    'risk_behaviors' => ['nullable', 'array'],
                    'risk_behaviors.*' => [Rule::enum(RiskBehavior::class)],
                    'mental_screenings' => ['nullable', 'array'],
                ]);
                break;

            case ParticipantCategory::Productive:
                $rules = array_merge($rules, [
                    'height' => ['nullable', 'numeric', 'min:50', 'max:220'],
                    'abdominal_circumference' => ['nullable', 'numeric', 'min:30', 'max:180'],
                    'systolic_pressure' => ['nullable', 'integer', 'min:60', 'max:250'],
                    'diastolic_pressure' => ['nullable', 'integer', 'min:40', 'max:150'],
                    'blood_sugar' => ['nullable', 'numeric', 'min:30', 'max:600'],
                    'uric_acid' => ['nullable', 'numeric', 'min:1', 'max:20'],
                    'cholesterol' => ['nullable', 'numeric', 'min:50', 'max:500'],
                    'eye_test' => ['nullable', Rule::enum(SensoryTestResult::class)],
                    'ear_test' => ['nullable', Rule::enum(SensoryTestResult::class)],
                    'contraceptive' => ['nullable', Rule::enum(ContraceptiveMethod::class)],
                    'bmi_category' => ['nullable', Rule::enum(BmiCategory::class)],
                    'is_smoking' => ['nullable', 'boolean'],
                    'high_sugar_intake' => ['nullable', 'boolean'],
                    'high_salt_intake' => ['nullable', 'boolean'],
                    'high_fat_intake' => ['nullable', 'boolean'],
                    'family_disease_history' => ['nullable', 'array'],
                    'family_disease_history.*' => [Rule::enum(DiseaseHistory::class)],
                    'personal_disease_history' => ['nullable', 'array'],
                    'personal_disease_history.*' => [Rule::enum(DiseaseHistory::class)],
                    'puma_score' => ['nullable', 'integer', 'min:0', 'max:15'],
                    'puma_screenings' => ['nullable', 'array'],
                ]);
                break;

            case ParticipantCategory::Adult:
                $rules = array_merge($rules, [
                    'height' => ['nullable', 'numeric', 'min:50', 'max:220'],
                    'abdominal_circumference' => ['nullable', 'numeric', 'min:30', 'max:180'],
                    'systolic_pressure' => ['nullable', 'integer', 'min:60', 'max:250'],
                    'diastolic_pressure' => ['nullable', 'integer', 'min:40', 'max:150'],
                    'blood_sugar' => ['nullable', 'numeric', 'min:30', 'max:600'],
                    'uric_acid' => ['nullable', 'numeric', 'min:1', 'max:20'],
                    'cholesterol' => ['nullable', 'numeric', 'min:50', 'max:500'],
                    'eye_test' => ['nullable', Rule::enum(SensoryTestResult::class)],
                    'ear_test' => ['nullable', Rule::enum(SensoryTestResult::class)],
                    'bmi_category' => ['nullable', Rule::enum(BmiCategory::class)],
                    'family_disease_history' => ['nullable', 'array'],
                    'family_disease_history.*' => [Rule::enum(DiseaseHistory::class)],
                    'personal_disease_history' => ['nullable', 'array'],
                    'personal_disease_history.*' => [Rule::enum(DiseaseHistory::class)],
                    'adl_score' => ['nullable', 'integer', 'min:0', 'max:20'],
                    'independence_level' => ['nullable', Rule::enum(IndependenceLevel::class)],
                    'adl_screenings' => ['nullable', 'array'],
                ]);
                break;
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'participant_id.required' => 'Peserta posyandu wajib dipilih.',
            'participant_id.exists' => 'Data peserta tidak ditemukan.',
            'examination_date.required' => 'Tanggal pemeriksaan wajib diisi.',
            'examination_date.before_or_equal' => 'Tanggal pemeriksaan tidak boleh melebihi hari ini.',
            'weight.numeric' => 'Berat badan harus berupa angka numerik.',
            'weight.min' => 'Berat badan minimal 0.5 kg.',
            'weight.max' => 'Berat badan maksimal 250 kg.',
            'location.required' => 'Lokasi pemeriksaan wajib dipilih.',
            'location.enum' => 'Lokasi pemeriksaan tidak valid.',
        ];
    }
}
