<?php

namespace App\Http\Requests\Participants;

use App\Enums\EmploymentStatus;
use App\Enums\Gender;
use App\Enums\MaritalStatus;
use App\Enums\ParticipantCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateParticipantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $sanitized = $this->sanitizeTextFields([
            'name', 'address', 'parent_name', 'husband_name', 'employment_other',
        ]);

        if ($this->filled('phone')) {
            $sanitized['phone'] = $this->normalizePhoneNumber((string) $this->phone);
        }

        if ($sanitized !== []) {
            $this->merge($sanitized);
        }
    }

    /**
     * @param  list<string>  $fields
     * @return array<string, string>
     */
    private function sanitizeTextFields(array $fields): array
    {
        $sanitized = [];

        foreach ($fields as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $sanitized[$field] = strip_tags(trim($this->input($field)));
            }
        }

        return $sanitized;
    }

    /**
     * Standardisasi nomor HP ke format +62.
     */
    private function normalizePhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^\d+]/', '', $phone);

        return match (true) {
            str_starts_with($phone, '08') => '+62'.substr($phone, 1),
            str_starts_with($phone, '8') => '+62'.$phone,
            str_starts_with($phone, '628') => '+'.$phone,
            default => $phone,
        };
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Data dasar
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'digits:16'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'category' => ['required', Rule::enum(ParticipantCategory::class)],

            // Kontak dan Domisili
            'address' => ['nullable', 'string', 'max:500'],
            'rt' => ['nullable', 'digits_between:1,5'],
            'rw' => ['nullable', 'digits_between:1,5'],
            'phone' => ['nullable', 'string', 'regex:/^(\+62|62)8[1-9][0-9]{6,10}$/'],

            // Kepesertaan Bpjs
            'has_bpjs' => ['required', 'boolean'],
            'bpjs_number' => ['required_if:has_bpjs,true', 'nullable', 'digits:13'],

            // Kategori Peserta
            'parent_name' => ['nullable', 'required_if:category,toddler', 'required_if:category,teenager', 'string', 'max:255'],
            'husband_name' => ['nullable', 'required_if:category,pregnant_mother', 'string', 'max:255'],
            'employment' => ['nullable', Rule::enum(EmploymentStatus::class)],
            'employment_other' => ['nullable', 'required_if:employment,other', 'string', 'max:100'],
            'marital_status' => ['nullable', Rule::enum(MaritalStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            // Data Dasar & Kategori
            'category.required' => 'Kategori peserta wajib dipilih.',
            'category.in' => 'Pilihan kategori peserta tidak valid.',
            'name.required' => 'Nama lengkap peserta wajib diisi.',
            'name.max' => 'Nama lengkap maksimal 255 karakter.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Pilihan jenis kelamin tidak valid.',

            // Kontak & Domisili
            'address.max' => 'Alamat maksimal 500 karakter.',
            'nik.digits' => 'NIK harus terdiri dari 16 digit angka.',
            'rt.digits_between' => 'RT harus berupa angka, maksimal 5 digit.',
            'rw.digits_between' => 'RW harus berupa angka, maksimal 5 digit.',
            'phone.regex' => 'Format nomor HP harus diawali +62 (contoh: +6281234567890).',

            // Kepesertaan BPJS
            'has_bpjs.required' => 'Status kepemilikan BPJS wajib dipilih.',
            'bpjs_number.required_if' => 'Nomor BPJS wajib diisi jika peserta memiliki BPJS.',
            'bpjs_number.digits' => 'Nomor BPJS harus terdiri dari 13 digit angka.',

            // Kategori Khusus
            'parent_name.required_if' => 'Nama orang tua/wali wajib diisi untuk kategori ini.',
            'husband_name.required_if' => 'Nama suami wajib diisi untuk kategori ibu hamil.',
            'employment_other.required_if' => 'Sebutkan jenis pekerjaan lainnya.',
        ];
    }
}
