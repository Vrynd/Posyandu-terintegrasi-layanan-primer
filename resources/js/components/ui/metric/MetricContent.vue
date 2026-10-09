<script setup lang="ts">
import { computed } from 'vue';

type Props = {
    title: string;
    value: string | number;
    description?: string;
    period?: string | null;
};

const props = defineProps<Props>();

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
</script>

<template>
    <main class="relative z-10 space-y-2">
        <p class="truncate text-xs text-foreground">
            {{ description ?? title }}
        </p>

        <h3
            class="font-display text-xl font-medium tracking-tight leading-none text-foreground sm:text-2xl"
        >
            {{ formattedValue }}
        </h3>

        <p
            v-if="period"
            class="truncate text-[11px] text-muted-foreground"
        >
            {{ period }}
        </p>
    </main>
</template>
