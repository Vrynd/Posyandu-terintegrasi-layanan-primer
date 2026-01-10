/**
 * React Query Configuration
 * Centralized query client setup with optimized defaults
 */

import { QueryClient } from '@tanstack/react-query';

// Create query client with optimized defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data dianggap fresh selama 5 menit
            staleTime: 5 * 60 * 1000,
            // Cache dihapus setelah 10 menit tidak dipakai
            gcTime: 10 * 60 * 1000,
            // Retry 2x pada error dengan exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Jangan refetch otomatis saat focus window
            refetchOnWindowFocus: false,
            // Jangan refetch saat reconnect
            refetchOnReconnect: false,
        },
        mutations: {
            // Retry 1x untuk mutations
            retry: 1,
        },
    },
});

// ============================================
// Query Keys Factory
// Struktur konsisten untuk semua query keys
// ============================================

export const queryKeys = {
    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
        chart: (year?: number) => [...queryKeys.dashboard.all, 'chart', { year }] as const,
        registrationChart: (year?: number) => [...queryKeys.dashboard.all, 'registrations-chart', { year }] as const,
    },

    // Peserta
    peserta: {
        all: ['peserta'] as const,
        lists: () => [...queryKeys.peserta.all, 'list'] as const,
        list: (params?: object) => [...queryKeys.peserta.lists(), params] as const,
        details: () => [...queryKeys.peserta.all, 'detail'] as const,
        detail: (id: number) => [...queryKeys.peserta.details(), id] as const,
        latestVisit: (id: number) => [...queryKeys.peserta.all, 'latest-visit', id] as const,
    },

    // Pemeriksaan / Kunjungan
    pemeriksaan: {
        all: ['pemeriksaan'] as const,
        lists: () => [...queryKeys.pemeriksaan.all, 'list'] as const,
        list: (params?: object) => [...queryKeys.pemeriksaan.lists(), params] as const,
        details: () => [...queryKeys.pemeriksaan.all, 'detail'] as const,
        detail: (id: number | string) => [...queryKeys.pemeriksaan.details(), id] as const,
    },

    // Pengaduan
    pengaduan: {
        all: ['pengaduan'] as const,
        lists: () => [...queryKeys.pengaduan.all, 'list'] as const,
        list: (params?: object) => [...queryKeys.pengaduan.lists(), params] as const,
        details: () => [...queryKeys.pengaduan.all, 'detail'] as const,
        detail: (id: number) => [...queryKeys.pengaduan.details(), id] as const,
        stats: () => [...queryKeys.pengaduan.all, 'stats'] as const,
    },

    // Auth / Profile
    auth: {
        all: ['auth'] as const,
        profile: () => [...queryKeys.auth.all, 'profile'] as const,
    },
};
