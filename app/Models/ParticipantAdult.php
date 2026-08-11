<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantAdult extends Model
{
    protected $table = 'participant_adults';

    protected $primaryKey = 'participant_id';

    public $incrementing = false;

    protected $fillable = [
        'participant_id',
        'employment',
        'employment_other',
        'marital_status',
    ];

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
