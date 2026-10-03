<?php

namespace App\Enums;

enum ReportType: string
{
    case Examination = 'examination';
    case Participant = 'participant';
    case Risk = 'risk';
    case Attendance = 'attendance';

    /**
     * Label nama resmi laporan posyandu.
     */
    public function label(): string
    {
        return match ($this) {
            self::Examination => 'Laporan Pemeriksaan & Layanan',
            self::Participant => 'Laporan Data Sasaran Peserta',
            self::Risk => 'Laporan Kasus Risiko & Rujukan',
            self::Attendance => 'Laporan Kehadiran Posyandu',
        };
    }

    /**
     * Deskripsi ringkas dokumen untuk tampilan kartu di UI.
     */
    public function description(): string
    {
        return match ($this) {
            self::Examination => 'Rekapitulasi hasil penimbangan, antropometri, dan pemeriksaan posyandu ILP.',
            self::Participant => 'Rekapitulasi demografi peserta aktif, kelompok siklus hidup, dan registrasi warga.',
            self::Risk => 'Deteksi dini risiko kesehatan sasaran, tindak lanjut, dan rujukan faskes.',
            self::Attendance => 'Tingkat presensi dan rekap kehadiran kunjungan sasaran per hari buka posyandu.',
        };
    }

    /**
     * Helper untuk opsi dropdown jika dibutuhkan di masa mendatang.
     *
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
