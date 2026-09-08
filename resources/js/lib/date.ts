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

export function calculateAge(
    birthDateStr: string | null | undefined,
    category?: string,
): string {
    if (!birthDateStr) {
        return '—';
    }

    const birthDate = new Date(birthDateStr);

    if (isNaN(birthDate.getTime())) {
        return '—';
    }

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 0) {
        return '—';
    }

    if (category === 'toddler' || (years === 0 && months >= 0)) {
        if (years === 0) {
            return `${months} Bulan`;
        }

        if (months === 0) {
            return `${years} Tahun`;
        }

        return `${years} Thn ${months} Bln`;
    }

    return `${years} Tahun`;
}
