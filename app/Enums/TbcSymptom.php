<?php

namespace App\Enums;

enum TbcSymptom: string
{
    case FeverOverTwoWeeks = 'fever_over_two_weeks';
    case ContinuousCough = 'continuous_cough';
    case NightSweats = 'night_sweats';
    case WeightStagnant = 'weight_stagnant';
    case CloseContact = 'close_contact';
    case NoSymptoms = 'no_symptoms';

    /**
     * Get the human-readable label for the TBC symptom.
     */
    public function label(): string
    {
        return match ($this) {
            self::FeverOverTwoWeeks => 'Demam Lebih dari 2 minggu',
            self::ContinuousCough => 'Batuk Terus Menerus',
            self::NightSweats => 'Keringat Malam Tanpa Aktivitas',
            self::WeightStagnant => 'Berat Badan Tidak Naik',
            self::CloseContact => 'Kontak Erat Penderita TBC',
            self::NoSymptoms => 'Tidak Ada Gejala',
        };
    }

    /**
     * @return array<int, array{label: string, value: string}>
     */
    public static function toOptions(): array
    {
        return array_map(
            fn (self $case) => [
                'label' => $case->label(),
                'value' => $case->value,
            ],
            self::cases(),
        );
    }
}
