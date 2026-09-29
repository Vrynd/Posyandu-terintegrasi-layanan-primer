/**
 * Jenis-jenis laporan yang tersedia.
 */
export type ReportType =
    'examination' | 'target' | 'risk' | 'attendance' | 'sip';

/**
 * State filter untuk halaman Laporan Posyandu.
 */
export interface ReportFilterState {
    month: string;
    year: string;
    category: string;
}
