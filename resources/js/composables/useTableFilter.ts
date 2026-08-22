import { computed, reactive, ref } from 'vue';

export interface UseTableFilterOptions<TFilters extends Record<string, any>> {
    /** Nilai awal pencarian kata kunci */
    initialSearch?: string | null;
    /** Nilai awal untuk masing-masing filter */
    initialFilters?: TFilters;
    /** Nilai default untuk evaluasi apakah filter aktif / diubah */
    defaultFilters?: Partial<TFilters>;
}

export function useTableFilter<TFilters extends Record<string, any>>({
    initialSearch = '',
    initialFilters = {} as TFilters,
    defaultFilters = {} as Partial<TFilters>,
}: UseTableFilterOptions<TFilters> = {}) {
    // 1. Reactive State
    const search = ref(initialSearch ?? '');
    const filters = reactive<TFilters>({ ...initialFilters }) as TFilters;

    // 2. Evaluasi Filter Aktif
    const hasSearch = computed(() => Boolean(search.value?.trim()));

    const isFilterModified = (key: keyof TFilters): boolean => {
        const val = filters[key];
        const defaultVal = defaultFilters[key];

        if (defaultVal === undefined) {
            return val !== undefined && val !== null && val !== '';
        }

        return val !== defaultVal;
    };

    const hasActiveDropdownFilters = computed(() =>
        Object.keys(filters).some((key) =>
            isFilterModified(key as keyof TFilters),
        ),
    );

    const activeFilterCount = computed(() => {
        let count = 0;

        if (hasSearch.value) {
            count += 1;
        }

        for (const key of Object.keys(filters)) {
            if (isFilterModified(key as keyof TFilters)) {
                count += 1;
            }
        }

        return count;
    });

    const hasActiveFilters = computed(
        () => hasSearch.value || hasActiveDropdownFilters.value,
    );

    // 3. Konversi ke Query Parameters Bersih (hanya parameter aktif/berubah)
    const toQueryParams = (): Record<string, any> => {
        const params: Record<string, any> = {};

        if (search.value?.trim()) {
            params.search = search.value.trim();
        }

        for (const [key, value] of Object.entries(filters)) {
            const defaultVal = defaultFilters[key as keyof TFilters];

            if (
                value !== undefined &&
                value !== null &&
                value !== '' &&
                value !== defaultVal
            ) {
                params[key] = value;
            }
        }

        return params;
    };

    // 4. Operasi Reset
    const resetSearch = () => {
        search.value = '';
    };

    const resetFilters = () => {
        for (const key of Object.keys(filters)) {
            filters[key as keyof TFilters] = (defaultFilters[
                key as keyof TFilters
            ] ?? '') as TFilters[keyof TFilters];
        }
    };

    const resetAll = () => {
        resetSearch();
        resetFilters();
    };

    return {
        search,
        filters,
        hasSearch,
        hasActiveFilters,
        activeFilterCount,
        toQueryParams,
        resetSearch,
        resetFilters,
        resetAll,
    };
}
