import type { Ref } from 'vue';
import { computed, ref } from 'vue';

export function useTableSort<T extends Record<string, any>>(
    data: Ref<T[]> | (() => T[]),
    defaultField: keyof T | null = null,
    defaultDirection: 'asc' | 'desc' | null = null,
) {
    const sortField = ref<keyof T | null>(defaultField);
    const sortDirection = ref<'asc' | 'desc' | null>(defaultDirection);

    const handleSort = (field: keyof T) => {
        if (sortField.value !== field) {
            // Klik 1: Kolom Baru -> ASC
            sortField.value = field;
            sortDirection.value = 'asc';
        } else if (sortDirection.value === 'asc') {
            // Klik 2: Kolom Sama -> DESC
            sortDirection.value = 'desc';
        } else if (sortDirection.value === 'desc') {
            // Klik 3: Kolom Sama -> RESET (Kembali Normal / Tanpa Sorting)
            sortField.value = null;
            sortDirection.value = null;
        }
    };

    const sortedData = computed(() => {
        const list = typeof data === 'function' ? data() : data.value;

        if (!Array.isArray(list)) {
            return [];
        }

        // Jika sortField / sortDirection NULL (Klik ke-3), kembalikan urutan asli!
        if (!sortField.value || !sortDirection.value) {
            return list;
        }

        const field = sortField.value;
        const dir = sortDirection.value;

        return [...list].sort((a, b) => {
            const rawKey = `${String(field)}_raw`;
            let valA: any = a[rawKey] ?? a[field] ?? '';
            let valB: any = b[rawKey] ?? b[field] ?? '';

            // Handle date string comparison chronologically
            const timeA = Date.parse(valA);
            const timeB = Date.parse(valB);

            if (
                !isNaN(timeA) &&
                !isNaN(timeB) &&
                typeof valA === 'string' &&
                /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(
                    valA,
                )
            ) {
                if (timeA < timeB) {
                    return dir === 'asc' ? -1 : 1;
                }

                if (timeA > timeB) {
                    return dir === 'asc' ? 1 : -1;
                }

                return 0;
            }

            // Standard string comparison
            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
            }

            if (typeof valB === 'string') {
                valB = valB.toLowerCase();
            }

            if (valA < valB) {
                return dir === 'asc' ? -1 : 1;
            }

            if (valA > valB) {
                return dir === 'asc' ? 1 : -1;
            }

            return 0;
        });
    });

    return {
        sortField,
        sortDirection,
        handleSort,
        sortedData,
    };
}
