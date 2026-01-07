/**
 * Pengaduan Query Hooks
 * React Query hooks for complaint/pengaduan data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pengaduanApiDataSource } from '../datasources/PengaduanApiDataSource';
import { queryKeys } from '../core/queryClient';
import type { 
    PengaduanFilterParams, 
    CreatePengaduanParams, 
    CreateResponseParams,
    PengaduanStatus 
} from '../../domain/entities/Pengaduan';

/**
 * Hook untuk fetch list pengaduan dengan pagination
 * - Role-based: Admin sees all, Kader sees own
 * - Supports filtering by status, kategori, search
 * - Shorter stale time (30 seconds) for more real-time updates
 */
export function usePengaduanList(params?: PengaduanFilterParams) {
    return useQuery({
        queryKey: queryKeys.pengaduan.list(params),
        queryFn: async () => {
            const response = await pengaduanApiDataSource.getList(params);
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds - more frequent updates for pengaduan
    });
}

/**
 * Hook untuk fetch detail pengaduan dengan responses
 */
export function usePengaduanDetail(id: number) {
    return useQuery({
        queryKey: queryKeys.pengaduan.detail(id),
        queryFn: async () => {
            const response = await pengaduanApiDataSource.getDetail(id);
            return response.data;
        },
        enabled: id > 0,
    });
}

/**
 * Hook untuk fetch statistik pengaduan (Admin only)
 */
export function usePengaduanStats() {
    return useQuery({
        queryKey: queryKeys.pengaduan.stats(),
        queryFn: async () => {
            const response = await pengaduanApiDataSource.getStats();
            return response.data;
        },
    });
}

/**
 * Hook untuk create pengaduan baru
 * - Auto-invalidates list cache
 */
export function useCreatePengaduan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePengaduanParams) => pengaduanApiDataSource.create(data),
        onSuccess: () => {
            // Invalidate pengaduan lists
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.lists() });
            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.stats() });
        },
    });
}

/**
 * Hook untuk update status pengaduan (Admin only)
 * - Auto-invalidates detail and list
 */
export function useUpdatePengaduanStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: PengaduanStatus }) =>
            pengaduanApiDataSource.updateStatus(id, status),
        onSuccess: (_, variables) => {
            // Invalidate specific detail
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.detail(variables.id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.lists() });
            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.stats() });
        },
    });
}

/**
 * Hook untuk add response to pengaduan (Admin only)
 * - Auto-invalidates detail
 */
export function useAddPengaduanResponse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateResponseParams) => pengaduanApiDataSource.addResponse(data),
        onSuccess: (_, variables) => {
            // Invalidate specific detail to show new response
            queryClient.invalidateQueries({ 
                queryKey: queryKeys.pengaduan.detail(variables.pengaduan_id) 
            });
        },
    });
}

/**
 * Hook untuk delete pengaduan
 * - Auto-invalidates list and removes from cache
 */
export function useDeletePengaduan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => pengaduanApiDataSource.delete(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: queryKeys.pengaduan.detail(id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.lists() });
            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: queryKeys.pengaduan.stats() });
        },
    });
}
