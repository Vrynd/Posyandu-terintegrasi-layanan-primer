<?php

namespace App\Enums;

enum WeightStatus: string
{
    case Increased = 'increased';
    case Decreased = 'decreased';
    case Same = 'same';
    case BelowRedLine = 'below_red_line';

    /**
     * Get the human-readable label for the toddler weight status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Increased => 'Naik (N)',
            self::Decreased => 'Turun (T)',
            self::Same => 'Tetap (T)',
            self::BelowRedLine => 'Bawah Garis Merah (BGM)',
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
