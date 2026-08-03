<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class BackfillNikHash extends Command
{
    protected $signature = 'users:backfill-nik-hash';

    protected $description = 'Mengisi kolom nik_hash untuk data user yang sudah ada sebelumnya';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $users = User::whereNotNull('nik')->whereNull('nik_hash')->get();

        if ($users->isEmpty()) {
            $this->info('Tidak ada data yang perlu di-backfill.');

            return self::SUCCESS;
        }

        $this->info("Ditemukan {$users->count()} user yang perlu diperbarui.");

        foreach ($users as $user) {
            $user->nik_hash = hash('sha256', $user->nik);
            $user->saveQuietly();

            $this->line("✓ {$user->name} berhasil diperbarui.");
        }

        $this->info('Backfill selesai.');

        return self::SUCCESS;

    }
}
