<?php

namespace App\Models;

use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Participant extends Model
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory, HasUlids;

    protected $table = 'participants';

    protected $fillable = [
        'nik',
        'nik_hash',
        'name',
        'category',
        'birth_date',
        'gender',
        'address',
        'rt',
        'rw',
        'phone',
        'has_bpjs',
        'bpjs_number',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'has_bpjs' => 'boolean',
            'is_actice' => 'boolean',
            'nik' => 'encrypted',
            'bpjs_number' => 'encrypted',
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

    protected static function booted(): void
    {
        static::saving(function (Participant $participant) {
            if ($participant->isDirty('nik')) {
                $participant->nik_hash = $participant->nik ? hash('sha256', $participant->nik) : null;
            }
        });
    }

    /**
     * @return Attribute<string|null, void>
     */
    protected function nikMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->nik
                ? str_repeat('*', 12).substr($this->nik, -4)
                : null,
        );
    }

    /**
     * @return HasOne<ParticipantToddler, $this>
     */
    public function toddler(): HasOne
    {
        return $this->hasOne(ParticipantToddler::class);
    }

    /**
     * @return HasOne<Pregnancy, $this>
     */
    public function pregnancy(): HasOne
    {
        return $this->hasOne(Pregnancy::class)->latestOfMany();
    }

    /**
     * @return HasOne<ParticipantTeen, $this>
     */
    public function teen(): HasOne
    {
        return $this->hasOne(ParticipantTeen::class);
    }

    /**
     * @return HasOne<ParticipantAdult, $this>
     */
    public function adult(): HasOne
    {
        return $this->hasOne(ParticipantAdult::class);
    }
}
