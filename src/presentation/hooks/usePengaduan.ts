/**
 * usePengaduan Hook
 * Business logic for pengaduan feature with role-based behavior
 * Uses UseCases for clean architecture adherence
 */

import { useState, useEffect, useCallback } from 'react';
import type {
    Pengaduan,
    PengaduanDetail,
    PengaduanStats,
    CreatePengaduanParams,
    PengaduanFilterParams,
    PengaduanStatus,
} from '../../domain/entities/Pengaduan';

// Import UseCases
import { getPengaduanListUseCase } from '../../domain/usecases/pengaduan/GetPengaduanListUseCase';
import { getPengaduanDetailUseCase } from '../../domain/usecases/pengaduan/GetPengaduanDetailUseCase';
import { getPengaduanStatsUseCase } from '../../domain/usecases/pengaduan/GetPengaduanStatsUseCase';
import { createPengaduanUseCase } from '../../domain/usecases/pengaduan/CreatePengaduanUseCase';
import { updatePengaduanStatusUseCase } from '../../domain/usecases/pengaduan/UpdatePengaduanStatusUseCase';
import { addPengaduanResponseUseCase } from '../../domain/usecases/pengaduan/AddPengaduanResponseUseCase';
import { deletePengaduanUseCase } from '../../domain/usecases/pengaduan/DeletePengaduanUseCase';

interface UsePengaduanReturn {
    // Data
    pengaduanList: Pengaduan[];
    selectedPengaduan: PengaduanDetail | null;
    stats: PengaduanStats | null;
    
    // Pagination
    currentPage: number;
    lastPage: number;
    total: number;
    
    // State
    isLoading: boolean;
    isLoadingDetail: boolean;
    isSubmitting: boolean;
    error: string | null;
    
    // Filters
    filters: PengaduanFilterParams;
    setFilters: (filters: PengaduanFilterParams) => void;
    
    // Actions
    fetchList: () => Promise<void>;
    fetchDetail: (id: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    createPengaduan: (params: CreatePengaduanParams) => Promise<boolean>;
    updateStatus: (id: number, status: PengaduanStatus) => Promise<boolean>;
    addResponse: (pengaduanId: number, response: string) => Promise<boolean>;
    deletePengaduan: (id: number) => Promise<boolean>;
    clearSelectedPengaduan: () => void;
}

export function usePengaduan(): UsePengaduanReturn {
    // Data state
    const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);
    const [selectedPengaduan, setSelectedPengaduan] = useState<PengaduanDetail | null>(null);
    const [stats, setStats] = useState<PengaduanStats | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filter state
    const [filters, setFilters] = useState<PengaduanFilterParams>({
        page: 1,
        per_page: 10,
    });

    /**
     * Fetch list of pengaduan
     */
    const fetchList = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getPengaduanListUseCase.execute(filters);
            setPengaduanList(result.data);
            setCurrentPage(result.current_page);
            setLastPage(result.last_page);
            setTotal(result.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    /**
     * Fetch pengaduan detail
     */
    const fetchDetail = useCallback(async (id: number) => {
        setIsLoadingDetail(true);
        setError(null);
        try {
            const detail = await getPengaduanDetailUseCase.execute(id);
            setSelectedPengaduan(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat detail');
        } finally {
            setIsLoadingDetail(false);
        }
    }, []);

    /**
     * Fetch statistics
     */
    const fetchStats = useCallback(async () => {
        try {
            const result = await getPengaduanStatsUseCase.execute();
            setStats(result);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);


    /**
     * Create new pengaduan (Kader only)
     */
    const createPengaduan = useCallback(async (params: CreatePengaduanParams): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createPengaduanUseCase.execute(params);
            await fetchList(); // Refresh the list
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengirim pengaduan');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchList]);

    /**
     * Update status (Admin only)
     */
    const updateStatus = useCallback(async (id: number, status: PengaduanStatus): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updatePengaduanStatusUseCase.execute(id, status);
            
            // Update local state for optimization
            setPengaduanList(prev => 
                prev.map(p => p.id === id ? { ...p, status } : p)
            );
            if (selectedPengaduan?.id === id) {
                setSelectedPengaduan(prev => prev ? { ...prev, status } : null);
            }
            
            // Refresh stats and detail
            await fetchStats();
            await fetchDetail(id);
            
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengubah status');
            console.error('Update status error:', err);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedPengaduan?.id, fetchStats, fetchDetail]);

    /**
     * Add response (Admin only)
     */
    const addResponse = useCallback(async (pengaduanId: number, response: string): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await addPengaduanResponseUseCase.execute({
                pengaduan_id: pengaduanId,
                response,
            });
            // Refresh detail to show new response
            await fetchDetail(pengaduanId);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengirim respon');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchDetail]);

    /**
     * Delete pengaduan
     */
    const deletePengaduan = useCallback(async (id: number): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await deletePengaduanUseCase.execute(id);
            setPengaduanList(prev => prev.filter(p => p.id !== id));
            if (selectedPengaduan?.id === id) {
                setSelectedPengaduan(null);
            }
            await fetchStats();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menghapus pengaduan');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedPengaduan?.id, fetchStats]);

    /**
     * Clear selected pengaduan
     */
    const clearSelectedPengaduan = useCallback(() => {
        setSelectedPengaduan(null);
    }, []);

    // Load initial data when filters change
    useEffect(() => {
        fetchList();
    }, [fetchList]);

    return {
        // Data
        pengaduanList,
        selectedPengaduan,
        stats,
        
        // Pagination
        currentPage,
        lastPage,
        total,
        
        // State
        isLoading,
        isLoadingDetail,
        isSubmitting,
        error,
        
        // Filters
        filters,
        setFilters,
        
        // Actions
        fetchList,
        fetchDetail,
        fetchStats,
        createPengaduan,
        updateStatus,
        addResponse,
        deletePengaduan,
        clearSelectedPengaduan,
    };
}
