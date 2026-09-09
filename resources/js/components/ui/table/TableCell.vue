<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <td
        data-slot="table-cell"
        :class="cn('px-4 py-3.5 align-middle text-[13px] text-muted-foreground first:pl-5 last:pr-5 leading-none bg-card/80 border-y border-card first:border-l first:border-card first:rounded-l-md last:border-r last:border-card last:rounded-r-md group-hover:bg-card shadow-none backdrop-blur-xs dark:border-border dark:group-hover:bg-muted/40 transition-colors', props.class)"
    >
        <slot />
    </td>
</template>