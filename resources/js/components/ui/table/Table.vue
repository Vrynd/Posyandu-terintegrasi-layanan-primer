<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div class="relative w-full overflow-x-auto bg-muted/20 rounded-xl border border-border/60 overflow-hidden">
        <table
            data-slot="table"
            :class="cn('w-full text-left text-sm', props.class)"
        >
            <slot />
        </table>
    </div>
</template>