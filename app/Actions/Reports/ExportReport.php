<?php

namespace App\Actions\Reports;

use App\Enums\ReportType;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportReport
{
    public function __construct(
        protected GetReport $dataAction
    ) {}

    public function download(ReportType $type, int $year, int $month): StreamedResponse
    {
        return match ($type) {
            ReportType::Participant => $this->exportParticipants(),
            ReportType::Examination => $this->exportExaminations($year, $month),
            ReportType::Risk => $this->exportRisks($year, $month),
            ReportType::Attendance => $this->exportAttendance($year, $month),
        };
    }

    public function exportParticipants(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Sasaran');

        $headers = [
            'No', 'NIK', 'Nama Lengkap', 'Kategori', 'Jenis Kelamin',
            'Tanggal Lahir', 'Usia Saat Ini', 'Alamat', 'RT/RW',
            'No. HP/WA', 'BPJS', 'Nomor BPJS', 'Info Khusus Keluarga', 'Status',
        ];

        $data = $this->dataAction->getParticipants();
        $this->writeTable($sheet, 'LAPORAN DATA SASARAN PESERTA POSYANDU', $headers, $data->toArray());

        return $this->streamDownload($spreadsheet, 'Laporan_Data_Sasaran_'.date('Ymd_His').'.xlsx');
    }

    public function exportExaminations(int $year, int $month): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $reports = $this->dataAction->getExaminations($year, $month);

        // Tab Balita
        $sheet1 = $spreadsheet->getActiveSheet();
        $sheet1->setTitle('Balita');
        $headers1 = [
            'No', 'Tgl Periksa', 'Lokasi', 'NIK', 'Nama Balita', 'Nama Ortu', 'L/P',
            'Usia (Bln)', 'BB (kg)', 'TB (cm)', 'LK (cm)', 'LiLA (cm)', 'Status BB',
            'Gejala Sakit', 'Intervensi', 'Skrining TBC', 'Dirujuk', 'Petugas',
        ];
        $this->writeTable($sheet1, "PEMERIKSAAN BALITA - PERIODE {$month}/{$year}", $headers1, $reports['toddler']->toArray());

        // Tab Ibu Hamil
        $sheet2 = $spreadsheet->createSheet();
        $sheet2->setTitle('Ibu Hamil');
        $headers2 = [
            'No', 'Tgl Periksa', 'Lokasi', 'NIK', 'Nama Ibu', 'Nama Suami', 'Hamil Ke',
            'Usia Gestasi', 'BB (kg)', 'LiLA (cm)', 'Status Gizi', 'Tensi', 'Tablet Fe',
            'Konseling ASI', 'PMT KEK', 'Kelas Bumil', 'Dirujuk', 'Petugas',
        ];
        $this->writeTable($sheet2, "PEMERIKSAAN IBU HAMIL - PERIODE {$month}/{$year}", $headers2, $reports['pregnant']->toArray());

        // Tab Remaja
        $sheet3 = $spreadsheet->createSheet();
        $sheet3->setTitle('Remaja');
        $headers3 = [
            'No', 'Tgl Periksa', 'Lokasi', 'NIK', 'Nama Remaja', 'L/P', 'BB (kg)',
            'TB (cm)', 'LP (cm)', 'Kategori IMT', 'Tensi', 'GDS (mg/dL)', 'Hb', 'Dirujuk', 'Petugas',
        ];
        $this->writeTable($sheet3, "PEMERIKSAAN REMAJA - PERIODE {$month}/{$year}", $headers3, $reports['teen']->toArray());

        // Tab Dewasa & Lansia
        $sheet4 = $spreadsheet->createSheet();
        $sheet4->setTitle('Dewasa & Lansia');
        $headers4 = [
            'No', 'Tgl Periksa', 'Lokasi', 'NIK', 'Nama Peserta', 'L/P', 'Kategori',
            'BB (kg)', 'TB (cm)', 'LP (cm)', 'IMT', 'Tensi', 'GDS (mg/dL)', 'Kolesterol',
            'Asam Urat', 'Merokok', 'Kemandirian ADL', 'Dirujuk', 'Petugas',
        ];
        $this->writeTable($sheet4, "PEMERIKSAAN DEWASA & LANSIA - PERIODE {$month}/{$year}", $headers4, $reports['adult']->toArray());

        $spreadsheet->setActiveSheetIndex(0);

        return $this->streamDownload($spreadsheet, "Laporan_Pemeriksaan_Layanan_{$year}_{$month}.xlsx");
    }

    public function exportRisks(int $year, int $month): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Kasus Risiko & Rujukan');

        $headers = [
            'No', 'Tgl Pemeriksaan', 'NIK', 'Nama Peserta', 'Kategori', 'Gender / Usia',
            'RT/RW', 'No. HP', 'Indikasi Risiko / Masalah', 'Hasil Pengukuran Terkait',
            'Status Rujukan', 'Tempat Pelayanan', 'Edukasi & Intervensi',
        ];

        $data = $this->dataAction->getRisks($year, $month);
        $this->writeTable($sheet, "LAPORAN KASUS RISIKO & RUJUKAN - PERIODE {$month}/{$year}", $headers, $data->toArray());

        return $this->streamDownload($spreadsheet, "Laporan_Kasus_Risiko_Rujukan_{$year}_{$month}.xlsx");
    }

    public function exportAttendance(int $year, int $month): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $attendance = $this->dataAction->getAttendance($year, $month);

        // Tab Rekap Statistik D/S
        $sheet1 = $spreadsheet->getActiveSheet();
        $sheet1->setTitle('Statistik D-S');
        $headers1 = ['Kelompok Sasaran', 'Sasaran (S)', 'Posyandu (H)', 'Kunjungan (K)', 'Total Terlayani (D)', 'Absen (S-D)', 'Cakupan (%)'];
        $this->writeTable($sheet1, "REKAPITULASI CAKUPAN KEHADIRAN POSYANDU (D/S) - {$month}/{$year}", $headers1, $attendance['rekap']);

        // Tab Presensi Detail
        $sheet2 = $spreadsheet->createSheet();
        $sheet2->setTitle('Daftar Presensi Warga');
        $headers2 = ['No', 'NIK', 'Nama Lengkap', 'Kategori Sasaran', 'RT/RW', 'Status Kehadiran', 'Tanggal Pelayanan'];
        $this->writeTable($sheet2, "DAFTAR PRESENSI KEHADIRAN WARGA - {$month}/{$year}", $headers2, $attendance['presensi']->toArray());

        $spreadsheet->setActiveSheetIndex(0);

        return $this->streamDownload($spreadsheet, "Laporan_Kehadiran_Posyandu_{$year}_{$month}.xlsx");
    }

    /**
     * @param  array<string>  $headers
     * @param  array<int, array<string|int, mixed>>  $rows
     */
    protected function writeTable(Worksheet $sheet, string $title, array $headers, array $rows): void
    {
        $sheet->setCellValue('A1', $title);
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(13);

        $colLetter = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($colLetter.'3', $header);
            $colLetter++;
        }
        $lastCol = chr(ord('A') + count($headers) - 1);

        $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => '1E4620']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E2F0D9']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'B2D8B2']]],
        ]);

        $currentRow = 4;
        foreach ($rows as $row) {
            $col = 'A';
            foreach ($row as $val) {
                $sheet->setCellValueExplicit($col.$currentRow, (string) $val, DataType::TYPE_STRING);
                $col++;
            }
            $currentRow++;
        }

        $endRow = max(4, $currentRow - 1);
        $sheet->getStyle("A4:{$lastCol}{$endRow}")->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E0E0E0']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);

        foreach (range('A', $lastCol) as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }

    protected function streamDownload(Spreadsheet $spreadsheet, string $filename): StreamedResponse
    {
        return new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'max-age=0',
        ]);
    }
}
