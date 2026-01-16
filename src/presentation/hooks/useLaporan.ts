import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLaporanData, type ReportType } from './useLaporanData';
import toast from 'react-hot-toast';
import { FileText, Calendar, Users } from 'lucide-react';

export interface ReportConfig {
    id: ReportType;
    name: string;
    description: string;
    details: string[];
    icon: typeof FileText;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const reports: ReportConfig[] = [
    {
        id: 'examinations',
        name: 'Laporan Pemeriksaan',
        description: 'Rekap data kunjungan peserta',
        details: ['Tanggal Pemeriksaan', 'Data Peserta', 'Lokasi Pemeriksaan', 'Status Rujukan'],
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
    },
    {
        id: 'participants',
        name: 'Laporan Peserta',
        description: 'Data lengkap semua peserta',
        details: ['Data Pribadi', 'Kategori Peserta', 'Kontak & Alamat', 'Status BPJS'],
        icon: Users,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-500',
    },
];

export const months = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
    { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
];

export function useLaporan() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize from URL or defaults
    const reportFromUrl = searchParams.get('type') as ReportType | null;
    const monthFromUrl = searchParams.get('month') ? parseInt(searchParams.get('month')!, 10) : null;

    const [selectedReport, setSelectedReport] = useState<ReportType | null>(reportFromUrl);
    const [selectedMonth, setSelectedMonth] = useState(monthFromUrl || new Date().getMonth() + 1);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    const { isLoading, generateReport, getPreviewData } = useLaporanData();
    const currentYear = new Date().getFullYear();

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (selectedReport) {
            params.set('type', selectedReport);
        } else {
            params.delete('type');
        }
        params.set('month', selectedMonth.toString());

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params, { replace: true });
        }
    }, [selectedReport, selectedMonth, setSearchParams, searchParams]);

    useEffect(() => {
        const loadPreview = async () => {
            if (!selectedReport) {
                setPreviewData([]);
                setPreviewError(null);
                return;
            }
            setIsLoadingPreview(true);
            setPreviewError(null);
            try {
                const data = await getPreviewData(selectedReport, selectedMonth, currentYear);
                setPreviewData(data.slice(0, 10));
            } catch (err) {
                console.error('Preview error:', err);
                setPreviewError('Gagal memuat preview. Pastikan sudah klik Sinkronkan di Dashboard.');
                setPreviewData([]);
            } finally {
                setIsLoadingPreview(false);
            }
        };
        loadPreview();
    }, [selectedReport, selectedMonth, currentYear, getPreviewData]);

    const handleReportToggle = useCallback((id: ReportType) => {
        setSelectedReport(prev => prev === id ? null : id);
    }, []);

    const handleGenerate = async () => {
        if (!selectedReport) {
            toast.error('Pilih jenis laporan terlebih dahulu');
            return;
        }
        const result = await generateReport(selectedReport, selectedMonth, currentYear);
        if (result.success) {
            toast.success(`Laporan berhasil diunduh: ${result.filename}`);
        } else {
            toast.error('Gagal membuat laporan');
        }
    };

    const getReportLabel = useCallback(() => {
        const report = reports.find(r => r.id === selectedReport);
        return report?.name || 'Laporan';
    }, [selectedReport]);

    return {
        selectedReport,
        selectedMonth,
        setSelectedMonth,
        previewData,
        isLoadingPreview,
        previewError,
        isLoading,
        currentYear,
        handleReportToggle,
        handleGenerate,
        getReportLabel,
        reports,
        months
    };
}
