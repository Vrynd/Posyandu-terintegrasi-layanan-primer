export const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

export const dayNames = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
];

export function formatDate(
    dateStr: string | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    },
): string {
    if (!dateStr) {
        return '—';
    }

    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

export function formatTime(start?: string | null, end?: string | null): string {
    if (!start && !end) {
        return 'Waktu belum diatur';
    }

    const s = start ? start.substring(0, 5) : '??:??';
    const e = end ? end.substring(0, 5) : 'Selesai';

    return `${s} - ${e} WIB`;
}
