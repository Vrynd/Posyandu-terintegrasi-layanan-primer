<?php

namespace App\Http\Requests\Examinations;

use App\Enums\ExaminationLocation;
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
        return [
            'participant_id' => ['required', 'exists:participants,id'],
            'examination_date' => ['required', 'date', 'before_or_equal:today'],
            'weight' => ['nullable', 'numeric', 'min:0.5', 'max:250'],
            'is_referred' => ['boolean'],
            'location' => ['required', Rule::enum(ExaminationLocation::class)],
        ];
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
            'weight.numeric' => 'Berat badan harus berupa angka.',
            'weight.min' => 'Berat badan minimal 0.5 kg.',
            'weight.max' => 'Berat badan maksimal 250 kg.',
            'location.required' => 'Lokasi pemeriksaan wajib dipilih.',
            'location.enum' => 'Lokasi pemeriksaan tidak valid.',
        ];
    }
}
