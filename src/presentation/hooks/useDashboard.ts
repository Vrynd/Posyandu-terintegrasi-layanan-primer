/**
 * useDashboard Hook
 * State and logic for Dashboard page
 * Uses React Query for optimal caching
 */

import { useCallback } from 'react';
import { useDashboardStats, useDashboardChart, useDashboardRegistrations, queryClient, queryKeys } from '../../data/queries';
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

    const {
        data: registrationsData,
        isLoading: isRegistrationsLoading,
        error: registrationsError
    } = useDashboardRegistrations();

    // Refresh function for force reload
    const refresh = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.chart() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.registrationChart() }),
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
        registrationsChartData: registrationsData || [],
        isLoading: isStatsLoading || isChartLoading || isRegistrationsLoading,
        error: statsError?.message || chartError?.message || registrationsError?.message || null,
        refresh
    };
}
