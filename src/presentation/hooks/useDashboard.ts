/**
 * useDashboard Hook
 * State and logic for Dashboard page
 * Uses React Query for optimal caching
 */

import { useCallback } from 'react';
import { useDashboardStats, useDashboardChart, queryClient, queryKeys } from '../../data/queries';
import type { DashboardStats } from '../../data/models/DashboardApiTypes';

export function useDashboard() {
    // Use React Query hooks for stats and chart
    const { 
        data: statsData, 
        isLoading: isStatsLoading, 
        error: statsError 
    } = useDashboardStats();
    
    const { 
        data: chartData, 
        isLoading: isChartLoading, 
        error: chartError 
    } = useDashboardChart();

    // Refresh function for force reload
    const refresh = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.chart() }),
        ]);
    }, []);

    // Format stats to match expected structure
    const stats: DashboardStats | null = statsData ? {
        total_peserta: statsData.total_peserta,
        kunjungan_hari_ini: statsData.kunjungan_hari_ini,
        kategori: statsData.kategori
    } : null;

    return {
        stats,
        chartData: chartData || [],
        isLoading: isStatsLoading || isChartLoading,
        error: statsError?.message || chartError?.message || null,
        refresh
    };
}
