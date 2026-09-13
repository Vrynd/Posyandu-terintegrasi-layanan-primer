<?php

namespace App\Enums;

enum IndependenceLevel: string
{
    case Independent = 'independent';
    case Mild = 'mild';
    case Moderate = 'moderate';
    case Severe = 'severe';
    case Total = 'total';

    /**
     * Get the human-readable label for the elderly independence level (ADL).
     */
    public function label(): string
    {
        return match ($this) {
            self::Independent => 'Mandiri',
            self::Mild => 'Ketergantungan Ringan',
            self::Moderate => 'Ketergantungan Sedang',
            self::Severe => 'Ketergantungan Berat',
            self::Total => 'Ketergantungan Total',
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
