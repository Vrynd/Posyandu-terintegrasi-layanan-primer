<script setup lang="ts">
import { computed } from 'vue';
import { RotateCcw } from '@lucide/vue';
import ToolbarChip from './ToolbarChip.vue';

export interface ActiveFilterItem {
    id: string;
    type: string;
    label: string;
}

interface Props {
    open?: boolean;
    totalCount?: number;
    search?: string | null;
    filters?: ActiveFilterItem[];
    hasActiveFilters?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    totalCount: 0,
    search: '',
    filters: () => [],
    hasActiveFilters: false,
});

const emit = defineEmits<{
    (e: 'reset'): void;
    (e: 'clearSearch'): void;
    (e: 'removeFilter', filterId: string): void;
}>();

const hasSearch = computed(() => Boolean(props.search?.trim()));
const hasFilters = computed(() => props.filters && props.filters.length > 0);
const isFiltering = computed(
    () => props.hasActiveFilters || hasSearch.value || hasFilters.value,
);

const statusType = computed(() => {
    if (isFiltering.value && props.totalCount === 0) {
        return 'not_found';
    }
    if (isFiltering.value && props.totalCount > 0) {
        return 'found';
    }
    if (!isFiltering.value && props.totalCount === 0) {
        return 'empty';
    }
    return 'idle';
});
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-200 ease-out overflow-hidden"
        leave-active-class="transition-all duration-150 ease-in overflow-hidden"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-24 opacity-100"
        leave-from-class="max-h-24 opacity-100"
        leave-to-class="max-h-0 opacity-0"
    >
        <div
            v-show="open"
            class="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border/60 pt-3 text-xs"
        >
            <div class="flex flex-wrap items-center gap-2">
                <span
                    v-if="statusType === 'found'"
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {{ props.totalCount }} data ditemukan
                </span>
                <span
                    v-else-if="statusType === 'not_found'"
                    class="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400"
                >
                    <span class="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    0 data ditemukan
                </span>
                <span
                    v-else-if="statusType === 'empty'"
                    class="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] italic text-muted-foreground ring-1 ring-border/50"
                >
                    <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    Data belum tersedia
                </span>
                <span
                    v-else
                    class="text-xs italic text-muted-foreground/60"
                >
                    Tidak ada filter atau pencarian aktif
                </span>
                <span
                    v-if="isFiltering && (hasSearch || hasFilters)"
                    class="text-border"
                >
                    |
                </span>
                <ToolbarChip
                    v-if="hasSearch"
                    :label="`'${props.search}'`"
                    @remove="emit('clearSearch')"
                />
                <template v-if="hasFilters">
                    <ToolbarChip
                        v-for="item in props.filters"
                        :key="item.id"
                        :label="item.label"
                        @remove="emit('removeFilter', item.id)"
                    />
                </template>
                <slot />
            </div>
            <div v-if="isFiltering" class="shrink-0">
                <button
                    type="button"
                    title="Reset semua filter"
                    class="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    @click="emit('reset')"
                >
                    <RotateCcw class="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    </Transition>
</template>
