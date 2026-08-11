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
            'employment_other' => ['nullable', 'required_if:occupation,other', 'string', 'max:100'],
            'marital_status' => ['nullable', Rule::in(['single', 'married', 'divorced', 'widowed'])],
        ];
    }

    public function messages(): array
    {
        return [
            'nik.digits' => 'NIK harus terdiri dari 16 digit angka.',
            'rt.digits_between' => 'RT harus berupa angka, maksimal 5 digit.',
            'rw.digits_between' => 'RW harus berupa angka, maksimal 5 digit.',
            'phone.regex' => 'Format nomor HP harus diawali +62. Contoh: +6281234567890.',
            'bpjs_number.required_if' => 'Nomor BPJS wajib diisi jika peserta memiliki BPJS.',
            'bpjs_number.digits' => 'Nomor BPJS harus terdiri dari 13 digit angka.',
            'parent_name.required_if' => 'Nama orang tua wajib diisi untuk kategori ini.',
            'husband_name.required_if' => 'Nama suami wajib diisi untuk kategori ibu hamil.',
        ];
    }
}
