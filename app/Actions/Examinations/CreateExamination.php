<?php

namespace App\Actions\Examinations;

use App\Models\Examination;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateExamination
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated): Examination
    {
        return DB::transaction(function () use ($validated) {
            return Examination::create([
                'participant_id' => $validated['participant_id'],
                'created_by' => Auth::id() ?? $validated['created_by'] ?? null,
                'examination_date' => $validated['examination_date'],
                'weight' => $validated['weight'] ?? null,
                'is_referred' => $validated['is_referred'] ?? false,
                'location' => $validated['location'],
            ]);
        });
    }
}
