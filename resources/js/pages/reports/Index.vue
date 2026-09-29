<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3';
import { CheckCircle2, Clock, Download } from '@lucide/vue';
import { ref } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import MiniStats from '@/components/MiniStats.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { ReportType } from '@/types';
import DownloadAllSheet from './partials/DownloadAllSheet.vue';
import TypeSelector from './partials/TypeSelector.vue';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Laporan' },
    ],
});

// State jenis laporan (default null: belum ada yang terpilih)
const selectedReportType = ref<ReportType | null>(null);

// State kontrol bottom sheet unduh semua laporan
const isDownloadSheetOpen = ref(false);
</script>

<template>
    <Head title="Laporan Posyandu" />

    <div class="flex flex-1 flex-col gap-4 p-4 pb-20 sm:gap-6 sm:p-6">
        <!-- 1. Heading Utama Halaman -->
        <Heading
            title="Laporan Posyandu"
            description="Rekapitulasi data sasaran, hasil pelayanan kesehatan, dan pelaporan berkala posyandu."
            class="mb-0 sm:mb-0"
        />

        <!-- 2. Sub Menu Laporan (Pilihan Jenis Laporan) -->
        <TypeSelector v-model="selectedReportType" />

        <!-- 3. Mini Stats -->
        <div class="grid grid-cols-2 gap-3">
            <MiniStats
                label="Selesai"
                :value="3"
                unit="Laporan"
                :icon="CheckCircle2"
                icon-class="text-emerald-600 dark:text-emerald-400"
            />
            <MiniStats
                label="Belum Selesai"
                :value="1"
                unit="Laporan"
                :icon="Clock"
                icon-class="text-amber-600 dark:text-amber-400"
            />
        </div>

        <!-- 4. Action Bar: Unduh Semua Laporan -->
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

        <!-- 4. Bottom Sheet Filter Unduh Semua Laporan -->
        <DownloadAllSheet v-model:open="isDownloadSheetOpen" />
    </div>
</template>
