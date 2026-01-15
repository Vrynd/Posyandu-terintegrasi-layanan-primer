/**
 * Pemeriksaan Query Hooks
 * React Query hooks for examination/visit data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pemeriksaanApiDataSource } from '../datasources/PemeriksaanApiDataSource';
import { queryKeys } from '../core/queryClient';
import type { GetPemeriksaanParams, CreatePemeriksaanRequest } from '../models/PemeriksaanApiTypes';

/**
 * Hook untuk fetch list pemeriksaan dengan pagination
 * - Supports filtering by peserta_id, tanggal, kategori
 */
export function usePemeriksaanList(params?: GetPemeriksaanParams) {
    return useQuery({
        queryKey: queryKeys.pemeriksaan.list(params),
        queryFn: async () => {
            const response = await pemeriksaanApiDataSource.getPemeriksaan(params);
            return response.data;
        },
    });
}

/**
 * Hook untuk fetch detail pemeriksaan by ID
 */
export function usePemeriksaanDetail(id: number | string) {
    return useQuery({
        queryKey: queryKeys.pemeriksaan.detail(id),
        queryFn: async () => {
            const response = await pemeriksaanApiDataSource.getPemeriksaanDetail(id);
            return response.data;
        },
        enabled: !!id, // Only fetch if id is valid
    });
}

/**
 * Hook untuk create pemeriksaan baru
 * - Targeted invalidation: Sets created data directly in cache
 * - Invalidates related caches on success
 */
export function useCreatePemeriksaan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePemeriksaanRequest) =>
            pemeriksaanApiDataSource.createPemeriksaan(data),
        onSuccess: (response, variables) => {
            // If the API returns the created data, pre-populate detail cache
            if (response.data) {
                queryClient.setQueryData(
                    queryKeys.pemeriksaan.detail(response.data.id),
                    response.data
                );
            }
            // Invalidate pemeriksaan lists
            queryClient.invalidateQueries({ queryKey: queryKeys.pemeriksaan.lists() });
            // Invalidate peserta's latest visit
            queryClient.invalidateQueries({ 
                queryKey: queryKeys.peserta.latestVisit(variables.peserta_id) 
            });
            // Invalidate dashboard stats (kunjungan count)
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
            // Invalidate dashboard chart
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}


/**
 * Hook untuk delete pemeriksaan
 * - Optimistic update: UI updates instantly
 * - Auto-rollback on error
 * - Auto-invalidates after settled
 */
export function useDeletePemeriksaan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => pemeriksaanApiDataSource.deletePemeriksaan(id),
        
        // OPTIMISTIC: Update UI before server response
        onMutate: async (id) => {
            // Cancel ongoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: queryKeys.pemeriksaan.lists() });

            // Snapshot ALL current pemeriksaan list queries for rollback
            const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.pemeriksaan.lists() });

            // Optimistically remove from ALL list caches
            queryClient.setQueriesData(
                { queryKey: queryKeys.pemeriksaan.lists() },
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        data: old.data.filter((p: any) => p.id !== id),
                        total: old.total - 1,
                    };
                }
            );

            // Return context for rollback
            return { previousQueries };
        },

        // Rollback on error
        onError: (_err, _id, context) => {
            // Restore all cached queries to their previous state
            context?.previousQueries.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },

        // Always refetch after settled (success or error)
        onSettled: () => {
            // Invalidate pemeriksaan lists for fresh data
            queryClient.invalidateQueries({ queryKey: queryKeys.pemeriksaan.lists() });
            // Invalidate dashboard
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}


// Alias for backward compatibility
export const useKunjunganList = usePemeriksaanList;
export const useKunjunganDetail = usePemeriksaanDetail;
export const useCreateKunjungan = useCreatePemeriksaan;
export const useDeleteKunjungan = useDeletePemeriksaan;
