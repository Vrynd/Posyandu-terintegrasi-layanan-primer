/**
 * Dashboard Query Hooks
 * React Query hooks for dashboard data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApiDataSource } from '../datasources/DashboardApiDataSource';
import { queryKeys } from '../core/queryClient';

/**
 * Hook untuk fetch statistik dashboard
 * - Stale time: 5 menit (default)
 * - Auto-caches dan deduplicates requests
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: async () => {
            const response = await dashboardApiDataSource.getStats();
            return response.data;
        },
    });
}

/**
 * Hook untuk fetch data chart dashboard
 * @param year - Tahun untuk data chart (optional)
 */
export function useDashboardChart(year?: number) {
    return useQuery({
        queryKey: queryKeys.dashboard.chart(year),
        queryFn: async () => {
            const response = await dashboardApiDataSource.getChartData(year);
            return response.data;
        },
    });
}
