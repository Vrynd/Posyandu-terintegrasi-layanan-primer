<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pregnancy extends Model
{
    protected $table = 'pregnancies';

    protected $fillable = [
        'participant_id',
        'husband_name',
        'pregnancy_number',
        'birth_spacing_years',
        'weight_before_pregnancy',
        'height',
        'last_menstrual_period',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'last_menstrual_period' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
