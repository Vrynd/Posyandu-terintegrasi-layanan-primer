import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calculateAge, type KategoriKey } from '../../domain/entities/Peserta';
import { kategoriConfig } from '../constants/kategoriConfig';
import type { PesertaListItem, GetPesertaParams } from '../../data/models/PesertaApiTypes';
import { usePesertaList as usePesertaListQuery, usePrefetchPeserta, queryClient, queryKeys } from '../../data/queries';
import { useDashboardStats } from '../../data/queries/useDashboardQuery'; // Import dashboard stats for accurate counts
import { useDebounce } from './useDebounce';

const ITEMS_PER_PAGE = 8;

export type SortType = 'nama-asc' | 'nama-desc' | 'umur-asc' | 'umur-desc' | 'terbaru';
export type GenderFilter = 'all' | 'L' | 'P';
export interface AgeRange {
    min: number | null;
    max: number | null;
}

export const sortOptions: { value: SortType; label: string }[] = [
    { value: 'nama-asc', label: 'Nama A-Z' },
    { value: 'nama-desc', label: 'Nama Z-A' },
    { value: 'umur-asc', label: 'Umur Termuda' },
    { value: 'umur-desc', label: 'Umur Tertua' },
    { value: 'terbaru', label: 'Terbaru' },
];

// Map API response to internal Peserta format
export interface PesertaDisplay extends PesertaListItem {
    kunjunganTerakhir?: string;
    status?: 'sehat' | 'perhatian' | 'risiko';
}

export function usePesertaList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State for filtering/sorting
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedKategori, setSelectedKategori] = useState<KategoriKey | null>(searchParams.get('category') as KategoriKey || null);
    const [selectedSort, setSelectedSort] = useState<SortType>(searchParams.get('sort') as SortType || 'terbaru');
    const [selectedGender, setSelectedGender] = useState<GenderFilter>(searchParams.get('gender') as GenderFilter || 'all');
    
    const initialMinAge = searchParams.get('minAge');
    const initialMaxAge = searchParams.get('maxAge');
    const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange>({ 
        min: initialMinAge ? parseInt(initialMinAge) : null, 
        max: initialMaxAge ? parseInt(initialMaxAge) : null 
    });
    
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [successData, setSuccessData] = useState<{ nama: string; nik: string } | null>(null);

    // Debounce search query for API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    // Prepare API Params
    const apiParams: GetPesertaParams = useMemo(() => {
        const params: GetPesertaParams = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchQuery || undefined,
            kategori: selectedKategori || undefined,
            gender: selectedGender !== 'all' ? selectedGender : undefined,
            min_age: selectedAgeRange.min !== null ? selectedAgeRange.min : undefined,
            max_age: (selectedAgeRange.max !== null && selectedAgeRange.max !== 999) ? selectedAgeRange.max : undefined,
        };

        // Map sorting
        switch (selectedSort) {
            case 'nama-asc':
                params.sort_by = 'nama';
                params.sort_order = 'asc';
                break;
            case 'nama-desc':
                params.sort_by = 'nama';
                params.sort_order = 'desc';
                break;
            case 'umur-asc':
                params.sort_by = 'tanggal_lahir';
                params.sort_order = 'desc'; // Oldest birth date = oldest age, so ascending age = descending birth date? 
                                            // Wait, Ascending age = 1, 2, 3 -> Birth dates: 2023, 2022, 2021. So descending.
                break;
            case 'umur-desc':
                params.sort_by = 'tanggal_lahir';
                params.sort_order = 'asc';
                break;
            case 'terbaru':
                params.sort_by = 'created_at';
                params.sort_order = 'desc';
                break;
        }

        return params;
    }, [currentPage, debouncedSearchQuery, selectedKategori, selectedGender, selectedAgeRange, selectedSort]);

    // Use React Query for fetching peserta list from server
    const { data: apiData, isLoading, error: queryError } = usePesertaListQuery(apiParams);

    // Fetch dashboard stats for accurate category counts
    const { data: dashboardStats } = useDashboardStats();
    
    // Extract list and pagination from API response
    const { pesertaList, totalDataCount, totalPages } = useMemo(() => {
        const responseData = (apiData as any);
        return {
            pesertaList: (responseData?.data || []) as PesertaDisplay[],
            totalDataCount: responseData?.total || 0,
            totalPages: responseData?.last_page || 1
        };
    }, [apiData]);

    // Sync states to URL
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
        if (selectedKategori) params.set('category', selectedKategori);
        if (selectedSort !== 'terbaru') params.set('sort', selectedSort);
        if (selectedGender !== 'all') params.set('gender', selectedGender);
        if (selectedAgeRange.min !== null) params.set('minAge', selectedAgeRange.min.toString());
        if (selectedAgeRange.max !== null) params.set('maxAge', selectedAgeRange.max.toString());
        if (currentPage > 1) params.set('page', currentPage.toString());

        // Preserve success data if any
        const success = searchParams.get('success');
        const nama = searchParams.get('nama');
        const nik = searchParams.get('nik');
        if (success) params.set('success', success);
        if (nama) params.set('nama', nama);
        if (nik) params.set('nik', nik);

        setSearchParams(params, { replace: true });
    }, [debouncedSearchQuery, selectedKategori, selectedSort, selectedGender, selectedAgeRange, currentPage, setSearchParams]);

    // Banner logic
    useEffect(() => {
        const success = searchParams.get('success');
        const nama = searchParams.get('nama');
        const nik = searchParams.get('nik');
        
        if (success === '1' && nama && nik) {
            setSuccessData({ nama, nik });
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('success');
            newParams.delete('nama');
            newParams.delete('nik');
            setSearchParams(newParams, { replace: true });
        }
    }, []);

    // Get counts from dashboard stats (fallback to 0)
    const kategoryCounts = useMemo(() => {
        if (!dashboardStats?.kategori) {
            return Object.keys(kategoriConfig).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        }
        return dashboardStats.kategori;
    }, [dashboardStats]);

    // Actions
    const handleFilterChange = useCallback((kategori: KategoriKey | null) => {
        setSelectedKategori(kategori);
        setCurrentPage(1);
    }, []);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    const handleSortChange = useCallback((sort: SortType) => {
        setSelectedSort(sort);
        setCurrentPage(1);
    }, []);

    const handleGenderChange = useCallback((gender: GenderFilter) => {
        setSelectedGender(gender);
        setCurrentPage(1);
    }, []);

    const handleAgeRangeChange = useCallback((ageRange: AgeRange) => {
        setSelectedAgeRange(ageRange);
        setCurrentPage(1);
    }, []);

    const handleNavigateToDetail = useCallback((id: string | number, category: KategoriKey) => {
        const slug = kategoriConfig[category].urlSlug;
        navigate(`/dashboard/participants/${slug}/${id}`, { state: { search: searchParams.toString() } });
    }, [navigate, searchParams]);

    const handleAddPeserta = useCallback(() => {
        navigate('/dashboard/participants/register');
    }, [navigate]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage(p => Math.max(1, p - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(p => Math.min(totalPages, p + 1));
    }, [totalPages]);

    const handleGoToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleDismissSuccess = useCallback(() => {
        setSuccessData(null);
    }, []);

    // Refresh with React Query invalidation
    const refresh = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.peserta.lists() });
    }, []);

    // Prefetch peserta detail on hover
    const prefetchPeserta = usePrefetchPeserta();
    const handleHoverPeserta = useCallback((id: number) => {
        prefetchPeserta(id);
    }, [prefetchPeserta]);

    return {
        // Data
        paginatedPeserta: pesertaList, // Now just the data from API
        filteredPeserta: pesertaList, // Same as paginated in server-side mode
        kategoryCounts,
        isLoading,
        error: queryError?.message || null,
        totalDataCount,
        successData,

        // State
        searchQuery,
        selectedKategori,
        selectedSort,
        selectedGender,
        selectedAgeRange,
        currentPage,
        totalPages,
        itemsPerPage: ITEMS_PER_PAGE,

        // Actions
        handleSearchChange,
        handleFilterChange,
        handleSortChange,
        handleGenderChange,
        handleAgeRangeChange,
        handleNavigateToDetail,
        handleAddPeserta,
        handlePrevPage,
        handleNextPage,
        handleGoToPage,
        handleDismissSuccess,
        handleHoverPeserta,
        refresh,

        // Helpers
        calculateAge,
        kategoriConfig,
        sortOptions,
    };
}

