/**
 * usePemeriksaan Hook
 * State and logic for Posyandu Page - search, filter, sort, and pagination
 * Uses React Query for optimal caching
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { kategoriConfig } from "../constants/kategoriConfig";
import type { PesertaListItem } from "../../data/models/PesertaApiTypes";
import { useDebounce } from "./useDebounce";
import type { SortType } from "../components/pemeriksaan";
import type { KategoriKey } from "../../domain/entities/Peserta";
import {
  usePesertaList as usePesertaListQuery,
  queryClient,
  queryKeys,
} from "../../data/queries";

const ITEMS_PER_PAGE = 10;

export function usePemeriksaan() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial states from URL
  const initialQuery = searchParams.get("q") || "";
  const initialFilters =
    (searchParams.get("category")?.split(",") as KategoriKey[]) || [];
  const initialSort = (searchParams.get("sort") as SortType) || "nama-asc";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] =
    useState<KategoriKey[]>(initialFilters);
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Recent Examination Page State
  const initialRecentPage = parseInt(searchParams.get("recent") || "1", 10);
  const [recentPage, setRecentPage] = useState(initialRecentPage);

  // Debounced search query for API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Determine if we should perform a search
  const isSearchActive = debouncedSearchQuery.length >= 1 || selectedFilters.length > 0;

  // Use React Query for fetching peserta list from server
  const { data: apiData, isLoading: isQueryLoading } = usePesertaListQuery({
    search: debouncedSearchQuery || undefined,
    // If backend supports multiple, we'd pass join. For now, backend docs show singular.
    // We'll pass the first one, or undefined if none.
    kategori: selectedFilters.length > 0 ? selectedFilters[0] : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sort_by: selectedSort.startsWith('nama') ? 'nama' : undefined,
    sort_order: selectedSort.endsWith('asc') ? 'asc' : 'desc',
  }, { 
    enabled: isSearchActive // Only fetch when there's a search context
  });

  // Sync states to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) params.set("q", debouncedSearchQuery);
    if (selectedFilters.length > 0)
      params.set("category", selectedFilters.join(","));
    if (selectedSort !== "nama-asc") params.set("sort", selectedSort);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (recentPage > 1) params.set("recent", recentPage.toString());

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearchQuery,
    selectedFilters,
    selectedSort,
    currentPage,
    recentPage,
    setSearchParams,
  ]);

  // Extract results and pagination from API response
  const { searchResults, totalResults, totalPages } = useMemo(() => {
    if (!isSearchActive || !apiData) {
      return { searchResults: [], totalResults: 0, totalPages: 1 };
    }

    const responseData = (apiData as any);
    return {
        searchResults: (responseData?.data || []) as PesertaListItem[],
        totalResults: responseData?.total || 0,
        totalPages: responseData?.last_page || 1
    };
  }, [apiData, isSearchActive]);

  // Refresh function with React Query invalidation
  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.peserta.lists(),
    });
  }, []);

  // Reset page when filters change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filters: KategoriKey[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortType) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  }, []);

  // Pagination handlers
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleGoToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRecentPageChange = useCallback((page: number) => {
    setRecentPage(page);
  }, []);

  // Navigation handlers
  const handleSelectPeserta = useCallback(
    (peserta: PesertaListItem) => {
      const slug = kategoriConfig[peserta.kategori].urlSlug;
      navigate(`/dashboard/examinations/${slug}/${peserta.id}`);
    },
    [navigate]
  );

  return {
    // State
    searchQuery,
    selectedFilters,
    selectedSort,
    currentPage,
    totalPages,
    totalResults,
    searchResults,
    isLoading: isQueryLoading && isSearchActive,

    // Actions
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSelectPeserta,
    // Pagination
    handlePrevPage,
    handleNextPage,
    handleGoToPage,
    recentPage,
    handleRecentPageChange,

    // Config
    kategoriConfig,

    // Refresh
    refresh,
  };
}


export type { KategoriKey };
