<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <thead
        data-slot="table-header"
        :class="cn('border-b border-dashed border-border/80 bg-muted/20 text-xs text-muted-foreground ', props.class)"
    >
        <slot />
    </thead>
</template>