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
            'location',
            'custom_location',
        ]);

        if ($sanitized !== []) {
            $this->merge($sanitized);
        }

        // Jika memilih lokasi 'other', gunakan nilai custom_location
        if ($this->input('location') === 'other' && $this->filled('custom_location')) {
            $this->merge([
                'location' => $this->input('custom_location'),
            ]);
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
            'location' => ['required', 'string', 'max:255'],
            'custom_location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul kegiatan wajib diisi.',
            'location.required' => 'Lokasi kegiatan wajib diisi.',
            'custom_location.required_if' => 'Nama lokasi khusus wajib diisi.',
            'start_date.required' => 'Tanggal pelaksanaan kegiatan wajib diisi.',
            'start_date.after_or_equal' => 'Tanggal kegiatan tidak boleh di masa lalu.',
            'end_date.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
            'end_time.after' => 'Jam selesai harus setelah jam mulai.',
        ];
    }
}
