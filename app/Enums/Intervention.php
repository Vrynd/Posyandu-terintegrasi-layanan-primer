<?php

namespace App\Enums;

enum Intervention: string
{
    case ExclusiveBreastfeeding = 'exclusive_breastfeeding';
    case ComplementaryFeeding = 'complementary_feeding';
    case RoutineImmunization = 'routine_immunization';
    case VitaminA = 'vitamin_a';
    case Deworming = 'deworming';
    case PmtRecovery = 'pmt_recovery';

    /**
     * Dapatkan label yang mudah dibaca untuk intervensi balita.
     */
    public function label(): string
    {
        return match ($this) {
            self::ExclusiveBreastfeeding => 'ASI Eksklusif',
            self::ComplementaryFeeding => 'Makanan Pendamping ASI (MP-ASI)',
            self::RoutineImmunization => 'Imunisasi Rutin Lengkap',
            self::VitaminA => 'Vitamin A',
            self::Deworming => 'Obat Cacing',
            self::PmtRecovery => 'PMT Pemulihan',
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
