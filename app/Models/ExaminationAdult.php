<?php

namespace App\Models;

use App\Enums\BmiCategory;
use App\Enums\IndependenceLevel;
use App\Enums\SensoryTestResult;
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
 * @property float|null $uric_acid
 * @property float|null $cholesterol
 * @property SensoryTestResult|null $eye_test
 * @property SensoryTestResult|null $ear_test
 * @property string|null $contraceptive
 * @property BmiCategory|null $bmi_category
 * @property bool $is_smoking
 * @property bool $high_sugar_intake
 * @property bool $high_salt_intake
 * @property bool $high_fat_intake
 * @property int|null $puma_score
 * @property array<string>|null $puma_screenings
 * @property int|null $adl_score
 * @property IndependenceLevel|null $independence_level
 * @property array<string>|null $adl_screenings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $bmi_category_label
 * @property-read string|null $eye_test_label
 * @property-read string|null $ear_test_label
 * @property-read string|null $independence_level_label
 * @property-read Examination $examination
 */
class ExaminationAdult extends Model
{
    protected $table = 'examination_adults';

    protected $primaryKey = 'examination_id';

    public $incrementing = false;

    protected $fillable = [
        'examination_id',
        'height',
        'abdominal_circumference',
        'systolic_pressure',
        'diastolic_pressure',
        'blood_sugar',
        'uric_acid',
        'cholesterol',
        'eye_test',
        'ear_test',
        'contraceptive',
        'bmi_category',
        'is_smoking',
        'high_sugar_intake',
        'high_salt_intake',
        'high_fat_intake',
        'family_disease_history',
        'personal_disease_history',
        'puma_score',
        'puma_screenings',
        'adl_score',
        'independence_level',
        'adl_screenings',
    ];

    protected $appends = [
        'bmi_category_label',
        'eye_test_label',
        'ear_test_label',
        'independence_level_label',
    ];

    protected function casts(): array
    {
        return [
            'height' => 'decimal:2',
            'abdominal_circumference' => 'decimal:2',
            'systolic_pressure' => 'integer',
            'diastolic_pressure' => 'integer',
            'blood_sugar' => 'decimal:2',
            'uric_acid' => 'decimal:2',
            'cholesterol' => 'decimal:2',
            'eye_test' => SensoryTestResult::class,
            'ear_test' => SensoryTestResult::class,
            'bmi_category' => BmiCategory::class,
            'is_smoking' => 'boolean',
            'high_sugar_intake' => 'boolean',
            'high_salt_intake' => 'boolean',
            'high_fat_intake' => 'boolean',
            'family_disease_history' => 'array',
            'personal_disease_history' => 'array',
            'puma_score' => 'integer',
            'puma_screenings' => 'array',
            'adl_score' => 'integer',
            'independence_level' => IndependenceLevel::class,
            'adl_screenings' => 'array',
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
     * @return Attribute<string|null, never>
     */
    protected function eyeTestLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->eye_test?->label()
        );
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function earTestLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->ear_test?->label()
        );
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function independenceLevelLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->independence_level?->label()
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
