<script setup lang="ts">
type Props = {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
};

withDefaults(defineProps<Props>(), {
    variant: 'default',
});
</script>

<template>
    <header :class="variant === 'small' ? '' : 'mb-6 space-y-0.5 sm:mb-8'">
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
