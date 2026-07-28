<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <th
        data-slot="table-head"
        :class="cn('px-4 py-3.5 font-medium capitalize text-xs sm:text-[13px] align-middle text-foreground has-[[role=checkbox]]:pr-0', props.class)"
    >
        <slot />
    </th>
</template>