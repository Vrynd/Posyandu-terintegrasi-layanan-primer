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
        :class="cn('px-4 py-3.5 align-middle text-xs sm:text-[13px] text-muted-foreground has-[[role=checkbox]]:pr-0 leading-none', props.class)"
    >
        <slot />
    </td>
</template>