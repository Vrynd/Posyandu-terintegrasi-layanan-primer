<?php

namespace App\Models;

use App\Enums\ParticipantCategory;
use Database\Factories\ScreeningQuestionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int|null $created_by
 * @property ParticipantCategory $category
 * @property string $group_name
 * @property string $key
 * @property string $question
 * @property string $input_type
 * @property array<int, array{label: string, value: string}>|null $options
 * @property int $order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $creator
 */
class ScreeningQuestion extends Model
{
    /** @use HasFactory<ScreeningQuestionFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'created_by',
        'category',
        'group_name',
        'key',
        'question',
        'input_type',
        'options',
        'order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => ParticipantCategory::class,
            'options' => 'array',
            'order' => 'integer',
            'is_active' => 'boolean',
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
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope untuk mengambil pertanyaan aktif terurut.
     *
     * @param  Builder<ScreeningQuestion>  $query
     * @return Builder<ScreeningQuestion>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
