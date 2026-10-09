<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { dashboard } from '@/routes';
import DashboardMetrics from './partials/DashboardMetrics.vue';
import type { DashboardMetricsProps } from './partials/DashboardMetrics.vue';

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
        class="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-6 pb-20 sm:p-6 sm:pt-8"
    >
        <Heading
            :title="greeting"
            description="Selamat datang pantau ringkasan dan aktivitas pelayanan kesehatan hari ini"
        />

        <!-- Pembungkus Konten Dashboard -->
        <div class="flex flex-1 flex-col gap-4">
            <!-- Carousel Metrik Terisolasi (Partial) -->
            <DashboardMetrics :metrics="props.metrics" />

            <!-- Kartu Besar Bagian Bawah (Tetap Utuh) -->
            <div
                class="relative min-h-screen flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border"
            >
                <PlaceholderPattern />
            </div>
        </div>
    </div>
</template>
