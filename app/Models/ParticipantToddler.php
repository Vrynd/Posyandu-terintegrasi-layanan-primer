<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantToddler extends Model
{
    protected $table = 'participant_toddlers';

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
