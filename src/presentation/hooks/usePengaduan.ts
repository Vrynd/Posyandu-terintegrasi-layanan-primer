/**
 * usePengaduan Hook
 * Business logic for pengaduan feature with role-based behavior
 */

import { useState, useEffect, useCallback } from 'react';
import { pengaduanApiDataSource } from '../../data/datasources/PengaduanApiDataSource';
import { useAuth } from './useAuth';
import type {
    Pengaduan,
    PengaduanDetail,
    PengaduanStats,
    PengaduanNotification,
    CreatePengaduanParams,
    PengaduanFilterParams,
    PengaduanStatus,
} from '../../domain/entities/Pengaduan';

interface UsePengaduanReturn {
    // Data
    pengaduanList: Pengaduan[];
    selectedPengaduan: PengaduanDetail | null;
    stats: PengaduanStats | null;
    notification: PengaduanNotification | null;
    
    // Pagination
    currentPage: number;
    lastPage: number;
    total: number;
    
    // State
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    
    // Filters
    filters: PengaduanFilterParams;
    setFilters: (filters: PengaduanFilterParams) => void;
    
    // Actions
    fetchList: () => Promise<void>;
    fetchDetail: (id: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
    createPengaduan: (params: CreatePengaduanParams) => Promise<boolean>;
    updateStatus: (id: number, status: PengaduanStatus) => Promise<boolean>;
    addResponse: (pengaduanId: number, response: string) => Promise<boolean>;
    deletePengaduan: (id: number) => Promise<boolean>;
    clearSelectedPengaduan: () => void;
    dismissNotification: () => void;
}

export function usePengaduan(): UsePengaduanReturn {
    const { user } = useAuth();
    
    // Data state
    const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);
    const [selectedPengaduan, setSelectedPengaduan] = useState<PengaduanDetail | null>(null);
    const [stats, setStats] = useState<PengaduanStats | null>(null);
    const [notification, setNotification] = useState<PengaduanNotification | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await pengaduanApiDataSource.getList(filters);
            if (response.success) {
                setPengaduanList(response.data.data);
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
                setTotal(response.data.total);
            }
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
        setIsLoading(true);
        setError(null);
        try {
            const response = await pengaduanApiDataSource.getDetail(id);
            if (response.success) {
                setSelectedPengaduan(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat detail');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fetch statistics (Admin only)
     */
    const fetchStats = useCallback(async () => {
        if (user?.role !== 'admin') return;
        
        try {
            const response = await pengaduanApiDataSource.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, [user?.role]);

    /**
     * Fetch notifications for banner
     */
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        
        try {
            const response = await pengaduanApiDataSource.getNotifications(
                user.role,
                user.id
            );
            if (response.success) {
                setNotification(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [user]);

    /**
     * Create new pengaduan (Kader only)
     */
    const createPengaduan = useCallback(async (params: CreatePengaduanParams): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await pengaduanApiDataSource.create(params);
            if (response.success) {
                await fetchList(); // Refresh the list
                return true;
            }
            return false;
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
            const response = await pengaduanApiDataSource.updateStatus(id, status);
            if (response.success) {
                // Update in list
                setPengaduanList(prev => 
                    prev.map(p => p.id === id ? { ...p, status } : p)
                );
                // Update selected if viewing detail
                if (selectedPengaduan?.id === id) {
                    setSelectedPengaduan(prev => prev ? { ...prev, status } : null);
                }
                await fetchStats(); // Refresh stats
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengubah status');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedPengaduan?.id, fetchStats]);

    /**
     * Add response (Admin only)
     */
    const addResponse = useCallback(async (pengaduanId: number, response: string): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await pengaduanApiDataSource.addResponse({
                pengaduan_id: pengaduanId,
                response,
            });
            if (result.success) {
                // Refresh detail to show new response
                await fetchDetail(pengaduanId);
                return true;
            }
            return false;
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
            const response = await pengaduanApiDataSource.delete(id);
            if (response.success) {
                setPengaduanList(prev => prev.filter(p => p.id !== id));
                if (selectedPengaduan?.id === id) {
                    setSelectedPengaduan(null);
                }
                await fetchStats();
                return true;
            }
            return false;
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

    /**
     * Dismiss notification banner
     */
    const dismissNotification = useCallback(() => {
        setNotification(null);
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
        notification,
        
        // Pagination
        currentPage,
        lastPage,
        total,
        
        // State
        isLoading,
        isSubmitting,
        error,
        
        // Filters
        filters,
        setFilters,
        
        // Actions
        fetchList,
        fetchDetail,
        fetchStats,
        fetchNotifications,
        createPengaduan,
        updateStatus,
        addResponse,
        deletePengaduan,
        clearSelectedPengaduan,
        dismissNotification,
    };
}
