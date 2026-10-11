<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ChartLegend from '@/components/ChartLegend.vue';
import Heading from '@/components/Heading.vue';
import { dashboard } from '@/routes';
import type { FollowUpItem, MonthlyExamination } from '@/types';
import DashboardMetrics from './partials/DashboardMetrics.vue';
import type { DashboardMetricsProps } from './partials/DashboardMetrics.vue';
import ExaminationFollowUps from './partials/ExaminationFollowUps.vue';
import ExaminationProportions from './partials/ExaminationProportions.vue';
import ExaminationTrends from './partials/ExaminationTrends.vue';
import QuickActions from './partials/QuickActions.vue';

interface Props {
    metrics?: DashboardMetricsProps['metrics'];
    trends?: MonthlyExamination[];
    followUps?: FollowUpItem[];
}

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});

const page = usePage();
const greeting = computed(
    () => `Halo, ${page.props.auth?.user?.name ?? 'Pengguna'}`,
);
</script>

<template>
    <Head title="Dashboard" />

    <div
        class="flex h-full flex-1 flex-col overflow-x-auto p-4 pt-6 pb-20 sm:p-6 sm:pt-8"
    >
        <Heading
            :title="greeting"
            description="Selamat datang pantau ringkasan dan aktivitas pelayanan kesehatan hari ini"
        />

        <div class="flex flex-1 flex-col gap-4">
            <DashboardMetrics :metrics="props.metrics" />

            <Heading
                title="Aksi Cepat"
                description="Menu utama pelayanan kesehatan posyandu"
                variant="small"
                class="mt-5 sm:mt-6 lg:hidden"
            />
            <QuickActions />

            <Heading
                title="Statistik Pelayanan"
                description="Grafik capaian dan perkembangan pemeriksaan posyandu"
                variant="small"
                class="mt-5 sm:mt-6 lg:hidden"
            />
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <!-- Kolom Kiri: Tren Pemeriksaan (~60% / 8 Kolom) -->
                <div class="min-w-0 lg:col-span-8">
                    <ExaminationTrends :trends="props.trends" />
                </div>
                <!-- Kolom Kanan: Proporsi Pemeriksaan (~40% / 4 Kolom) -->
                <div class="min-w-0 lg:col-span-4">
                    <ExaminationProportions :trends="props.trends" />
                </div>

                <!-- Informan Legend Kategori (Khusus Mobile < 640px) -->
                <ChartLegend
                    layout="grid"
                    indicator="square"
                    class="px-2 pt-1 sm:hidden"
                />
            </div>

            <Heading
                title="Pantauan & Tindak Lanjut"
                description="Daftar peserta berisiko dan rujukan layanan kesehatan"
                variant="small"
                class="mt-5 sm:mt-6 lg:hidden"
            />
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <!-- Kolom Kiri: Daftar Tindak Lanjut (~60% / 8 Kolom) -->
                <div class="min-w-0 lg:col-span-8">
                    <ExaminationFollowUps :items="props.followUps" />
                </div>
            </div>
        </div>
    </div>
</template>
