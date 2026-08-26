<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { type ListBadgeVariants, listBadgeVariants } from './index';

const props = defineProps<{
    variant?: ListBadgeVariants['variant'];
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <span
        data-slot="list-badge"
        :class="cn(listBadgeVariants({ variant }), props.class)"
    >
        <slot />
    </span>
</template>
