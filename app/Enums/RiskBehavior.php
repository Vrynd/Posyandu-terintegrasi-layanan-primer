<?php

namespace App\Enums;

enum RiskBehavior: string
{
    case Smoking = 'smoking';
    case LackOfPhysicalActivity = 'lack_of_physical_activity';
    case LackOfVegetablesAndFruits = 'lack_of_vegetables_and_fruits';
    case AlcoholConsumption = 'alcohol_consumption';
    case ExcessiveGgl = 'excessive_ggl';
    case None = 'none';

    /**
     * Dapatkan label human-readable untuk perilaku berisiko.
     */
    public function label(): string
    {
        return match ($this) {
            self::Smoking => 'Merokok',
            self::LackOfPhysicalActivity => 'Kurang Aktivitas Fisik',
            self::LackOfVegetablesAndFruits => 'Kurang Sayur dan Buah',
            self::AlcoholConsumption => 'Konsumsi Alkohol',
            self::ExcessiveGgl => 'Konsumsi Gula/Garam/Lemak Berlebih',
            self::None => 'Tidak Ada',
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
