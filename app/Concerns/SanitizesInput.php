<?php

namespace App\Concerns;

trait SanitizesInput
{
    /**
     * Bersihkan sekumpulan field teks dari tag HTML (XSS defense) & spasi berlebih.
     *
     * @param  list<string>  $fields
     * @return array<string, string>
     */
    protected function sanitizeTextFields(array $fields): array
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
    protected function normalizePhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^\d+]/', '', $phone);

        return match (true) {
            str_starts_with($phone, '08') => '+62'.substr($phone, 1),
            str_starts_with($phone, '8') => '+62'.$phone,
            str_starts_with($phone, '628') => '+'.$phone,
            default => $phone,
        };
    }
}
