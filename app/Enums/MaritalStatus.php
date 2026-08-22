<?php

namespace App\Enums;

enum MaritalStatus: string
{
    case Single = 'single';
    case Married = 'married';
    case Divorced = 'divorced';
    case Widowed = 'widowed';

    /**
     * Get the human-readable label for the marital status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Single => 'Belum Menikah',
            self::Married => 'Menikah',
            self::Divorced => 'Cerai Hidup',
            self::Widowed => 'Cerai Mati',
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
