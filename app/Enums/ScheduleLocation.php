<?php

namespace App\Enums;

enum ScheduleLocation: string
{
    case VillageHall = 'village_hall';
    case Pustu = 'pustu';
    case Other = 'other';

    /**
     * Label nama lokasi utama.
     */
    public function label(): string
    {
        return match ($this) {
            self::VillageHall => 'Balai Desa',
            self::Pustu => 'Puskesmas Pembantu',
            self::Other => 'Lokasi Lainnya',
        };
    }

    /**
     * Deskripsi ringkas lokasi.
     */
    public function description(): string
    {
        return match ($this) {
            self::VillageHall => 'Balai pertemuan utama desa',
            self::Pustu => 'Fasilitas kesehatan Pustu desa',
            self::Other => 'Rumah kader / Balai RW / Tempat khusus',
        };
    }

    /**
     * Nama ikon Lucide untuk komponen frontend.
     */
    public function icon(): string
    {
        return match ($this) {
            self::VillageHall => 'Building2',
            self::Pustu => 'Hospital',
            self::Other => 'MapPin',
        };
    }

    /**
     * Format opsi untuk dikirim ke Inertia / Vue Frontend.
     *
     * @return array<int, array{value: string, label: string, description: string, icon: string}>
     */
    public static function toOptions(): array
    {
        return array_map(
            fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
                'description' => $case->description(),
                'icon' => $case->icon(),
            ],
            self::cases(),
        );
    }
}
