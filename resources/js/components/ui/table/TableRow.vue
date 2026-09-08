<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <tr
        data-slot="table-row"
        :class="cn('group transition-all duration-150 last:[&>td:first-child]:rounded-bl-2xl last:[&>td:last-child]:rounded-br-2xl', props.class)"
    >
        <slot />
    </tr>
</template>