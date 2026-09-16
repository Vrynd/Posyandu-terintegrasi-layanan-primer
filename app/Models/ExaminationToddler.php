<?php

namespace App\Models;

use App\Enums\WeightStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $examination_id
 * @property int|null $age_in_months
 * @property WeightStatus|null $weight_status
 * @property float|null $height
 * @property float|null $head_circumference
 * @property float|null $arm_circumference
 * @property bool $has_illness_symptoms
 * @property array<string>|null $interventions
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $weight_status_label
 * @property-read Examination $examination
 */
class ExaminationToddler extends Model
{
    protected $table = 'examination_toddlers';

    protected $primaryKey = 'examination_id';

    public $incrementing = false;

    protected $fillable = [
        'examination_id',
        'age_in_months',
        'weight_status',
        'height',
        'head_circumference',
        'arm_circumference',
        'has_illness_symptoms',
        'interventions',
    ];

    protected $appends = [
        'weight_status_label',
    ];

    protected function casts(): array
    {
        return [
            'age_in_months' => 'integer',
            'weight_status' => WeightStatus::class,
            'height' => 'decimal:2',
            'head_circumference' => 'decimal:2',
            'arm_circumference' => 'decimal:2',
            'has_illness_symptoms' => 'boolean',
            'interventions' => 'array',
        ];
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function weightStatusLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->weight_status?->label()
        );
    }

    /**
     * @return BelongsTo<Examination, $this>
     */
    public function examination(): BelongsTo
    {
        return $this->belongsTo(Examination::class);
    }
}
