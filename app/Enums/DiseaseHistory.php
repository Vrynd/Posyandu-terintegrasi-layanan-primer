<?php

namespace App\Enums;

enum DiseaseHistory: string
{
    case Hypertension = 'hypertension';
    case Diabetes = 'diabetes';
    case Stroke = 'stroke';
    case HeartDisease = 'heart_disease';
    case AsthmaOrAllergy = 'asthma_or_allergy';
    case Cancer = 'cancer';
    case HighCholesterol = 'high_cholesterol';
    case None = 'none';

    /**
     * Dapatkan label human-readable untuk riwayat penyakit.
     */
    public function label(): string
    {
        return match ($this) {
            self::Hypertension => 'Hipertensi',
            self::Diabetes => 'Diabetes Melitus',
            self::Stroke => 'Stroke',
            self::HeartDisease => 'Penyakit Jantung',
            self::AsthmaOrAllergy => 'Asma',
            self::Cancer => 'Kanker',
            self::HighCholesterol => 'Kolesterol Tinggi',
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
