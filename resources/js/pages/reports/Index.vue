<script setup lang="ts">
import {
    Calendar01Icon,
    Calendar03Icon,
    File01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Head, router, setLayoutProps } from '@inertiajs/vue3';
import { CheckCircle2, Clock, Download, Lock, Unlock } from '@lucide/vue';
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

interface CurrentPeriod {
    year: number;
    month: number;
    monthName: string;
    isFinalized: boolean;
    finalizedAt: string | null;
    examinationCount: number;
}

interface Props {
    reports: ReportItem[];
    currentPeriod: CurrentPeriod;
}

const props = defineProps<Props>();

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Laporan' },
    ],
});

// Metrik Status Laporan
const totalReports = computed(() => props.reports.length);
const completedReports = computed(
    () => props.reports.filter((r) => r.status === 'completed').length,
);
const pendingReports = computed(
    () => props.reports.filter((r) => r.status === 'pending').length,
);

// State Modal Download Semua
const isDownloadSheetOpen = ref(false);

// Handler Unduh Satuan
const downloadReport = (report: ReportItem) => {
    if (report.status !== 'completed') {
        return;
    }

    const url = `/reports/download/${report.id}?year=${props.currentPeriod.year}&month=${props.currentPeriod.month}`;
    window.location.href = url;
};

// Handler Selesaikan / Finalisasi Laporan
const isProcessing = ref(false);

const handleFinalize = () => {
    if (
        !confirm(
            `Kunci dan selesaikan seluruh laporan untuk periode ${props.currentPeriod.monthName} ${props.currentPeriod.year}?`,
        )
    ) {
        return;
    }

    isProcessing.value = true;
    router.post(
        '/reports/finalize',
        {
            year: props.currentPeriod.year,
            month: props.currentPeriod.month,
        },
        {
            onFinish: () => {
                isProcessing.value = false;
            },
        },
    );
};

// Handler Buka Kembali Kunci Laporan
const handleReopen = () => {
    if (
        !confirm(
            `Buka kembali laporan periode ${props.currentPeriod.monthName} ${props.currentPeriod.year} untuk mengedit data?`,
        )
    ) {
        return;
    }

    isProcessing.value = true;
    router.post(
        '/reports/reopen',
        {
            year: props.currentPeriod.year,
            month: props.currentPeriod.month,
        },
        {
            onFinish: () => {
                isProcessing.value = false;
            },
        },
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
                class="[&>span]:font-normal"
            >
                <template #icon>
                    <HugeiconsIcon
                        :icon="File01Icon"
                        :size="18"
                        class="text-accent"
                    />
                </template>
            </TileItem>
        </TileGroup>

        <!-- 3. Periode Waktu Saat Ini -->
        <TileGroup class="divide-y-0 border-border/50 bg-card">
            <TileItem
                label="Bulan"
                :value="currentPeriod.monthName"
                class="relative after:absolute after:right-0 after:bottom-0 after:left-10 after:h-px after:bg-border/40 sm:after:left-10.5 [&>span]:font-normal"
            >
                <template #icon>
                    <HugeiconsIcon
                        :icon="Calendar03Icon"
                        :size="18"
                        class="text-accent"
                    />
                </template>
            </TileItem>
            <TileItem
                label="Tahun"
                :value="String(currentPeriod.year)"
                class="[&>span]:font-normal"
            >
                <template #icon>
                    <HugeiconsIcon
                        :icon="Calendar01Icon"
                        :size="18"
                        class="text-accent"
                    />
                </template>
            </TileItem>
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

        <!-- 5. Tombol Aksi Kontrol Status Finalisasi oleh Kader -->
        <div class="flex justify-end">
            <Button
                v-if="!currentPeriod.isFinalized"
                type="button"
                variant="outline"
                size="sm"
                :disabled="isProcessing"
                class="border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                @click="handleFinalize"
            >
                <Lock class="mr-1.5 size-3.5" />
                <span>Selesaikan Laporan Bulan Ini</span>
            </Button>
            <Button
                v-else
                type="button"
                variant="outline"
                size="sm"
                :disabled="isProcessing"
                class="border-amber-600/30 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                @click="handleReopen"
            >
                <Unlock class="mr-1.5 size-3.5" />
                <span>Buka Kembali Laporan</span>
            </Button>
        </div>

        <!-- 6. Sub Heading Daftar Laporan -->
        <Heading
            title="Daftar Laporan"
            description="Dokumen rekapitulasi data pelayanan yang siap diunduh pada periode ini."
            variant="small"
            class="mt-1 mb-0 sm:mt-2 sm:mb-0"
        />

        <!-- 7. Daftar Laporan -->
        <ReportList :reports="reports" @download="downloadReport" />

        <!-- 8. Unduh Semua Laporan -->
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

        <!-- 9. Bottom Sheet Filter Unduh Semua Laporan -->
        <DownloadAllSheet v-model:open="isDownloadSheetOpen" />
    </div>
</template>
