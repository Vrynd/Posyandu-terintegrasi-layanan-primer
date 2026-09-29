<script setup lang="ts">
import { Calendar, CalendarDays, Filter, Layers } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Toolbar, ToolbarDropdown } from '@/components/ui/toolbar';
import type { ReportFilterState } from '@/types';

const filters = defineModel<ReportFilterState>('filters', {
    required: true,
});

defineEmits<{
    (e: 'apply'): void;
}>();

// 1. Opsi 12 Bulan Otomatis Bahasa Indonesia via Intl API
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(
        new Date(2026, i, 1),
    ),
    value: String(i + 1),
}));

// 2. Opsi Tahun (Tahun berjalan & 2 tahun sebelumnya)
const currentYear = new Date().getFullYear();
const yearOptions = computed(() => [
    { label: String(currentYear), value: String(currentYear) },
    { label: String(currentYear - 1), value: String(currentYear - 1) },
    { label: String(currentYear - 2), value: String(currentYear - 2) },
]);

// 3. Opsi Kategori Sasaran Posyandu
const categoryOptions = [
    { label: 'Semua Kategori', value: 'all' },
    { label: 'Ibu Hamil & Nifas', value: 'pregnant_mother' },
    { label: 'Balita', value: 'toddler' },
    { label: 'Anak Remaja', value: 'teenager' },
    { label: 'Usia Produktif', value: 'productive' },
    { label: 'Usia Lansia', value: 'adult' },
];
</script>

<template>
    <Toolbar>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <!-- 1. Filter Periode Bulan -->
            <div class="flex flex-col gap-2">
                <Label class="text-xs text-foreground/90">
                    Periode Bulan
                </Label>
                <ToolbarDropdown
                    v-model="filters.month"
                    :options="monthOptions"
                    :icon="Calendar"
                    title="Pilih Bulan"
                    default-value=""
                    class="w-full bg-muted/40"
                />
            </div>

            <!-- 2. Filter Tahun -->
            <div class="flex flex-col gap-2">
                <Label class="text-xs text-foreground/90"> Tahun </Label>
                <ToolbarDropdown
                    v-model="filters.year"
                    :options="yearOptions"
                    :icon="CalendarDays"
                    title="Pilih Tahun"
                    default-value=""
                    class="w-full bg-muted/40"
                />
            </div>

            <!-- 3. Filter Kategori Sasaran -->
            <div class="flex flex-col gap-2">
                <Label class="text-xs text-foreground/90">
                    Kategori Sasaran
                </Label>
                <ToolbarDropdown
                    v-model="filters.category"
                    :options="categoryOptions"
                    :icon="Layers"
                    title="Pilih Kategori"
                    default-value=""
                    class="w-full bg-muted/40"
                />
            </div>

            <!-- 4. Tombol Terapkan Filter -->
            <div class="flex flex-col gap-2">
                <Label class="text-xs text-foreground/90"> Aksi </Label>
                <Button
                    type="button"
                    class="h-9.5 shadow-xs"
                    @click="$emit('apply')"
                >
                    <Filter class="size-3.5" />
                    <span>Terapkan Filter</span>
                </Button>
            </div>
        </div>
    </Toolbar>
</template>
