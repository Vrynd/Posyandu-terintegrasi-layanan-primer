<script setup lang="ts">
import { computed, provide } from 'vue';
import { Card } from '@/components/ui/card';
import type { MetricVariant } from '@/types';

type Props = {
    variant?: MetricVariant;
};

const props = withDefaults(defineProps<Props>(), {
    variant: 'blue',
});

provide(
    'metricVariant',
    computed(() => props.variant),
);
</script>

<template>
    <article aria-label="Kartu Statistik" class="h-full">
        <Card
            class="group relative h-full overflow-hidden flex flex-col justify-between gap-4 rounded-2xl border-0 bg-card p-4 shadow-none transition-all duration-300 hover:bg-card/90 sm:gap-5 sm:p-5 select-none"
        >
            <slot />
        </Card>
    </article>
</template>
