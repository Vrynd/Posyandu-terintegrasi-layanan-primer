/**
 * Peserta Query Hooks
 * React Query hooks for peserta data fetching with optimized caching
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { pesertaApiDataSource } from "../datasources/PesertaApiDataSource";
import { queryKeys } from "../core/queryClient";
import type {
  GetPesertaParams,
  CreatePesertaRequest,
  PesertaListResponse,
} from "../models/PesertaApiTypes";

/**
 * Hook untuk fetch list peserta dengan pagination
 * - Supports filtering by kategori, search, etc.
 * - Cached per unique params combination
 */
export function usePesertaList(
  params?: GetPesertaParams,
  options?: Omit<
    UseQueryOptions<PesertaListResponse, Error>,
    "queryKey" | "queryFn"
  >
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
          total: 0,
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
export function usePesertaInfinite(
  params?: Omit<GetPesertaParams, "page" | "limit">
) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.peserta.lists(), "infinite", params],
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
 * Hook untuk fetch lightweight summary list (70% smaller payload)
 * - Perfect for search/autocomplete where full data not needed
 * - Supports ETag caching via queryFn
 */
export function usePesertaSummary(
  params?: import("../models/PesertaApiTypes").GetPesertaSummaryParams
) {
  return useQuery({
    queryKey: [...queryKeys.peserta.lists(), "summary", params],
    queryFn: async () => {
      const result = await pesertaApiDataSource.getSummary(params);
      if (!result.data.data) {
        return { data: [], current_page: 1, last_page: 1, per_page: 50, total: 0 };
      }
      return result.data.data;
    },
    staleTime: 2 * 60 * 1000, // Consider fresh for 2 minutes (ETag handles real freshness)
  });
}

/**
 * Hook untuk bulk delete multiple peserta
 * - Optimistic update: Removes all items immediately
 * - Auto-rollback on error
 */
export function useBulkDeletePeserta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => pesertaApiDataSource.bulkDelete({ ids }),

    // OPTIMISTIC: Remove all items before server response
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.peserta.lists() });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.peserta.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.peserta.lists() },
        (old: PesertaListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((p) => !ids.includes(p.id)),
            total: old.total - ids.length,
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _ids, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
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
 * - Targeted invalidation: Sets created data directly in cache
 * - Invalidates lists and dashboard stats
 */
export function useCreatePeserta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePesertaRequest) =>
      pesertaApiDataSource.createPeserta(data),
    onSuccess: (response) => {
      // If the API returns the created data, pre-populate detail cache
      if (response.data) {
        queryClient.setQueryData(
          queryKeys.peserta.detail(response.data.id),
          response.data
        );
      }
      // Invalidate all peserta lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}


/**
 * Hook untuk update peserta
 * - Targeted invalidation: Sets updated data directly in cache
 * - Invalidates lists to reflect changes
 */
export function useUpdatePeserta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreatePesertaRequest>;
    }) => pesertaApiDataSource.updatePeserta(id, data),
    onSuccess: (response, variables) => {
      // If the API returns the updated data, pre-populate detail cache
      if (response.data) {
        queryClient.setQueryData(
          queryKeys.peserta.detail(variables.id),
          response.data
        );
      } else {
        // Otherwise, just invalidate the detail to refetch
        queryClient.invalidateQueries({
          queryKey: queryKeys.peserta.detail(variables.id),
        });
      }
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
    },
  });
}


/**
 * Hook untuk delete peserta
 * - Optimistic update: UI updates instantly
 * - Auto-rollback on error
 * - Auto-invalidates after settled
 */
export function useDeletePeserta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pesertaApiDataSource.deletePeserta(id),

    // OPTIMISTIC: Update UI before server response
    onMutate: async (id) => {
      // Cancel ongoing refetches to avoid race conditions
      await queryClient.cancelQueries({ queryKey: queryKeys.peserta.lists() });

      // Snapshot ALL current peserta list queries for rollback
      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.peserta.lists(),
      });

      // Optimistically remove from ALL list caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.peserta.lists() },
        (old: PesertaListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((p) => p.id !== id),
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
      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: queryKeys.peserta.all });
      // Invalidate lists to ensure fresh data
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
