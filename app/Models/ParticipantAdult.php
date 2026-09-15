<?php

namespace App\Models;

use App\Enums\EmploymentStatus;
use App\Enums\MaritalStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $participant_id
 * @property EmploymentStatus|null $employment
 * @property string|null $employment_other
 * @property MaritalStatus|null $marital_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $employment_label
 * @property-read string|null $marital_status_label
 * @property-read Participant $participant
 */
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

    protected $appends = [
        'employment_label',
        'marital_status_label',
    ];

    protected function casts(): array
    {
        return [
            'employment' => EmploymentStatus::class,
            'marital_status' => MaritalStatus::class,
        ];
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function employmentLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->employment) {
                    return null;
                }
                // Jika memilih 'Lainnya' dan mengisi nama pekerjaan khusus
                if ($this->employment === EmploymentStatus::Other && $this->employment_other) {
                    return "Lainnya ({$this->employment_other})";
                }

                // Memanggil method label() bawaan dari EmploymentStatus enum
                return $this->employment->label();
            }
        );
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function maritalStatusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->marital_status?->label()
        );
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
