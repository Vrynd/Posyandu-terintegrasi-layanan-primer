<?php

namespace App\Enums;

enum BpjsStatus: string
{
    case Yes = '1';
    case No = '0';

    /**
     * Get the human-readable label for the bpjs status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Yes => 'Ya',
            self::No => 'Tidak',
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
