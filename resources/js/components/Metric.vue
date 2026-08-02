<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';
import type { Component } from 'vue';
import { computed } from 'vue';
import { Card } from '@/components/ui/card';

type Props = {
    title: string;
    value: string | number;
    description?: string;
    icon?: Component;
    variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'default';
};

const props = withDefaults(defineProps<Props>(), {
    variant: 'emerald',
});

const formattedValue = computed(() => {
    const num =
        typeof props.value === 'number'
            ? props.value
            : parseInt(String(props.value), 10);

    if (!isNaN(num) && num >= 0 && num < 10) {
        return String(num).padStart(2, '0');
    }

    return props.value;
});

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'emerald':
            return {
                iconColor: 'text-white',
                solidBgClass:
                    'bg-emerald-500 ring-2 sm:ring-3 ring-emerald-500/20 shadow-md shadow-emerald-500/20',
            };
        case 'indigo':
            return {
                iconColor: 'text-white',
                solidBgClass:
                    'bg-indigo-500 ring-2 sm:ring-3 ring-indigo-500/20 shadow-md shadow-indigo-500/20',
            };
        case 'amber':
            return {
                iconColor: 'text-slate-950',
                solidBgClass:
                    'bg-amber-500 ring-2 sm:ring-3 ring-amber-500/20 shadow-md shadow-amber-500/20',
            };
        case 'rose':
            return {
                iconColor: 'text-white',
                solidBgClass:
                    'bg-rose-500 ring-2 sm:ring-3 ring-rose-500/20 shadow-md shadow-rose-500/20',
            };
        default:
            return {
                iconColor: 'text-foreground',
                solidBgClass:
                    'bg-muted ring-2 sm:ring-3 ring-muted/30 shadow-xs',
            };
    }
});
</script>

<template>
    <article aria-label="Kartu Statistik">
        <Card
            class="flex flex-col justify-between gap-5 rounded-2xl border border-border/80 bg-card px-4 pt-4 pb-2.5 shadow-sm transition-all duration-200 hover:border-border/100 sm:gap-6"
        >
            <header class="flex items-center justify-between">
                <div
                    :class="[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 sm:h-6.5 sm:w-6.5',
                        variantClasses.solidBgClass,
                    ]"
                >
                    <component
                        v-if="icon"
                        :is="icon"
                        :class="[
                            'h-3.5 w-3.5 sm:h-4 sm:w-4',
                            variantClasses.iconColor,
                        ]"
                    />
                </div>

                <ArrowUpRight
                    class="h-3.5 w-3.5 text-muted-foreground/60 sm:h-4 sm:w-4"
                />
            </header>

            <main class="space-y-1">
                <p class="truncate text-xs font-medium text-muted-foreground">
                    {{ description ?? title }}
                </p>

                <h3
                    class="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                >
                    {{ formattedValue }}
                </h3>
            </main>
        </Card>
    </article>
</template>
