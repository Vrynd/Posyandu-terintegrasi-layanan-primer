<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div
        :class="
            cn(
                'flex flex-col gap-4 rounded-2xl border border-card bg-card/80 p-5 shadow-none backdrop-blur-xs dark:border-border',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
