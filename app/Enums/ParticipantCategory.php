<?php

namespace App\Enums;

enum ParticipantCategory: string
{
    case PregnantMother = 'pregnant_mother';
    case Toddler = 'toddler';
    case Teenager = 'teenager';
    case Productive = 'productive';
    case Adult = 'adult';

    /**
     * Get the human-readable label for the category.
     */
    public function label(): string
    {
        return match ($this) {
            self::PregnantMother => 'Ibu Hamil & Nifas',
            self::Toddler => 'Balita',
            self::Teenager => 'Anak Remaja',
            self::Productive => 'Usia Produktif',
            self::Adult => 'Usia Lansia',
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
