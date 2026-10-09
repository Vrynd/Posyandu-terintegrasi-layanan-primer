<script setup lang="ts">
import {
    Baby,
    Briefcase,
    GraduationCap,
    HeartHandshake,
    HeartPulse,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import {
    MetricBadge,
    MetricCard,
    MetricContent,
    MetricContour,
    MetricHeader,
} from '@/components/ui/metric';
import type { MetricStat } from '@/types';

export interface DashboardMetricsProps {
    metrics?: {
        total: MetricStat;
        pregnant: MetricStat;
        toddler: MetricStat;
        teenager: MetricStat;
        productive: MetricStat;
        adult: MetricStat;
    };
}

const props = withDefaults(defineProps<DashboardMetricsProps>(), {
    metrics: () => ({
        total: { value: 0, change: null, trend: null, period: null },
        pregnant: { value: 0, change: null, trend: null, period: null },
        toddler: { value: 0, change: null, trend: null, period: null },
        teenager: { value: 0, change: null, trend: null, period: null },
        productive: { value: 0, change: null, trend: null, period: null },
        adult: { value: 0, change: null, trend: null, period: null },
    }),
});

// Data 6 Metrik: Menggabungkan data real-time dengan palet warna dan ikon khas
const categoryMetrics = computed(() => [
    {
        category: 'total',
        title: 'Total Peserta',
        value: props.metrics.total.value,
        change: props.metrics.total.change,
        trend: props.metrics.total.trend,
        period: props.metrics.total.period,
        icon: Users,
        variant: 'violet' as const,
    },
    {
        category: 'pregnant',
        title: 'Ibu Hamil & Nifas',
        value: props.metrics.pregnant.value,
        change: props.metrics.pregnant.change,
        trend: props.metrics.pregnant.trend,
        period: props.metrics.pregnant.period,
        icon: HeartPulse,
        variant: 'pink' as const,
    },
    {
        category: 'toddler',
        title: 'Bayi atau Balita',
        value: props.metrics.toddler.value,
        change: props.metrics.toddler.change,
        trend: props.metrics.toddler.trend,
        period: props.metrics.toddler.period,
        icon: Baby,
        variant: 'blue' as const,
    },
    {
        category: 'teenager',
        title: 'Anak Remaja',
        value: props.metrics.teenager.value,
        change: props.metrics.teenager.change,
        trend: props.metrics.teenager.trend,
        period: props.metrics.teenager.period,
        icon: GraduationCap,
        variant: 'tosca' as const,
    },
    {
        category: 'productive',
        title: 'Usia Produktif',
        value: props.metrics.productive.value,
        change: props.metrics.productive.change,
        trend: props.metrics.productive.trend,
        period: props.metrics.productive.period,
        icon: Briefcase,
        variant: 'orange' as const,
    },
    {
        category: 'adult',
        title: 'Usia Lansia',
        value: props.metrics.adult.value,
        change: props.metrics.adult.change,
        trend: props.metrics.adult.trend,
        period: props.metrics.adult.period,
        icon: HeartHandshake,
        variant: 'yellow' as const,
    },
]);
</script>

<template>
    <!-- Carousel Metrik Horizontal Native -->
    <div class="relative">
        <div
            class="-mx-4 flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-4 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
            <div
                v-for="item in categoryMetrics"
                :key="item.category"
                class="w-[50vw] min-w-40 shrink-0 snap-start sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]"
            >
                <MetricCard :variant="item.variant">
                    <MetricContour />
                    <MetricHeader :icon="item.icon">
                        <MetricBadge
                            :change="item.change"
                            :trend="item.trend"
                        />
                    </MetricHeader>
                    <MetricContent
                        :title="item.title"
                        :value="item.value"
                        :period="item.period"
                    />
                </MetricCard>
            </div>
        </div>
    </div>
</template>
