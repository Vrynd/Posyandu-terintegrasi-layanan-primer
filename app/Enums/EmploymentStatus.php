<?php

namespace App\Enums;

enum EmploymentStatus: string
{
    case Farmer = 'farmer';
    case FarmLaborer = 'farm_laborer';
    case CivilServant = 'civil_servant';
    case PrivateEmployee = 'private_employee';
    case Entrepreneur = 'entrepreneur';
    case Fisherman = 'fisherman';
    case Housewife = 'housewife';
    case UnemployedNew = 'unemployed_new';
    case Unemployed = 'unemployed';
    case Other = 'other';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Farmer => 'Petani',
            self::FarmLaborer => 'Buruh Tani',
            self::CivilServant => 'PNS',
            self::PrivateEmployee => 'Karyawan Swasta',
            self::Entrepreneur => 'Wiraswasta',
            self::Fisherman => 'Nelayan',
            self::Housewife => 'Ibu Rumah Tangga',
            self::UnemployedNew => 'Belum Bekerja',
            self::Unemployed => 'Tidak Bekerja',
            self::Other => 'Lainnya',
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
