<?php

namespace App\Http\Requests\Participants;

use App\Enums\ParticipantCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexParticipantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in([
                'all',
                ...array_column(ParticipantCategory::toOptions(), 'value'),
            ])],
            'sort' => ['nullable', Rule::in(['latest', 'oldest', 'name_asc', 'name_desc'])],
        ];
    }

    /**
     * @return array{search: ?string, category: ?string, sort: ?string}
     */
    public function toFilters(): array
    {
        $validated = $this->validated();

        return [
            'search' => $validated['search'] ?? null,
            'category' => $validated['category'] ?? null,
            'sort' => $validated['sort'] ?? null,
        ];
    }
}
