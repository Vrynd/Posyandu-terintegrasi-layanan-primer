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
                'font-display tracking-tight',
                variant === 'small'
                    ? 'mb-0.5 text-base font-medium'
                    : 'text-xl font-semibold tracking-tight',
            ]"
        >
            {{ title }}
        </h2>
        <p v-if="description" class="text-sm text-muted-foreground sm:block">
            {{ description }}
        </p>
    </header>
</template>
