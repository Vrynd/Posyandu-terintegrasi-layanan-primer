<?php

namespace App\Http\Requests\Schedules;

use Illuminate\Foundation\Http\FormRequest;

class IndexScheduleRequest extends FormRequest
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
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'month' => ['nullable', 'integer', 'between:1,12'],
            'year' => ['nullable', 'integer', 'digits:4'],
        ];
    }

    /**
     * @return array{month: int|null, year: int|null}
     */
    public function toFilters(): array
    {
        $validated = $this->validated();

        return [
            'month' => isset($validated['month']) ? (int) $validated['month'] : null,
            'year' => isset($validated['year']) ? (int) $validated['year'] : null,
        ];
    }
}
