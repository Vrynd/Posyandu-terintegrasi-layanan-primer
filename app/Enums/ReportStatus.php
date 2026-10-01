<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Draft = 'draft';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Belum Selesai',
            self::Completed => 'Selesai',
        };
    }
}
