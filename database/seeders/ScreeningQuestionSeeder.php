<?php

namespace Database\Seeders;

use App\Enums\ParticipantCategory;
use App\Models\ScreeningQuestion;
use Illuminate\Database\Seeder;

class ScreeningQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. ADOLESCENT MENTAL HEALTH (HEEADSSS - 8 QUESTIONS)
        $teenQuestions = [
            ['key' => 'comfortable_at_home', 'question' => 'Apakah kamu merasa nyaman di rumah?', 'order' => 1],
            ['key' => 'school_pressure', 'question' => 'Apakah kamu merasa ada beban di sekolah?', 'order' => 2],
            ['key' => 'body_image', 'question' => 'Apakah ada yang kamu suka atau tidak suka pada tubuhmu?', 'order' => 3],
            ['key' => 'substance_use', 'question' => 'Apakah kamu pernah mengonsumsi rokok/alkohol atau obat-obatan (narkoba)?', 'order' => 4],
            ['key' => 'sexual_activity', 'question' => 'Apakah kamu pernah melakukan hubungan seksual dengan laki-laki/perempuan?', 'order' => 5],
            ['key' => 'environmental_safety', 'question' => 'Apakah kamu merasa tidak aman di rumah/lingkungan sekolah/di masyarakat/di jalan?', 'order' => 6],
            ['key' => 'peer_relationship', 'question' => 'Apakah kamu mempunyai teman di luar grupmu?', 'order' => 7],
            ['key' => 'suicidal_ideation', 'question' => 'Apakah kamu pernah merasa ingin bunuh diri?', 'order' => 8],
        ];

        foreach ($teenQuestions as $q) {
            ScreeningQuestion::updateOrCreate(
                ['category' => ParticipantCategory::Teenager, 'key' => $q['key']],
                [
                    'group_name' => 'Skrining Kesehatan Mental & Emosional Remaja',
                    'question' => $q['question'],
                    'input_type' => 'radio_yes_no',
                    'options' => null,
                    'order' => $q['order'],
                    'is_active' => true,
                ]
            );
        }

        // 2. PRODUCTIVE AGE RESPIRATORY SYMPTOMS (PUMA - 4 QUESTIONS)
        $productiveQuestions = [
            ['key' => 'shortness_of_breath', 'question' => 'Apakah Anda pernah merasa napas pendek ketika berjalan lebih cepat pada jalan datar atau sedikit menanjak?', 'order' => 1],
            ['key' => 'phlegm_cough', 'question' => 'Apakah Anda mempunyai dahak yang berasal dari paru atau kesulitan mengeluarkan dahak saat sedang tidak flu?', 'order' => 2],
            ['key' => 'chronic_cough', 'question' => 'Apakah Anda biasanya batuk saat sedang tidak menderita flu?', 'order' => 3],
            ['key' => 'spirometry_history', 'question' => 'Apakah dokter/nakes pernah meminta Anda melakukan pemeriksaan spirometri atau peakflow meter (meniup ke alat)?', 'order' => 4],
        ];

        foreach ($productiveQuestions as $q) {
            ScreeningQuestion::updateOrCreate(
                ['category' => ParticipantCategory::Productive, 'key' => $q['key']],
                [
                    'group_name' => 'Skrining Gejala Pernapasan',
                    'question' => $q['question'],
                    'input_type' => 'radio_yes_no',
                    'options' => null,
                    'order' => $q['order'],
                    'is_active' => true,
                ]
            );
        }

        // 3. ELDERLY FUNCTIONAL ADL (BARTHEL INDEX - 8 ACTIVITIES)
        $elderlyQuestions = [
            [
                'key' => 'bowel_control',
                'question' => 'Pengendalian Buang Air Besar',
                'order' => 1,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Terkendali / Perlu Pencahar'],
                    ['value' => '1', 'label' => 'Kadang-kadang Tak Terkendali (1x/minggu)'],
                    ['value' => '2', 'label' => 'Terkendali / Mandiri'],
                ],
            ],
            [
                'key' => 'bladder_control',
                'question' => 'Pengendalian Buang Air Kecil',
                'order' => 2,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Terkendali / Pakai Kateter'],
                    ['value' => '1', 'label' => 'Kadang-kadang Tak Terkendali (1x24 jam)'],
                    ['value' => '2', 'label' => 'Terkendali / Mandiri'],
                ],
            ],
            [
                'key' => 'grooming',
                'question' => 'Kebersihan Diri',
                'order' => 3,
                'options' => [
                    ['value' => '0', 'label' => 'Butuh Pertolongan'],
                    ['value' => '1', 'label' => 'Mandiri'],
                ],
            ],
            [
                'key' => 'toilet_use',
                'question' => 'Penggunaan WC',
                'order' => 4,
                'options' => [
                    ['value' => '0', 'label' => 'Butuh Pertolongan Penuh'],
                    ['value' => '1', 'label' => 'Perlu Pertolongan Tertentu'],
                    ['value' => '2', 'label' => 'Mandiri'],
                ],
            ],
            [
                'key' => 'feeding',
                'question' => 'Makan dan Minum',
                'order' => 5,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Mampu / Disuapi'],
                    ['value' => '1', 'label' => 'Perlu Bantuan (Memotong dll)'],
                    ['value' => '2', 'label' => 'Mandiri'],
                ],
            ],
            [
                'key' => 'transfer',
                'question' => 'Bergerak dari Kursi Roda ke Tempat Tidur',
                'order' => 6,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Mampu / Tidak Seimbang'],
                    ['value' => '1', 'label' => 'Perlu Bantuan Banyak (2 orang)'],
                    ['value' => '2', 'label' => 'Bantuan Minimal (1 orang)'],
                    ['value' => '3', 'label' => 'Mandiri'],
                ],
            ],
            [
                'key' => 'mobility',
                'question' => 'Berjalan Ditempat Rata',
                'order' => 7,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Mampu / Tirah Baring'],
                    ['value' => '1', 'label' => 'Bisa dengan Kursi Roda'],
                    ['value' => '2', 'label' => 'Berjalan dengan Bantuan 1 Orang'],
                    ['value' => '3', 'label' => 'Mandiri'],
                ],
            ],
            [
                'key' => 'stairs',
                'question' => 'Naik Turun Tangga',
                'order' => 8,
                'options' => [
                    ['value' => '0', 'label' => 'Tidak Mampu'],
                    ['value' => '1', 'label' => 'Butuh Pertolongan / Pengawasan'],
                    ['value' => '2', 'label' => 'Mandiri'],
                ],
            ],
        ];

        foreach ($elderlyQuestions as $q) {
            ScreeningQuestion::updateOrCreate(
                ['category' => ParticipantCategory::Adult, 'key' => $q['key']],
                [
                    'group_name' => 'Pengkajian Kemandirian Lansia (ADL)',
                    'question' => $q['question'],
                    'input_type' => 'select',
                    'options' => $q['options'],
                    'order' => $q['order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
