<script setup lang="ts">
import type { Component, ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import type { MetricVariant } from '@/types';

type Props = {
    icon?: Component;
    variant?: MetricVariant;
};

const props = defineProps<Props>();
const injectedVariant = inject<ComputedRef<MetricVariant> | null>(
    'metricVariant',
    null,
);

const activeVariant = computed(
    () => props.variant ?? injectedVariant?.value ?? 'blue',
);

const solidClasses = computed(() => {
    switch (activeVariant.value) {
        case 'violet':
            return {
                iconColor: 'text-white',
                solidBg: 'bg-violet-600 ring-2 ring-violet-600/20',
            };
        case 'pink':
        case 'rose':
            return {
                iconColor: 'text-white',
                solidBg: 'bg-pink-500 ring-2 ring-pink-500/20',
            };
        case 'blue':
        case 'indigo':
            return {
                iconColor: 'text-white',
                solidBg: 'bg-blue-500 ring-2 ring-blue-500/20',
            };
        case 'tosca':
        case 'emerald':
            return {
                iconColor: 'text-white',
                solidBg: 'bg-teal-500 ring-2 ring-teal-500/20',
            };
        case 'orange':
            return {
                iconColor: 'text-white',
                solidBg: 'bg-orange-500 ring-2 ring-orange-500/20',
            };
        case 'yellow':
        case 'amber':
            return {
                iconColor: 'text-slate-950',
                solidBg: 'bg-amber-400 ring-2 ring-amber-400/20',
            };
        default:
            return {
                iconColor: 'text-white',
                solidBg: 'bg-slate-600 ring-2 ring-slate-600/20',
            };
    }
});
</script>

<template>
    <header class="relative z-10 flex items-center justify-between">
        <div
            :class="[
                'flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 sm:h-7 sm:w-7',
                solidClasses.solidBg,
            ]"
        >
            <component
                v-if="icon"
                :is="icon"
                :class="['h-3.5 w-3.5 sm:h-4 sm:w-4', solidClasses.iconColor]"
            />
        </div>

        <slot />
    </header>
</template>
