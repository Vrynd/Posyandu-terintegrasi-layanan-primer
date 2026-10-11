<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import { dashboard } from '@/routes';
import DashboardMetrics from './partials/DashboardMetrics.vue';
import type { DashboardMetricsProps } from './partials/DashboardMetrics.vue';
import ExaminationTrends from './partials/ExaminationTrends.vue';
import QuickActions from './partials/QuickActions.vue';

interface Props {
    metrics?: DashboardMetricsProps['metrics'];
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
                <!-- Kolom Kiri: Tren Pemeriksaan (~60% / 7 Kolom) -->
                <div class="lg:col-span-8">
                    <ExaminationTrends />
                </div>
                <!-- Kolom Kanan: Slot Konten Pendamping (~40% / 5 Kolom) -->
                <div class="lg:col-span-4">
                    <!-- Wadah Sementara: Siap diisi konten pendamping berikutnya -->
                    <div
                        class="flex h-full min-h-85 items-center justify-center rounded-2xl border border-dashed border-border/70 p-5 text-sm text-muted-foreground"
                    >
                        Konten Pendamping (40%)
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
