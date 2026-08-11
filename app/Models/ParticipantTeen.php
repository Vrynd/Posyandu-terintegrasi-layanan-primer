<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantTeen extends Model
{
    protected $table = 'participant_teens';

    protected $primaryKey = 'participant_id';

    public $incrementing = false;

    protected $fillable = [
        'participant_id',
        'parent_name',
    ];

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
