/**
 * usePemeriksaan Hook
 * State and logic for Posyandu Page - search, filter, sort, and pagination
 * Uses React Query for optimal caching
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kategoriConfig } from '../constants/kategoriConfig';
import type { PesertaListItem } from '../../data/models/PesertaApiTypes';
import { useDebounce } from './useDebounce';
import type { SortType } from '../components/pemeriksaan';
import type { KategoriKey } from '../../domain/entities/Peserta';
import { usePesertaList as usePesertaListQuery, queryClient, queryKeys } from '../../data/queries';

const ITEMS_PER_PAGE = 10;

export function usePemeriksaan() {
    const navigate = useNavigate();
    
    // State
    const [pesertaList, setPesertaList] = useState<PesertaListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<KategoriKey[]>([]);
    const [selectedSort, setSelectedSort] = useState<SortType>('nama-asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Use React Query for fetching peserta list
    const { data: apiData, isLoading: isQueryLoading } = usePesertaListQuery({ limit: 100 });

    // Extract cached peserta from query data
    const cachedPeserta: PesertaListItem[] = useMemo(() => {
        if (!apiData) return [];
        return apiData.data || [];
    }, [apiData]);

    // Filter peserta based on search query and filters
    useEffect(() => {
        const shouldSearch = debouncedSearchQuery.length >= 1 || selectedFilters.length > 0;
        
        if (!shouldSearch) {
            // Clear results when no search/filter active
            setPesertaList([]);
            return;
        }

        // Filter from cached data (powered by React Query cache)
        const filtered = cachedPeserta.filter(p => {
            // Match search query
            const matchSearch = debouncedSearchQuery.length < 1 ||
                p.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                p.nik.includes(debouncedSearchQuery);
            
            // Match category filter
            const matchKategori = selectedFilters.length === 0 ||
                selectedFilters.includes(p.kategori);
            
            return matchSearch && matchKategori;
        });
        
        setPesertaList(filtered);
    }, [debouncedSearchQuery, selectedFilters, cachedPeserta]);

    // Refresh function with React Query invalidation
    const refresh = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
    }, []);

    const { paginatedResults, totalResults, totalPages } = useMemo(() => {
        let results = [...pesertaList];

        // Client-side filtering for multiple category selection
        if (selectedFilters.length > 1) {
            results = results.filter(p => selectedFilters.includes(p.kategori));
        }

        // Sort results
        results.sort((a, b) => {
            switch (selectedSort) {
                case 'nama-asc':
                    return a.nama.localeCompare(b.nama, 'id');
                case 'nama-desc':
                    return b.nama.localeCompare(a.nama, 'id');
                case 'kunjungan-desc':
                case 'kunjungan-asc':
                    // Sort by tanggal_lahir as fallback since we don't have kunjunganTerakhir
                    return a.nama.localeCompare(b.nama, 'id');
                default:
                    return 0;
            }
        });

        const totalResults = results.length;
        const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

        // Paginate results
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return { paginatedResults, totalResults, totalPages };
    }, [pesertaList, debouncedSearchQuery, selectedFilters, selectedSort, currentPage]);

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
        setCurrentPage(prev => Math.max(1, prev - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    }, [totalPages]);

    const handleGoToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Navigation handlers
    const handleSelectPeserta = useCallback((peserta: PesertaListItem) => {
        const slug = kategoriConfig[peserta.kategori].urlSlug;
        navigate(`/dashboard/examinations/${slug}/${peserta.id}`);
    }, [navigate]);

    // Determine loading state (only loading when query active)
    const isLoading = isQueryLoading && (debouncedSearchQuery.length >= 1 || selectedFilters.length > 0);

    return {
        // State
        searchQuery,
        selectedFilters,
        selectedSort,
        currentPage,
        totalPages,
        totalResults,
        searchResults: paginatedResults,
        isLoading,

        // Actions
        handleSearchChange,
        handleFilterChange,
        handleSortChange,
        handleSelectPeserta,
        // Pagination
        handlePrevPage,
        handleNextPage,
        handleGoToPage,

        // Config
        kategoriConfig,

        // Refresh
        refresh,
    };
}

export type { KategoriKey };
