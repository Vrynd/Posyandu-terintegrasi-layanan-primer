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
 * - Auto-invalidates list cache on success
 * - Also invalidates dashboard stats for updated counts
 */
export function useCreatePemeriksaan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePemeriksaanRequest) =>
            pemeriksaanApiDataSource.createPemeriksaan(data),
        onSuccess: (_, variables) => {
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
 * - Auto-invalidates list and removes from cache
 */
export function useDeletePemeriksaan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => pemeriksaanApiDataSource.deletePemeriksaan(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: queryKeys.pemeriksaan.detail(id) });
            // Invalidate lists
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
