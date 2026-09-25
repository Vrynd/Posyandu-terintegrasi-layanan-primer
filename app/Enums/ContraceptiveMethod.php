<?php

namespace App\Enums;

enum ContraceptiveMethod: string
{
    case Iud = 'iud_spiral';
    case Implant = 'implant';
    case Pill = 'pill';
    case Injection = 'injection';
    case Condom = 'condom';
    case Mow = 'mow';
    case Mop = 'mop';
    case Menopause = 'menopause';
    case None = 'none';

    /**
     * Dapatkan label human-readable untuk metode kontrasepsi.
     */
    public function label(): string
    {
        return match ($this) {
            self::Iud => 'Spiral / IUD',
            self::Implant => 'Implan / Susuk',
            self::Pill => 'Pil KB',
            self::Injection => 'Suntik KB',
            self::Condom => 'Kondom',
            self::Mow => 'Steril Wanita (MOW)',
            self::Mop => 'Steril Pria (MOP)',
            self::Menopause => 'Sudah Menopause',
            self::None => 'Tidak Menggunakan KB',
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
