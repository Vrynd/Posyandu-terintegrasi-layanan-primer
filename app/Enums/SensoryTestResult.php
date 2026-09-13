<?php

namespace App\Enums;

enum SensoryTestResult: string
{
    case Normal = 'normal';
    case Impaired = 'impaired';

    /**
     * Get the human-readable label for the sensory test result.
     */
    public function label(): string
    {
        return match ($this) {
            self::Normal => 'Normal',
            self::Impaired => 'Ada Gangguan',
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
