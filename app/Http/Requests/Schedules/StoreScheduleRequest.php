<?php

namespace App\Http\Requests\Schedules;

use App\Concerns\SanitizesInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    use SanitizesInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('manage-schedules') ?? false;
    }

    /**
     * Sanitasi data sebelum proses validasi dijalankan menggunakan Trait proyek.
     */
    protected function prepareForValidation(): void
    {
        $sanitized = $this->sanitizeTextFields([
            'title',
            'activity_type',
            'location',
            'description',
        ]);
        if ($sanitized !== []) {
            $this->merge($sanitized);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'activity_type' => ['nullable', 'string', 'max:100'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul kegiatan wajib diisi.',
            'date.required' => 'Tanggal kegiatan wajib diisi.',
            'date.after_or_equal' => 'Tanggal kegiatan tidak boleh di masa lalu.',
            'end_time.after' => 'Jam selesai harus setelah jam mulai.',
            'location.required' => 'Lokasi kegiatan wajib diisi.',
        ];
    }
}
