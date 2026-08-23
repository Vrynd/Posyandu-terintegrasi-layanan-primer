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
