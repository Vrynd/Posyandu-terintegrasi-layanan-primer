<?php

namespace App\Enums;

enum ExaminationLocation: string
{
    case HealthPost = 'health_post';
    case HomeVisit = 'home_visit';

    /**
     * Get the human-readable label for the examination location.
     */
    public function label(): string
    {
        return match ($this) {
            self::HealthPost => 'Posyandu',
            self::HomeVisit => 'Kunjungan Rumah',
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
