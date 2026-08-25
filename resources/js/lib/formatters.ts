import type { BadgeColor } from '@/components/StatusBadge.vue';

/**
 * Pemetaan kode gender ke label bahasa Indonesia.
 */
export const GENDER_LABELS: Record<string, string> = {
    male: 'Laki-laki',
    female: 'Perempuan',
};

/**
 * Peta warna badge berdasarkan kategori sasaran posyandu.
 */
export const CATEGORY_COLORS: Record<string, BadgeColor> = {
    pregnant_mother: 'pink',
    toddler: 'blue',
    teenager: 'teal',
    productive: 'orange',
    adult: 'yellow',
};

/**
 * Mengambil warna badge untuk kategori sasaran tertentu.
 */
export function getCategoryColor(category: string): BadgeColor {
    return CATEGORY_COLORS[category] ?? 'indigo';
}

/**
 * Mengambil label kategori berdasarkan daftar opsi kategori dari backend.
 */
export function getCategoryLabel(
    category: string,
    categories: Array<{ label: string; value: string }> = [],
): string {
    return categories.find((c) => c.value === category)?.label ?? category;
}

/**
 * Memformat string tanggal mesin (ISO / Y-m-d) ke format bahasa Indonesia.
 */
export function formatDate(
    dateStr: string | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    },
): string {
    if (!dateStr) {
        return '—';
    }

    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

export function isChildOrTeen(category: string): boolean {
    return category === 'toddler' || category === 'teenager';
}

export function isPregnantMother(category: string): boolean {
    return category === 'pregnant_mother';
}

export function isProductiveOrAdult(category: string): boolean {
    return category === 'productive' || category === 'adult';
}

export function formatTimeRange(
    start?: string | null,
    end?: string | null,
): string {
    if (!start && !end) {
        return 'Waktu belum diatur';
    }

    const s = start ? start.substring(0, 5) : '??:??';
    const e = end ? end.substring(0, 5) : 'Selesai';

    return `${s} - ${e} WIB`;
}

export const SCHEDULE_STATUS_LABELS: Record<string, string> = {
    scheduled: 'Terjadwal',
    ongoing: 'Sedang Berlangsung',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export function getScheduleStatusLabel(
    status: string,
    statuses: Array<{ label: string; value: string }> = [],
): string {
    return (
        statuses.find((s) => s.value === status)?.label ??
        SCHEDULE_STATUS_LABELS[status] ??
        status
    );
}
