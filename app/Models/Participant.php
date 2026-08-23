<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\ParticipantCategory;
use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property string|null $nik
 * @property string|null $nik_hash
 * @property string $name
 * @property ParticipantCategory $category
 * @property Carbon $birth_date
 * @property Gender $gender
 * @property string|null $address
 * @property string|null $rt
 * @property string|null $rw
 * @property string|null $phone
 * @property bool $has_bpjs
 * @property string|null $bpjs_number
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $nik_masked
 * @property-read ParticipantToddler|null $toddler
 * @property-read Pregnancy|null $latestPregnancy
 * @property-read ParticipantTeen|null $teen
 * @property-read ParticipantAdult|null $adult
 */
class Participant extends Model
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory, HasUlids;

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

    protected $hidden = [
        'nik',
        'bpjs_number',
    ];

    protected $appends = [
        'nik_masked',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'category' => ParticipantCategory::class,
            'gender' => Gender::class,
            'has_bpjs' => 'boolean',
            'is_active' => 'boolean',
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
     * @return HasMany<Pregnancy, $this>
     */
    public function pregnancies(): HasMany
    {
        return $this->hasMany(Pregnancy::class);
    }

    /**
     * @return HasOne<Pregnancy, $this>
     */
    public function latestPregnancy(): HasOne
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

    /**
     * Scope untuk pencarian berdasarkan NIK (hash), Nama, No Telepon, atau Alamat.
     *
     * @param  Builder<Participant>  $query
     * @return Builder<Participant>
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            if (ctype_digit($term) && strlen($term) === 16) {
                $q->where('nik_hash', hash('sha256', $term));
            }

            $q->orWhere('name', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")
                ->orWhere('address', 'like', "%{$term}%");
        });
    }

    /**
     * Scope untuk filter berdasarkan kategori sasaran posyandu.
     *
     * @param  Builder<Participant>  $query
     * @return Builder<Participant>
     */
    public function scopeOfCategory(Builder $query, ParticipantCategory|string|null $category): Builder
    {
        if (blank($category) || $category === 'all') {
            return $query;
        }

        $value = $category instanceof ParticipantCategory ? $category->value : $category;

        return $query->where('category', $value);
    }

    /**
     * Scope untuk pengurutan data tabel peserta.
     *
     * @param  Builder<Participant>  $query
     * @return Builder<Participant>
     */
    public function scopeSorted(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'oldest' => $query->oldest('id'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default => $query->latest('id'),
        };
    }
}
