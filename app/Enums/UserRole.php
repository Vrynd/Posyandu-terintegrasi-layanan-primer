<?php

namespace App\Enums;

enum UserRole: string
{
    case Administrator = 'administrator';
    case Kader = 'kader';

    /**
     * Get the human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Administrator => 'Administrator',
            self::Kader => 'Kader',
        };
    }
}
