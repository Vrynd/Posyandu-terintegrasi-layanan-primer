<?php

namespace App\Actions\Participants;

use App\Enums\ParticipantCategory;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;

class UpdateParticipant
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(Participant $participant, array $validated): Participant
    {
        return DB::transaction(function () use ($participant, $validated) {
            $participant->update([
                'name' => $validated['name'],
                'nik' => $validated['nik'] ?? null,
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'address' => $validated['address'] ?? null,
                'rt' => $validated['rt'] ?? null,
                'rw' => $validated['rw'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'has_bpjs' => $validated['has_bpjs'],
                'bpjs_number' => $validated['has_bpjs'] ? $validated['bpjs_number'] : null,
            ]);

            $this->updateCategoryDetails($participant, $validated);

            return $participant;
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function updateCategoryDetails(Participant $participant, array $validated): void
    {
        $category = $participant->category;

        match ($category) {
            ParticipantCategory::Toddler => $participant->toddler()->updateOrCreate(
                ['participant_id' => $participant->id],
                ['parent_name' => $validated['parent_name'] ?? null]
            ),
            ParticipantCategory::PregnantMother => $participant->latestPregnancy
                ? $participant->latestPregnancy()->update([
                    'husband_name' => $validated['husband_name'] ?? null,
                ])
                : $participant->pregnancies()->create([
                    'husband_name' => $validated['husband_name'] ?? null,
                ]),
            ParticipantCategory::Teenager => $participant->teen()->updateOrCreate(
                ['participant_id' => $participant->id],
                ['parent_name' => $validated['parent_name'] ?? null]
            ),
            ParticipantCategory::Productive, ParticipantCategory::Adult => $participant->adult()->updateOrCreate(
                ['participant_id' => $participant->id],
                [
                    'employment' => $validated['employment'] ?? null,
                    'employment_other' => ($validated['employment'] ?? null) === 'other'
                        ? $validated['employment_other']
                        : null,
                    'marital_status' => $validated['marital_status'] ?? null,
                ]
            ),
        };
    }
}
