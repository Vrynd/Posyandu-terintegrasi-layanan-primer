<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3';
import {
    Calendar,
    CalendarDays,
    CheckCircle2,
    Clock,
    Download,
    FileText,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import MiniStats from '@/components/MiniStats.vue';
import { Button } from '@/components/ui/button';
import { TileGroup, TileItem } from '@/components/ui/tile';
import { dashboard } from '@/routes';
import DownloadAllSheet from './partials/DownloadAllSheet.vue';
import ReportList from './partials/ReportList.vue';
import type { ReportItem } from './partials/ReportList.vue';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Laporan' },
    ],
});

// 1. Data Periode Saat Ini
const now = new Date();
const currentYearFull = String(now.getFullYear()); // e.g. "2026"
const currentMonthName = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
}).format(now); // e.g. "Oktober"

// 2. Daftar 4 Dokumen Laporan yang Tersedia
const reports = computed<ReportItem[]>(() => [
    {
        id: 'examination',
        title: 'Laporan Pemeriksaan & Layanan',
        description:
            'Rekapitulasi hasil penimbangan, antropometri, dan pemeriksaan posyandu ILP.',
        status: 'completed',
        statusLabel: 'Selesai',
        createdAt: `01 ${currentMonthName} ${currentYearFull}`,
    },
    {
        id: 'participant',
        title: 'Laporan Data Sasaran Peserta',
        description:
            'Rekapitulasi demografi peserta aktif, kelompok siklus hidup, dan registrasi warga.',
        status: 'completed',
        statusLabel: 'Selesai',
        createdAt: `01 ${currentMonthName} ${currentYearFull}`,
    },
    {
        id: 'risk',
        title: 'Laporan Kasus Risiko & Rujukan',
        description:
            'Deteksi dini risiko kesehatan sasaran, tindak lanjut, dan rujukan faskes.',
        status: 'completed',
        statusLabel: 'Selesai',
        createdAt: `01 ${currentMonthName} ${currentYearFull}`,
    },
    {
        id: 'attendance',
        title: 'Laporan Kehadiran Posyandu',
        description:
            'Tingkat presensi dan rekap kehadiran kunjungan sasaran per hari buka posyandu.',
        status: 'pending',
        statusLabel: 'Belum Selesai',
        createdAt: 'Belum Tersedia',
    },
]);

// 3. Kalkulasi Metrik Status
const totalReports = computed(() => reports.value.length);
const completedReports = computed(
    () => reports.value.filter((r) => r.status === 'completed').length,
);
const pendingReports = computed(
    () => reports.value.filter((r) => r.status === 'pending').length,
);

// 4. State Kontrol Bottom Sheet Unduh Semua
const isDownloadSheetOpen = ref(false);

// 5. Handler Aksi Unduh Satuan
const downloadReport = (report: ReportItem) => {
    if (report.status !== 'completed') {
        return;
    }

    console.log(
        `Mengunduh ${report.title} untuk periode ${currentMonthName} ${currentYearFull}`,
    );
};
</script>

<template>
    <Head title="Laporan Posyandu" />

    <div class="flex flex-1 flex-col gap-4 p-4 pb-24 sm:gap-6 sm:p-6">
        <!-- 1. Heading Utama Halaman -->
        <Heading
            title="Laporan Posyandu"
            description="Rekapitulasi data sasaran, hasil pelayanan kesehatan, dan status kesiapan pelaporan berkala."
            class="mb-0 sm:mb-0"
        />

        <!-- 2. Jumlah Laporan -->
        <TileGroup class="border-border/50 bg-card">
            <TileItem
                label="Jumlah Laporan"
                :value="`${totalReports} Laporan`"
                :icon="FileText"
                icon-class="text-accent size-4"
                class="[&>span]:font-normal"
            />
        </TileGroup>

        <!-- 3. Periode Waktu Saat Ini -->
        <TileGroup class="divide-y-0 border-border/50 bg-card">
            <TileItem
                label="Bulan"
                :value="currentMonthName"
                :icon="Calendar"
                icon-class="text-accent size-4"
                class="relative after:absolute after:right-0 after:bottom-0 after:left-10 after:h-px after:bg-border/40 sm:after:left-10.5 [&>span]:font-normal"
            />
            <TileItem
                label="Tahun"
                :value="currentYearFull"
                :icon="CalendarDays"
                icon-class="text-accent size-4"
                class="[&>span]:font-normal"
            />
        </TileGroup>

        <!-- 4. Status Laporan Selesai dan Belum -->
        <div class="grid grid-cols-2 gap-3">
            <MiniStats
                label="Selesai"
                :value="completedReports"
                unit="Laporan"
                :icon="CheckCircle2"
                icon-class="text-emerald-600 dark:text-emerald-400"
            />
            <MiniStats
                label="Belum Selesai"
                :value="pendingReports"
                unit="Laporan"
                :icon="Clock"
                icon-class="text-amber-600 dark:text-amber-400"
            />
        </div>

        <!-- 5. Sub Heading Daftar Laporan -->
        <Heading
            title="Daftar Laporan"
            description="Dokumen rekapitulasi data pelayanan yang siap diunduh pada periode ini."
            variant="small"
            class="mt-2 mb-0 sm:mt-4 sm:mb-0"
        />

        <!-- 6. Daftar Laporan -->
        <ReportList :reports="reports" @download="downloadReport" />

        <!-- 7. Unduh Semua Laporan -->
        <ActionBar>
            <Button
                type="button"
                size="lg"
                class="w-full cursor-pointer sm:w-auto"
                @click="isDownloadSheetOpen = true"
            >
                <Download class="size-4" />
                <span>Unduh Semua Laporan</span>
            </Button>
        </ActionBar>

        <!-- 8. Bottom Sheet Filter Unduh Semua Laporan -->
        <DownloadAllSheet v-model:open="isDownloadSheetOpen" />
    </div>
</template>
