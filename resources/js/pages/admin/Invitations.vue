<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertTriangle,
    CheckCircle2,
    KeyRound,
    UserCheck,
    Plus,
} from '@lucide/vue';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import MetricCard from '@/components/MetricCard.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

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

type MetricProps = {
    metrics: {
        activeCount: number;
        usedCount: number;
        expiredCount: number;
        totalCount: number;
    };
};

const props = defineProps<MetricProps>();

const metricList = computed(() => [
    {
        title: 'Kode Aktif',
        value: props.metrics?.activeCount ?? 0,
        badgeText: 'Siap Pakai',
        icon: CheckCircle2,
        variant: 'emerald' as const,
    },
    {
        title: 'Kode Terpakai',
        value: props.metrics?.usedCount ?? 0,
        badgeText: 'Terverifikasi',
        icon: UserCheck,
        variant: 'indigo' as const,
    },
    {
        title: 'Kode Kadaluarsa',
        value: props.metrics?.expiredCount ?? 0,
        badgeText: 'Perlu Review',
        icon: AlertTriangle,
        variant: 'amber' as const,
    },
    {
        title: 'Total Terbit',
        value: props.metrics?.totalCount ?? 0,
        badgeText: 'Keseluruhan',
        icon: KeyRound,
        variant: 'rose' as const,
    },
]);
</script>

<template>
    <Head title="Kelola Kode Undangan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <div class="mb-8 flex items-center justify-between gap-4">
            <Heading
                title="Kelola Kode Undangan"
                description="Manajemen dan pembuatan kode registrasi akun"
                variant="small"
            />

            <Link href="/invitations/create">
                <Button
                    type="button"
                    variant="default"
                    class="font-semibold hover:bg-primary/85 hover:ring-2 hover:ring-primary/30"
                >
                    <Plus class="h-4 w-4" />
                    Buat Kode Undangan
                </Button>
            </Link>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                v-for="metric in metricList"
                :key="metric.title"
                v-bind="metric"
            />
        </div>

        <div
            class="mt-6 flex min-h-75 flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center"
        >
            <div class="flex max-w-sm flex-col items-center gap-2">
                <h3 class="text-sm font-semibold text-foreground">
                    Fitur Manajemen Kode Undangan
                </h3>
                <p class="text-xs text-muted-foreground">
                    Halaman ini digunakan oleh Administrator untuk mengelola dan
                    memantau kode undangan pendaftaran kader.
                </p>
            </div>
        </div>
    </div>
</template>
