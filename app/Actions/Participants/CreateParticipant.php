<?php

namespace App\Actions\Participants;

use App\Enums\ParticipantCategory;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;

class CreateParticipant
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated): Participant
    {
        return DB::transaction(function () use ($validated) {
            $participant = Participant::create([
                'name' => $validated['name'],
                'nik' => $validated['nik'] ?? null,
                'birth_date' => $validated['birth_date'],
                'gender' => $validated['gender'],
                'category' => $validated['category'],
                'address' => $validated['address'] ?? null,
                'rt' => $validated['rt'] ?? null,
                'rw' => $validated['rw'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'has_bpjs' => $validated['has_bpjs'],
                'bpjs_number' => $validated['has_bpjs'] ? $validated['bpjs_number'] : null,
            ]);

            $this->detailCategory($participant, $validated);

            return $participant;
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function detailCategory(Participant $participant, array $validated): void
    {
        $category = $validated['category'] instanceof ParticipantCategory
            ? $validated['category']
            : ParticipantCategory::from($validated['category']);
        match ($category) {
            ParticipantCategory::Toddler => $participant->toddler()->create([
                'parent_name' => $validated['parent_name'] ?? null,
            ]),
            ParticipantCategory::PregnantMother => $participant->pregnancies()->create([
                'husband_name' => $validated['husband_name'] ?? null,
            ]),
            ParticipantCategory::Teenager => $participant->teen()->create([
                'parent_name' => $validated['parent_name'] ?? null,
            ]),
            ParticipantCategory::Productive, ParticipantCategory::Adult => $participant->adult()->create([
                'employment' => $validated['employment'] ?? null,
                'employment_other' => ($validated['employment'] ?? null) === 'other'
                    ? $validated['employment_other']
                    : null,
                'marital_status' => $validated['marital_status'] ?? null,
            ]),
        };
    }
}
