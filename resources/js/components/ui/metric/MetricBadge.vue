<script setup lang="ts">
import { ArrowRight, ArrowUpRight, TrendingDown, TrendingUp } from '@lucide/vue';
import { computed } from 'vue';
import type { MetricTrend } from '@/types';

type Props = {
    change?: number | null;
    trend?: MetricTrend | null;
};

const props = defineProps<Props>();

const computedTrend = computed<'up' | 'down' | 'neutral' | null>(() => {
    if (props.trend) {
        return props.trend;
    }

    if (props.change !== undefined && props.change !== null) {
        if (props.change > 0) {
            return 'up';
        }

        if (props.change < 0) {
            return 'down';
        }

        return 'neutral';
    }

    return null;
});

const formattedChange = computed(() => {
    if (props.change === undefined || props.change === null) {
        return null;
    }

    const absValue = Math.abs(props.change);

    const formattedNum = Number.isInteger(absValue)
        ? absValue
        : absValue.toFixed(1);

    return `${formattedNum}%`;
});

const trendBadgeClasses = computed(() => {
    switch (computedTrend.value) {
        case 'up':
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        case 'down':
            return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
        case 'neutral':
            return 'bg-muted text-muted-foreground border border-border/50';
        default:
            return '';
    }
});
</script>

<template>
    <div
        v-if="computedTrend && formattedChange"
        :class="[
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
            trendBadgeClasses,
        ]"
    >
        <TrendingUp
            v-if="computedTrend === 'up'"
            class="h-3 w-3 shrink-0"
        />
        <TrendingDown
            v-else-if="computedTrend === 'down'"
            class="h-3 w-3 shrink-0"
        />
        <ArrowRight v-else class="h-3 w-3 shrink-0" />
        <span>{{ formattedChange }}</span>
    </div>

    <!-- Fallback: Panah Default -->
    <ArrowUpRight
        v-else
        class="h-3.5 w-3.5 text-muted-foreground/60 sm:h-4 sm:w-4"
    />
</template>
