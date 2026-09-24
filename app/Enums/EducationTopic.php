<?php

namespace App\Enums;

enum EducationTopic: string
{
    case Germas = 'germas';
    case BalancedNutrition = 'balanced_nutrition';
    case AnemiaPrevention = 'anemia_prevention';
    case PhysicalActivity = 'physical_activity';
    case SmokingHazard = 'smoking_hazard';
    case Phbs = 'phbs';
    case MpAsiAnimalProtein = 'mp_asi_animal_protein';

    /**
     * Get the human-readable label for the education topic.
     */
    public function label(): string
    {
        return match ($this) {
            self::Germas => 'Germas (Gerakan Masyarakat Hidup Sehat)',
            self::BalancedNutrition => 'Isi Piringku & Gizi Seimbang',
            self::AnemiaPrevention => 'Pencegahan Anemia',
            self::PhysicalActivity => 'Aktivitas Fisik Rutin',
            self::SmokingHazard => 'Bahaya Rokok & Asap Rokok',
            self::Phbs => 'Kebersihan Diri & Lingkungan (PHBS)',
            self::MpAsiAnimalProtein => 'MP-ASI Kaya Protein Hewani',
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
