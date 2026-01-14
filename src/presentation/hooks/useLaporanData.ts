/**
 * useLaporanData Hook
 * Fetches data for reports and generates Excel files
 * Stub implementation - Supabase removed, ready for Laravel API integration
 */

import { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { usePesertaList, usePemeriksaanList } from '../../data/queries';
import type { PesertaListItem } from '../../data/models/PesertaApiTypes';
import type { PemeriksaanListItem } from '../../data/models/PemeriksaanApiTypes';

export type ReportType = 'examinations' | 'participants' | 'activities';

interface LaporanStats {
    kunjunganPerBulan: { bulan: string; posyandu: number; rumah: number }[];
    pesertaPerKategori: { kategori: string; jumlah: number }[];
    kegiatanPerJenis: { jenis: string; jumlah: number }[];
    totalKunjungan: number;
    totalPeserta: number;
    totalKegiatan: number;
}

export function useLaporanData() {
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<LaporanStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Get data using React Query hooks
    const { 
        data: pesertaDataResponse, 
        isLoading: isPesertaLoading 
    } = usePesertaList({ limit: 200 });
    
    const { 
        data: pemeriksaanDataResponse, 
        isLoading: isPemeriksaanLoading 
    } = usePemeriksaanList({ limit: 200 });

    const pesertaList = useMemo(() => {
        // usePesertaList returns ApiResponse<PesertaListResponse>
        const apiData = (pesertaDataResponse as any)?.data;
        if (!apiData) return [];
        
        // If data is directly the array
        if (Array.isArray(apiData)) return apiData;
        
        // If data is PesertaListResponse which has its own data property
        return apiData.data || [];
    }, [pesertaDataResponse]);

    const kunjunganList = useMemo(() => {
        // usePemeriksaanList returns ApiResponse<PemeriksaanListResponse>
        const apiData = (pemeriksaanDataResponse as any)?.data;
        if (!apiData) return [];
        
        // If data is directly the array
        if (Array.isArray(apiData)) return apiData;
        
        // If data is PemeriksaanListResponse which has its own data property
        return apiData.data || [];
    }, [pemeriksaanDataResponse]);

    // Combined loading state
    const isDataLoading = isPesertaLoading || isPemeriksaanLoading;

    // Fetch stats for visualizations - uses query data
    const fetchStats = useCallback(async (_month: number, _year: number) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with Laravel API call
            console.warn('[Laporan] Using cached data only - backend not connected');

            // Use cached data
            const pesertaData = pesertaList;
            const kunjunganData = kunjunganList;

            // Process peserta per kategori
            const kategoriCounts: Record<string, number> = {};
            pesertaData.forEach((p: PesertaListItem) => {
                kategoriCounts[p.kategori] = (kategoriCounts[p.kategori] || 0) + 1;
            });

            const pesertaPerKategori = Object.entries(kategoriCounts).map(([kategori, jumlah]) => ({
                kategori: getKategoriLabel(kategori),
                jumlah
            }));

            // Process kunjungan per lokasi
            const posyanduCount = kunjunganData.filter((k: PemeriksaanListItem) => k.lokasi === 'posyandu').length;
            const rumahCount = kunjunganData.filter((k: PemeriksaanListItem) => k.lokasi === 'kunjungan_rumah' || k.lokasi === 'rumah').length;

            const newStats = {
                kunjunganPerBulan: [{
                    bulan: 'Des',
                    posyandu: posyanduCount,
                    rumah: rumahCount
                }],
                pesertaPerKategori,
                kegiatanPerJenis: [], // No activity data without backend
                totalKunjungan: kunjunganData.length,
                totalPeserta: pesertaData.length,
                totalKegiatan: 0
            };

            setStats(newStats);

        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Gagal memuat data statistik');
        } finally {
            setIsLoading(false);
        }
    }, [pesertaList, kunjunganList]);

    // Generate and download Excel report - uses cache only
    const generateReport = useCallback(async (type: ReportType, month: number, year: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

            let workbook: XLSX.WorkBook;
            let filename: string;

            if (type === 'examinations') {
                const data = kunjunganList;

                const rows = data.map((k: PemeriksaanListItem, index: number) => {
                    // Lookup peserta from cache if fields are missing
                    const pesertaInfo = pesertaList.find((p: PesertaListItem) => p.id === k.peserta_id);
                    
                    return {
                        'No': index + 1,
                        'Tanggal': k.tanggal_kunjungan ? new Date(k.tanggal_kunjungan).toLocaleDateString('id-ID') : '-',
                        'Nama Peserta': k.peserta_nama || (k as any).peserta?.nama || pesertaInfo?.nama || '-',
                        'NIK': (k as any).peserta_nik || (k as any).peserta?.nik || pesertaInfo?.nik || '-',
                        'Kategori': getKategoriLabel(k.peserta_kategori || (k as any).peserta?.kategori || pesertaInfo?.kategori || ''),
                        'Lokasi': k.lokasi === 'posyandu' ? 'Posyandu' : 'Kunjungan Rumah',
                        'Rujuk': k.rujuk ? 'Ya' : 'Tidak'
                    };
                });

                workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(rows);

                worksheet['!cols'] = [
                    { width: 5 }, { width: 15 }, { width: 25 }, { width: 20 },
                    { width: 15 }, { width: 18 }, { width: 30 }
                ];

                XLSX.utils.book_append_sheet(workbook, worksheet, 'Pemeriksaan');
                filename = `Laporan_Pemeriksaan_${monthNames[month - 1]}_${year}.xlsx`;

            } else if (type === 'participants') {
                const data = pesertaList;

                const rows = data.map((p: PesertaListItem, index: number) => ({
                    'No': index + 1,
                    'Nama': p.nama,
                    'NIK': p.nik,
                    'Kategori': getKategoriLabel(p.kategori),
                    'Jenis Kelamin': p.jenis_kelamin,
                    'Tanggal Lahir': p.tanggal_lahir ? new Date(p.tanggal_lahir).toLocaleDateString('id-ID') : '-',
                    'Telepon': (p as any).telepon || '-',
                    'Alamat': (p as any).alamat || '-',
                    'RT/RW': `${p.rt || '-'}/${p.rw || '-'}`,
                    'BPJS': ((p as any).kepesertaan_bpjs ?? (p as any).kepesertaanBpjs) ? 'Ya' : 'Tidak',
                    'No. BPJS': (p as any).nomor_bpjs || (p as any).nomorBpjs || '-'
                }));

                workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(rows);

                worksheet['!cols'] = [
                    { width: 5 }, { width: 25 }, { width: 20 }, { width: 12 },
                    { width: 15 }, { width: 15 }, { width: 15 }, { width: 30 },
                    { width: 10 }, { width: 8 }, { width: 15 }
                ];

                XLSX.utils.book_append_sheet(workbook, worksheet, 'Peserta');
                filename = `Laporan_Peserta_${monthNames[month - 1]}_${year}.xlsx`;

            } else {
                // Activities - no data without backend
                console.warn('[Laporan] Activities report requires backend');
                setError('Laporan kegiatan tidak tersedia tanpa backend');
                return { success: false, error: 'Backend tidak terhubung' };
            }

            // Download the file
            XLSX.writeFile(workbook, filename);

            return { success: true, filename };

        } catch (err) {
            console.error('Error generating report:', err);
            setError('Gagal membuat laporan');
            return { success: false, error: 'Gagal membuat laporan' };
        } finally {
            setIsLoading(false);
        }
    }, [pesertaList, kunjunganList]);

    // Get preview data for display - uses cache only
    const getPreviewData = useCallback(async (type: ReportType) => {
        try {
            if (type === 'examinations') {
                const data = kunjunganList;
                if (data.length === 0) {
                    console.log('[Laporan] Kunjungan cache is empty.');
                    return [];
                }

                return data.map((k: PemeriksaanListItem, index: number) => {
                    // Lookup peserta from cache if fields are missing
                    const pesertaInfo = pesertaList.find((p: PesertaListItem) => p.id === k.peserta_id);

                    return {
                        'No': index + 1,
                        'Tanggal': k.tanggal_kunjungan ? new Date(k.tanggal_kunjungan).toLocaleDateString('id-ID') : '-',
                        'Nama Peserta': k.peserta_nama || (k as any).peserta?.nama || pesertaInfo?.nama || '-',
                        'NIK': (k as any).peserta_nik || (k as any).peserta?.nik || pesertaInfo?.nik || '-',
                        'Kategori': getKategoriLabel(k.peserta_kategori || (k as any).peserta?.kategori || pesertaInfo?.kategori || ''),
                        'Lokasi': k.lokasi === 'posyandu' ? 'Posyandu' : 'Kunjungan Rumah',
                    };
                });
            } else if (type === 'participants') {
                const data = pesertaList;
                if (data.length === 0) {
                    console.log('[Laporan] Peserta cache is empty.');
                    return [];
                }

                return data.map((p: PesertaListItem, index: number) => ({
                    'No': index + 1,
                    'Nama': p.nama,
                    'NIK': p.nik,
                    'Kategori': getKategoriLabel(p.kategori),
                    'Jenis Kelamin': p.jenis_kelamin || '-',
                    'Telepon': (p as any).telepon || '-',
                }));
            } else {
                // Activity log - not available without backend
                console.warn('[Laporan] Activities preview requires backend');
                return [];
            }
        } catch (err) {
            console.error('Error getting preview data:', err);
            throw err;
        }
    }, [pesertaList, kunjunganList]);

    return {
        isLoading: isLoading || isDataLoading,
        stats,
        error,
        fetchStats,
        generateReport,
        getPreviewData
    };
}

// Helper functions
function getKategoriLabel(kategori: string): string {
    const labels: Record<string, string> = {
        bumil: 'Ibu Hamil',
        balita: 'Balita',
        remaja: 'Remaja',
        produktif: 'Produktif',
        lansia: 'Lansia'
    };
    return labels[kategori] || kategori || '-';
}
