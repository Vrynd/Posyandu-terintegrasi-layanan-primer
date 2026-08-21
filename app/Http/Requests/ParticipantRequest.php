<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ParticipantRequest extends FormRequest
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
        $sanitized = [];

        // Sanitasi teks dari tag HTML (XSS Defense) & spasi berlebih
        if ($this->has('name') && is_string($this->name)) {
            $sanitized['name'] = strip_tags(trim($this->name));
        }
        if ($this->has('address') && is_string($this->address)) {
            $sanitized['address'] = strip_tags(trim($this->address));
        }
        if ($this->has('parent_name') && is_string($this->parent_name)) {
            $sanitized['parent_name'] = strip_tags(trim($this->parent_name));
        }
        if ($this->has('husband_name') && is_string($this->husband_name)) {
            $sanitized['husband_name'] = strip_tags(trim($this->husband_name));
        }
        if ($this->has('employment_other') && is_string($this->employment_other)) {
            $sanitized['employment_other'] = strip_tags(trim($this->employment_other));
        }

        // Sanitasi & standardisasi nomor HP (+62)
        if ($this->has('phone') && ! empty($this->phone)) {
            $phone = preg_replace('/[^\d+]/', '', (string) $this->phone);
            if (str_starts_with($phone, '08')) {
                $phone = '+62'.substr($phone, 1);
            } elseif (str_starts_with($phone, '8')) {
                $phone = '+62'.$phone;
            } elseif (str_starts_with($phone, '628')) {
                $phone = '+'.$phone;
            }
            $sanitized['phone'] = $phone;
        }

        if (! empty($sanitized)) {
            $this->merge($sanitized);
        }
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
            'gender' => ['required', Rule::in(['male', 'female'])],
            'category' => ['required', Rule::in(['pregnant_mother', 'toddler', 'teenager', 'productive', 'adult'])],

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
            'employment' => ['nullable', Rule::in([
                'farmer', 'farm_laborer', 'civil_servant', 'private_employee', 'entrepreneur',
                'fisherman', 'housewife', 'unemployed_new', 'unemployed', 'other',
            ])],
            'employment_other' => ['nullable', 'required_if:employment,other', 'string', 'max:100'],
            'marital_status' => ['nullable', Rule::in(['single', 'married', 'divorced', 'widowed'])],
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
