import { router } from '@inertiajs/vue3';
import { onUnmounted, ref } from 'vue';

export interface UseTableQueryOptions {
    routeUrl: string;
    only?: string[];
    debounceMs?: number;
}

export function useTableQuery({
    routeUrl,
    only = [],
    debounceMs = 350,
}: UseTableQueryOptions) {
    const isLoading = ref(false);

    const stopOnStart = router.on('start', () => {
        isLoading.value = true;
    });

    const stopOnFinish = router.on('finish', () => {
        isLoading.value = false;
    });

    /**
     * Eksekusi request GET Inertia langsung ke server.
     */
    const performNavigate = (params: Record<string, any> = {}) => {
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
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedNavigate = (params: Record<string, any> = {}) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            performNavigate(params);
        }, debounceMs);
    };

    debouncedNavigate.cancel = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    };

    const navigate = (params: Record<string, any> = {}) => {
        debouncedNavigate.cancel();
        performNavigate(params);
    };

    onUnmounted(() => {
        stopOnStart();
        stopOnFinish();
        debouncedNavigate.cancel();
    });

    return {
        navigate,
        debouncedNavigate,
        isLoading,
    };
}
