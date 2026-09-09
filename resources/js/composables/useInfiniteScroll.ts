import { router } from '@inertiajs/vue3';
import { useIntersectionObserver } from '@vueuse/core';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginatedData } from '@/types';

export interface UseInfiniteScrollOptions<T> {
    paginatedData: () => PaginatedData<T> | undefined;
    routeUrl: string;
    params?: (() => Record<string, any>) | Record<string, any>;
    only?: string[];
    dataKey?: string;
    rootMargin?: string;
}

export function useInfiniteScroll<T>({
    paginatedData,
    routeUrl,
    params = {},
    only = [],
    dataKey,
    rootMargin = '200px',
}: UseInfiniteScrollOptions<T>) {
    const initialData = paginatedData()?.data ?? [];
    const items = ref<T[]>([...initialData]) as Ref<T[]>;
    const isLoadingMore = ref(false);
    const sentinel = ref<HTMLElement | null>(null);

    watch(
        paginatedData,
        (newVal) => {
            if (!newVal || newVal.current_page === 1) {
                items.value = [...(newVal?.data ?? [])];
            }
        },
        { deep: true },
    );

    const loadMore = () => {
        const current = paginatedData();

        if (
            !current ||
            isLoadingMore.value ||
            current.current_page >= current.last_page
        ) {
            return;
        }

        isLoadingMore.value = true;
        const resolvedParams = typeof params === 'function' ? params() : params;

        router.get(
            routeUrl,
            {
                ...resolvedParams,
                page: current.current_page + 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: only.length > 0 ? only : undefined,
                onSuccess: (page) => {
                    const key = dataKey || (only.length > 0 ? only[0] : 'data');
                    const incomingPagination = (
                        page.props as Record<string, any>
                    )[key] as PaginatedData<T> | undefined;

                    if (incomingPagination?.data) {
                        items.value.push(...incomingPagination.data);
                    }
                },
                onFinish: () => {
                    isLoadingMore.value = false;
                },
            },
        );
    };

    useIntersectionObserver(
        sentinel,
        ([entry]) => {
            if (entry?.isIntersecting) {
                loadMore();
            }
        },
        { rootMargin },
    );

    const removeItem = (predicate: (item: T) => boolean) => {
        items.value = items.value.filter((item) => !predicate(item));
    };

    return {
        items,
        isLoadingMore,
        sentinel,
        loadMore,
        removeItem,
    };
}
