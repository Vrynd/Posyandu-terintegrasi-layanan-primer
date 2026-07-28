<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    sortable?: boolean;
    sortDirection?: 'asc' | 'desc' | null;
}>();
const emit = defineEmits<{
    (e: 'sort'): void;
}>();
</script>

<template>
    <th
        data-slot="table-head"
        :class="cn('px-4 py-3.5 font-medium capitalize text-xs sm:text-[13px] align-middle text-foreground transition-colors has-[[role=checkbox]]:pr-0', sortable && 'cursor-pointer select-none hover:text-foreground', props.class)"  @click="sortable && emit('sort')"
    >
        <div class="inline-flex items-center gap-1.5">
            <slot />

            <template v-if="sortable">
                <ArrowUp v-if="sortDirection === 'asc'" class="h-3.5 w-3.5 text-primary" />
                <ArrowDown v-else-if="sortDirection === 'desc'" class="h-3.5 w-3.5 text-primary" />
                <ChevronsUpDown v-else class="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
            </template>
        </div>
    </th>
</template>