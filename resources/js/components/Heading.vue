<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
    class?: HTMLAttributes['class'];
};

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
});
</script>

<template>
    <header
        :class="
            cn(
                variant === 'small' ? '' : 'mb-6 space-y-0.5 sm:mb-8',
                props.class,
            )
        "
    >
        <h2
            :class="[
                'font-display font-semibold tracking-tight text-foreground',
                variant === 'small'
                    ? 'mb-0.5 text-base'
                    : 'text-lg tracking-tight sm:text-xl',
            ]"
        >
            {{ title }}
        </h2>
        <p
            v-if="description"
            class="text-xs text-muted-foreground sm:block sm:text-sm"
        >
            {{ description }}
        </p>
    </header>
</template>
