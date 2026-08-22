import { router } from '@inertiajs/vue3';
import { useDebounceFn } from '@vueuse/core';

export interface UseTableQueryOptions {
    /** URL route tujuan request Inertia */
    routeUrl: string;
    /** Props Inertia yang dimuat ulang (partial reload) */
    only?: string[];
    /** Durasi debounce dalam milidetik (default: 350ms) */
    debounceMs?: number;
}

export function useTableQuery({
    routeUrl,
    only = [],
    debounceMs = 350,
}: UseTableQueryOptions) {
    /**
     * Eksekusi request GET Inertia langsung ke server.
     */
    const navigate = (params: Record<string, any> = {}) => {
        router.cancelAll();

        router.get(routeUrl, params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: only.length > 0 ? only : undefined,
        });
    };

    /**
     * Eksekusi request dengan debounce (berguna untuk input teks pencarian).
     */
    const debouncedNavigate = useDebounceFn(navigate, debounceMs);

    return {
        navigate,
        debouncedNavigate,
    };
}
