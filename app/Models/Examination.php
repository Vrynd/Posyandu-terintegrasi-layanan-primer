<?php

namespace App\Models;

use App\Enums\ExaminationLocation;
use Database\Factories\ExaminationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int $participant_id
 * @property int|null $created_by
 * @property Carbon $examination_date
 * @property float|null $weight
 * @property bool $is_referred
 * @property ExaminationLocation $location
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Participant $participant
 * @property-read User|null $creator
 */
class Examination extends Model
{
    /** @use HasFactory<ExaminationFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'participant_id',
        'created_by',
        'examination_date',
        'weight',
        'is_referred',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'examination_date' => 'date',
            'weight' => 'decimal:2',
            'is_referred' => 'boolean',
            'location' => ExaminationLocation::class,
        ];
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['ulid'];
    }

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    /**
     * @return BelongsTo<Participant, $this>
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
