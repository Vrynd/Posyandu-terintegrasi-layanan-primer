<script setup lang="ts">
import {
    Calendar01Icon,
    Calendar03Icon,
    File01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Head, router, setLayoutProps } from '@inertiajs/vue3';
import { CheckCircle2, Clock } from '@lucide/vue';
import { computed, ref } from 'vue';
import Heading from '@/components/Heading.vue';
import MiniStats from '@/components/MiniStats.vue';
import { TileGroup, TileItem } from '@/components/ui/tile';
import { dashboard } from '@/routes';
import ReportList from './partials/ReportList.vue';
import type { ReportItem } from './partials/ReportList.vue';

interface PeriodData {
    year: number;
    month: number;
    monthName: string;
}

interface Props {
    period: PeriodData;
    reports: ReportItem[];
}

const props = defineProps<Props>();

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Laporan' },
    ],
});

// Kalkulasi Statistik Laporan dari Props Backend
const totalReports = computed(() => props.reports.length);
const completedReports = computed(
    () => props.reports.filter((r) => r.status === 'completed').length,
);
const pendingReports = computed(
    () => props.reports.filter((r) => r.status === 'pending').length,
);

// State Loading pembuatan laporan per kartu
const generatingId = ref<string | null>(null);

// Handler Buat Laporan Mandiri per Kartu
const handleGenerate = (report: ReportItem) => {
    generatingId.value = report.id;
    router.post(
        '/reports/generate',
        {
            year: props.period.year,
            month: props.period.month,
            type: report.id,
        },
        {
            preserveScroll: true,
            onFinish: () => {
                generatingId.value = null;
            },
        },
    );
};

// Handler Unduh Laporan per Kartu
const handleDownload = (report: ReportItem) => {
    if (report.status !== 'completed') {
        return;
    }

    const url = `/reports/download/${report.id}?year=${props.period.year}&month=${props.period.month}`;
    window.location.href = url;
};
</script>

<template>
    <Head title="Laporan Posyandu" />

    <div class="flex flex-1 flex-col gap-4 p-4 pb-8 sm:gap-6 sm:p-6">
        <!-- 1. Heading Utama -->
        <Heading
            title="Laporan Posyandu"
            description="Rekapitulasi data sasaran, hasil pelayanan kesehatan, dan pembuatan laporan berkala."
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

        <!-- 3. Periode Waktu -->
        <TileGroup class="divide-y-0 border-border/50 bg-card">
            <TileItem
                label="Bulan"
                :value="period.monthName"
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
                :value="String(period.year)"
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

        <!-- 4. Mini Stats: Selesai & Belum Dibuat -->
        <div class="grid grid-cols-2 gap-3">
            <MiniStats
                label="Selesai"
                :value="completedReports"
                unit="Laporan"
                :icon="CheckCircle2"
                icon-class="text-emerald-600 dark:text-emerald-400"
            />
            <MiniStats
                label="Belum Dibuat"
                :value="pendingReports"
                unit="Laporan"
                :icon="Clock"
                icon-class="text-amber-600 dark:text-amber-400"
            />
        </div>

        <!-- 5. Sub Heading Daftar Laporan -->
        <Heading
            title="Daftar Laporan"
            description="Dokumen rekapitulasi data pelayanan yang siap dibuat dan diunduh pada periode ini."
            variant="small"
            class="mt-1 mb-0 sm:mt-2 sm:mb-0"
        />

        <!-- 6. Daftar Kartu Laporan (Mandiri Tanpa ActionBar) -->
        <ReportList
            :reports="reports"
            :loading-id="generatingId"
            @generate="handleGenerate"
            @download="handleDownload"
        />
    </div>
</template>
