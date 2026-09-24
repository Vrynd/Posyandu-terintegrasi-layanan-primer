<?php

namespace App\Models;

use App\Enums\BmiCategory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $examination_id
 * @property float|null $height
 * @property float|null $abdominal_circumference
 * @property int|null $systolic_pressure
 * @property int|null $diastolic_pressure
 * @property float|null $blood_sugar
 * @property string|null $hemoglobin
 * @property BmiCategory|null $bmi_category
 * @property array<string>|null $mental_screenings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $bmi_category_label
 * @property-read Examination $examination
 */
class ExaminationTeen extends Model
{
    protected $table = 'examination_teens';

    protected $primaryKey = 'examination_id';

    public $incrementing = false;

    protected $fillable = [
        'examination_id',
        'height',
        'abdominal_circumference',
        'systolic_pressure',
        'diastolic_pressure',
        'blood_sugar',
        'hemoglobin',
        'bmi_category',
        'family_disease_history',
        'risk_behaviors',
        'mental_screenings',
    ];

    protected $appends = [
        'bmi_category_label',
    ];

    protected function casts(): array
    {
        return [
            'height' => 'decimal:2',
            'abdominal_circumference' => 'decimal:2',
            'systolic_pressure' => 'integer',
            'diastolic_pressure' => 'integer',
            'blood_sugar' => 'decimal:2',
            'bmi_category' => BmiCategory::class,
            'family_disease_history' => 'array',
            'risk_behaviors' => 'array',
            'mental_screenings' => 'array',
        ];
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function bmiCategoryLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->bmi_category?->label()
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
