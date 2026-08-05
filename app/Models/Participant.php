<?php

namespace App\Models;

use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'has_bpjs' => 'boolean',
            'nik' => 'encrypted',
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
}
