<?php

namespace App\Enums;

enum ScheduleStatus: string
{
    case Scheduled = 'scheduled';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * Mengambil label bahasa Indonesia untuk status jadwal.
     */
    public function label(): string
    {
        return match ($this) {
            self::Scheduled => 'Terjadwal',
            self::Ongoing => 'Sedang Berlangsung',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
        };
    }

    /**
     * Mengambil warna badge untuk komponen StatusBadge.
     */
    public function badgeColor(): string
    {
        return match ($this) {
            self::Scheduled => 'blue',
            self::Ongoing => 'amber',
            self::Completed => 'emerald',
            self::Cancelled => 'rose',
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
                'color' => $case->badgeColor(),
            ],
            self::cases(),
        );
    }
}
