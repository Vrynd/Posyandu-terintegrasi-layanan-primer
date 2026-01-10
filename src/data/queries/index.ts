/**
 * Query Hooks Index
 * Central export for all React Query hooks
 */

// Query Client & Keys
export { queryClient, queryKeys } from '../core/queryClient';

// Dashboard Queries
export { useDashboardStats, useDashboardChart, useDashboardRegistrations } from './useDashboardQuery';

export {
    usePesertaList,
    usePesertaInfinite,
    usePesertaDetail,
    useCreatePeserta,
    useUpdatePeserta,
    useDeletePeserta,
    usePrefetchPeserta,
    useLatestVisit,
} from './usePesertaQuery';

// Pemeriksaan/Kunjungan Queries
export {
    usePemeriksaanList,
    usePemeriksaanDetail,
    useCreatePemeriksaan,
    useDeletePemeriksaan,
    // Backward compatibility aliases
    useKunjunganList,
    useKunjunganDetail,
    useCreateKunjungan,
    useDeleteKunjungan,
} from './usePemeriksaanQuery';

// Pengaduan Queries
export {
    usePengaduanList,
    usePengaduanDetail,
    usePengaduanStats,
    useCreatePengaduan,
    useUpdatePengaduanStatus,
    useAddPengaduanResponse,
    useDeletePengaduan,
} from './usePengaduanQuery';
