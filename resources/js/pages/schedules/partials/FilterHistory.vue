<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { monthNames } from '@/lib/date';
import type { HistoryFilters } from '@/types';

const props = withDefaults(
    defineProps<{
        filters: HistoryFilters;
        isLoading?: boolean;
    }>(),
    {
        isLoading: false,
    },
);

const emit = defineEmits<{
    (e: 'apply', filters: HistoryFilters): void;
}>();

const now = new Date();
const currentMonthNumber = now.getMonth() + 1;
const currentYearNumber = now.getFullYear();

const yearOptions = computed(() => {
    const years: number[] = [];

    for (let y = currentYearNumber; y >= currentYearNumber - 5; y--) {
        years.push(y);
    }

    return years;
});

const activeMonth = computed(() =>
    props.filters.month ? Number(props.filters.month) : currentMonthNumber,
);

const activeYear = computed(() =>
    props.filters.year ? Number(props.filters.year) : currentYearNumber,
);

function applyMonth(month: number) {
    emit('apply', {
        month,
        year: activeYear.value,
    });
}

function applyYear(year: number) {
    emit('apply', {
        month: activeMonth.value,
        year,
    });
}
</script>

<template>
    <DropdownMenuContent align="end" class="w-72 p-3.5 shadow-xl">
        <!-- 1. Pilih Bulan (Grid 4 Kolom) -->
        <p class="mb-2 text-xs font-semibold text-muted-foreground">
            Pilih Bulan
        </p>
        <div class="mb-3.5 grid grid-cols-4 gap-1.5">
            <Button
                v-for="(name, index) in monthNames"
                :key="index"
                variant="outline"
                size="sm"
                class="h-7.5 cursor-pointer justify-center text-xs transition-colors"
                :disabled="props.isLoading"
                :class="
                    activeMonth === index + 1
                        ? 'border-primary/60 bg-primary/10 font-semibold text-primary shadow-2xs'
                        : 'text-foreground hover:bg-muted/60'
                "
                @click="applyMonth(index + 1)"
            >
                {{ name.slice(0, 3) }}
            </Button>
        </div>

        <!-- 2. Pilih Tahun -->
        <p class="mb-2 text-xs font-semibold text-muted-foreground">
            Pilih Tahun
        </p>
        <div class="flex flex-wrap gap-1.5">
            <Button
                v-for="year in yearOptions"
                :key="year"
                variant="outline"
                size="sm"
                class="h-7 cursor-pointer px-2.5 text-xs transition-colors"
                :disabled="props.isLoading"
                :class="
                    activeYear === year
                        ? 'border-primary/60 bg-primary/10 font-semibold text-primary shadow-2xs'
                        : 'text-foreground hover:bg-muted/60'
                "
                @click="applyYear(year)"
            >
                {{ year }}
            </Button>
        </div>
    </DropdownMenuContent>
</template>
