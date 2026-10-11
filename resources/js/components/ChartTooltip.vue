<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { cn } from '@/lib/utils';

export interface ChartTooltipItem {
    key: string;
    label: string;
    value: string | number;
    color?: string;
}

interface Props {
    title: string;
    summary?: string;
    items?: ChartTooltipItem[];
    emptyText?: string;
    align?: 'left' | 'center' | 'right';
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    emptyText: 'Tidak ada data',
    align: 'center',
});

const alignmentClass = computed(() => {
    if (props.align === 'left') {
        return 'left-0';
    }

    if (props.align === 'right') {
        return 'right-0';
    }

    return 'left-1/2 -translate-x-1/2';
});
</script>

<template>
    <div
        :class="
            cn(
                'pointer-events-none absolute top-0 z-30 flex w-max min-w-41.25 flex-col gap-1.5 rounded-xl border border-border/70 bg-popover/95 p-2.5 text-xs shadow-lg backdrop-blur-md transition-all',
                alignmentClass,
                props.class,
            )
        "
    >
        <!-- Header Tooltip: Judul & Ringkasan Total -->
        <slot name="header">
            <div
                class="flex items-center justify-between gap-4 border-b border-border/50 pb-1"
            >
                <span class="text-[11px] font-semibold text-foreground">
                    {{ title }}
                </span>
                <span
                    v-if="summary"
                    class="text-[10px] font-medium text-muted-foreground"
                >
                    {{ summary }}
                </span>
            </div>
        </slot>

        <!-- Isi Tooltip: Grid Rincian Item atau Pesan Kosong -->
        <slot>
            <div
                v-if="items.length > 0"
                class="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]"
            >
                <div
                    v-for="(item, idx) in items"
                    :key="item.key"
                    class="flex items-center justify-between gap-1.5"
                    :class="[
                        items.length % 2 === 1 &&
                            idx === items.length - 1 &&
                            'col-span-2 border-t border-dashed border-border/40 pt-1',
                    ]"
                >
                    <span class="flex items-center gap-1 text-muted-foreground">
                        <span
                            v-if="item.color"
                            class="size-1.5 shrink-0 rounded-full"
                            :class="item.color"
                        />
                        {{ item.label }}
                    </span>
                    <span class="font-semibold text-foreground">
                        {{ item.value }}
                    </span>
                </div>
            </div>

            <div
                v-else
                class="py-1 text-center text-[10px] font-medium text-muted-foreground"
            >
                {{ emptyText }}
            </div>
        </slot>
    </div>
</template>
