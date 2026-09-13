<?php

namespace App\Enums;

enum BmiCategory: string
{
    case SeverelyUnderweight = 'severely_underweight';
    case Underweight = 'underweight';
    case Normal = 'normal';
    case Overweight = 'overweight';
    case Obese = 'obese';

    /**
     * Get the human-readable label for the BMI category.
     */
    public function label(): string
    {
        return match ($this) {
            self::SeverelyUnderweight => 'Sangat Kurus',
            self::Underweight => 'Kurus',
            self::Normal => 'Normal',
            self::Overweight => 'Gemuk',
            self::Obese => 'Obesitas',
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
