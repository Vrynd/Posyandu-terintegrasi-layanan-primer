<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $examination_id
 * @property int|null $pregnancy_id
 * @property int|null $gestational_age_weeks
 * @property float|null $upper_arm_circumference
 * @property int|null $systolic_pressure
 * @property int|null $diastolic_pressure
 * @property bool $has_iron_tablets
 * @property bool $exclusive_breastfeeding_counseling
 * @property bool $receives_pmt_kek
 * @property bool $attends_prenatal_class
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Examination $examination
 * @property-read Pregnancy|null $pregnancy
 */
class ExaminationPregnantMother extends Model
{
    protected $table = 'examination_pregnant_mothers';

    protected $primaryKey = 'examination_id';

    public $incrementing = false;

    protected $fillable = [
        'examination_id',
        'pregnancy_id',
        'gestational_age_weeks',
        'upper_arm_circumference',
        'systolic_pressure',
        'diastolic_pressure',
        'has_iron_tablets',
        'exclusive_breastfeeding_counseling',
        'receives_pmt_kek',
        'attends_prenatal_class',
    ];

    protected function casts(): array
    {
        return [
            'pregnancy_id' => 'integer',
            'gestational_age_weeks' => 'integer',
            'upper_arm_circumference' => 'decimal:2',
            'systolic_pressure' => 'integer',
            'diastolic_pressure' => 'integer',
            'has_iron_tablets' => 'boolean',
            'exclusive_breastfeeding_counseling' => 'boolean',
            'receives_pmt_kek' => 'boolean',
            'attends_prenatal_class' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Examination, $this>
     */
    public function examination(): BelongsTo
    {
        return $this->belongsTo(Examination::class);
    }

    /**
     * @return BelongsTo<Pregnancy, $this>
     */
    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }
}
