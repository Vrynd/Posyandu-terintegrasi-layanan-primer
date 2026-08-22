import { router } from '@inertiajs/vue3';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

export interface UseTableSearchOptions {
    routeUrl: string;
    initialSearch?: string | null;
    only?: string[];
    debounceMs?: number;
}

export function useTableSearch({
    routeUrl,
    initialSearch = '',
    only = ['participants', 'filters'],
    debounceMs = 350,
}: UseTableSearchOptions) {
    // Normalisasi agar null / undefined selalu menjadi string aman
    const search = ref(initialSearch ?? '');
    const isExpanded = ref(Boolean(search.value?.trim()));
    const hasSearch = computed(() => Boolean(search.value?.trim()));

    // Auto-expand saat mulai mengetik, auto-collapse saat pencarian kosong
    watch(hasSearch, (active, wasActive) => {
        if (active && !wasActive) {
            isExpanded.value = true;
        } else if (!active && wasActive) {
            isExpanded.value = false;
        }
    });

    // Debounce request ke backend dengan cancelAll() dan partial reloads
    const performSearch = useDebounceFn(() => {
        router.cancelAll();

        router.get(
            routeUrl,
            { search: search.value?.trim() || undefined },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                only,
            },
        );
    }, debounceMs);

    watch(search, () => {
        performSearch();
    });

    const reset = () => {
        search.value = '';
    };

    return {
        search,
        isExpanded,
        hasSearch,
        reset,
    };
}
