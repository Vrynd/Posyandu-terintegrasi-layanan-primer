<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { trendCategories } from '@/lib/participant';
import { cn } from '@/lib/utils';

export interface ChartLegendItem {
    key: string;
    label: string;
    shortLabel?: string;
    color: string;
}

interface Props {
    items?: readonly ChartLegendItem[];
    layout?: 'inline' | 'grid';
    indicator?: 'dot' | 'square' | 'bar';
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    items: () => trendCategories,
    layout: 'inline',
    indicator: 'dot',
});

const layoutClass = computed(() =>
    props.layout === 'grid'
        ? 'grid grid-cols-4 gap-x-3 gap-y-2'
        : 'flex flex-wrap items-center gap-2 sm:gap-2.5',
);

const indicatorClass = computed(() => {
    if (props.indicator === 'square') {
        return 'size-3 rounded-[4px]';
    }

    if (props.indicator === 'bar') {
        return 'h-3.5 w-1.5 rounded-full';
    }

    return 'size-2 rounded-full';
});
</script>

<template>
    <div :class="cn('text-xs text-muted-foreground', layoutClass, props.class)">
        <div
            v-for="item in props.items"
            :key="item.key"
            class="flex items-center gap-2 select-none"
        >
            <span class="shrink-0" :class="[indicatorClass, item.color]" />
            <span
                class="truncate text-[11px] font-medium text-foreground/80 sm:text-xs"
            >
                {{ item.shortLabel ?? item.label }}
            </span>
        </div>
    </div>
</template>
