<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div class="relative w-full overflow-x-auto">
        <table
            data-slot="table"
            :class="cn('w-full text-left text-sm border-separate border-spacing-y-0.5', props.class)"
        >
            <slot />
        </table>
    </div>
</template>