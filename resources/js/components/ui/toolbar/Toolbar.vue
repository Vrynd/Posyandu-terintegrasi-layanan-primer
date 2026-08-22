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
                'flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
