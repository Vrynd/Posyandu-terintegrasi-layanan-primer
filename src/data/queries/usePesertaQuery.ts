/**
 * Peserta Query Hooks
 * React Query hooks for peserta data fetching with optimized caching
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery, type UseQueryOptions } from '@tanstack/react-query';
import { pesertaApiDataSource } from '../datasources/PesertaApiDataSource';
import { queryKeys } from '../core/queryClient';
import type { GetPesertaParams, CreatePesertaRequest, PesertaListResponse } from '../models/PesertaApiTypes';

/**
 * Hook untuk fetch list peserta dengan pagination
 * - Supports filtering by kategori, search, etc.
 * - Cached per unique params combination
 */
export function usePesertaList(
    params?: GetPesertaParams, 
    options?: Omit<UseQueryOptions<PesertaListResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        ...options,
        queryKey: queryKeys.peserta.list(params),
        queryFn: async () => {
            const response = await pesertaApiDataSource.getPeserta(params);
            if (!response.data) {
                // If API succeeds but data is missing (e.g. empty results in some backend versions)
                // we should provide a fallback structure to satisfy TypeScript
                return {
                    data: [],
                    current_page: 1,
                    last_page: 1,
                    per_page: params?.limit || 20,
                    total: 0
                };
            }
            return response.data;
        },
    });
}



/**
 * Hook untuk infinite scroll list peserta
 * - Loads 20 items per page
 * - Supports all filters
 */
export function usePesertaInfinite(params?: Omit<GetPesertaParams, 'page' | 'limit'>) {
    return useInfiniteQuery({
        queryKey: [...queryKeys.peserta.lists(), 'infinite', params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await pesertaApiDataSource.getPeserta({
                ...params,
                page: pageParam,
                limit: 20,
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
}

/**
 * Hook untuk fetch detail peserta by ID
 * - Auto-caches individual peserta
 * - Can use initialData from list cache
 */
export function usePesertaDetail(id: number) {
    return useQuery({
        queryKey: queryKeys.peserta.detail(id),
        queryFn: async () => {
            const response = await pesertaApiDataSource.getPesertaById(id);
            return response.data;
        },
        enabled: id > 0, // Only fetch if id is valid
    });
}

/**
 * Hook untuk create peserta baru
 * - Auto-invalidates list cache on success
 */
export function useCreatePeserta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePesertaRequest) => 
            pesertaApiDataSource.createPeserta(data),
        onSuccess: () => {
            // Invalidate all peserta lists to trigger refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
            // Also invalidate dashboard stats
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
        },
    });
}

/**
 * Hook untuk update peserta
 * - Auto-invalidates both detail and list cache
 */
export function useUpdatePeserta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreatePesertaRequest> }) =>
            pesertaApiDataSource.updatePeserta(id, data),
        onSuccess: (_, variables) => {
            // Invalidate specific detail
            queryClient.invalidateQueries({ queryKey: queryKeys.peserta.detail(variables.id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
        },
    });
}

/**
 * Hook untuk delete peserta
 * - Auto-invalidates list and removes detail from cache
 */
export function useDeletePeserta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => pesertaApiDataSource.deletePeserta(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: queryKeys.peserta.detail(id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
            // Also invalidate dashboard stats
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
        },
    });
}

/**
 * Utility hook untuk prefetch peserta detail
 * - Call on hover to preload data
 */
export function usePrefetchPeserta() {
    const queryClient = useQueryClient();

    return (id: number) => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.peserta.detail(id),
            queryFn: async () => {
                const response = await pesertaApiDataSource.getPesertaById(id);
                return response.data;
            },
            staleTime: 60 * 1000, // Consider fresh for 1 minute
        });
    };
}

/**
 * Hook untuk fetch kunjungan terakhir peserta
 * - Uses dedicated endpoint /api/peserta/{id}/latest-visit
 * - More efficient than fetching all kunjungan
 */
export function useLatestVisit(pesertaId: number) {
    return useQuery({
        queryKey: queryKeys.peserta.latestVisit(pesertaId),
        queryFn: async () => {
            const response = await pesertaApiDataSource.getLatestVisit(pesertaId);
            return response.data;
        },
        enabled: pesertaId > 0, // Only fetch if id is valid
    });
}
