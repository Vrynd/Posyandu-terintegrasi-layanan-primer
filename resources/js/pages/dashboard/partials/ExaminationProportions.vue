<script setup lang="ts">
import { ArrowUpDown } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trendCategories } from '@/lib/participant';
import type { MonthlyExamination, TrendCategory } from '@/types';

const props = defineProps<{
    trends?: MonthlyExamination[];
}>();

const isSortedByHighest = ref(false);
const BAR_AREA_HEIGHT = 228;

function getCategoryTotal(key: TrendCategory): number {
    if (!props.trends?.length) {
        return 0;
    }

    return props.trends.reduce((sum, item) => sum + item[key], 0);
}

const totalExaminations = computed(() => {
    if (!props.trends?.length) {
        return 0;
    }

    return props.trends.reduce(
        (sum, item) =>
            sum +
            item.pregnant +
            item.toddler +
            item.teenager +
            item.productive +
            item.adult,
        0,
    );
});

const categoryProportions = computed(() => {
    const items = trendCategories.map((cat) => {
        const count = getCategoryTotal(cat.key);
        const percentage =
            totalExaminations.value > 0
                ? Math.round((count / totalExaminations.value) * 100)
                : 0;

        return {
            ...cat,
            count,
            percentage,
        };
    });

    if (!isSortedByHighest.value) {
        return items;
    }

    return [...items].sort((a, b) => b.count - a.count);
});

function getFillWidth(percentage: number): string {
    if (percentage >= 100) {
        return '100%';
    }

    return `calc(38px + (100% - 88px) * ${percentage / 100})`;
}

function toggleSort(): void {
    isSortedByHighest.value = !isSortedByHighest.value;
}
</script>

<template>
    <Card class="flex flex-col gap-0 rounded-2xl border-0 p-0">
        <!-- 1. Header Kartu & Tombol Urutan -->
        <CardHeader
            class="flex flex-row items-center justify-between gap-4 border-dashed p-4 sm:p-5"
        >
            <div class="flex items-center gap-2.5">
                <span class="h-5 w-2 shrink-0 rounded-full bg-accent" />
                <CardTitle class="text-base text-foreground/90">
                    Proporsi Pemeriksaan
                </CardTitle>
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                class="size-7 rounded-full shadow-none transition-colors"
                :class="
                    isSortedByHighest &&
                    'border-primary/40 bg-primary/10 text-primary'
                "
                :title="
                    isSortedByHighest
                        ? 'Kembalikan ke urutan kategori'
                        : 'Urutkan persentase tertinggi'
                "
                @click="toggleSort"
            >
                <ArrowUpDown
                    class="size-3.5"
                    :class="
                        isSortedByHighest
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    "
                />
            </Button>
        </CardHeader>

        <!-- 2. Konten 5 Segmented Bar Kategori & Keterangan Bawah -->
        <CardContent class="px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
            <div class="flex h-64 w-full flex-col justify-between gap-3">
                <!-- Daftar 5 Bar Horizontal -->
                <div
                    class="flex w-full flex-col gap-2"
                    :style="{ height: `${BAR_AREA_HEIGHT}px` }"
                >
                    <div
                        v-for="item in categoryProportions"
                        :key="item.key"
                        :title="`${item.label}: ${item.count} pemeriksaan (${item.percentage}%)`"
                        class="flex w-full flex-1 items-center gap-1.5 select-none"
                    >
                        <!-- Segmen 1 (Kiri): Bar Fill Warna Kategori -->
                        <div
                            v-if="item.percentage > 0"
                            class="flex h-full items-center rounded-xl p-1 transition-all duration-500 ease-out"
                            :class="[
                                item.color,
                                item.percentage >= 100
                                    ? 'w-full justify-between'
                                    : 'shrink-0',
                            ]"
                            :style="{ width: getFillWidth(item.percentage) }"
                        >
                            <!-- Ikon Kategori (Kiri - Konsentris R=8px) -->
                            <div
                                class="flex aspect-square h-full shrink-0 items-center justify-center rounded-[8px] bg-card shadow-xs"
                            >
                                <component
                                    :is="item.icon"
                                    class="size-4 text-foreground/80"
                                />
                            </div>

                            <!-- Badge Persentase HANYA muncul saat mencapai 100% -->
                            <span
                                v-if="item.percentage >= 100"
                                class="flex h-full min-w-12 shrink-0 items-center justify-center rounded-[8px] bg-foreground px-2.5 text-[11px] font-semibold text-background tabular-nums shadow-xs"
                            >
                                {{ item.percentage }}%
                            </span>
                        </div>

                        <!-- Segmen 2 (Kanan): Bar Arsir Sisa Persentase (Tanpa Badge Hitam) -->
                        <div
                            v-if="item.percentage < 100"
                            class="striped-empty-pattern flex h-full min-w-11 flex-1 items-center rounded-xl border border-dashed border-border/80 bg-muted/25 p-1 transition-all duration-500 ease-out"
                            :class="
                                item.percentage === 0
                                    ? 'justify-between'
                                    : 'justify-end'
                            "
                        >
                            <!-- Ikon Kategori khusus saat 0% -->
                            <div
                                v-if="item.percentage === 0"
                                class="flex aspect-square h-full shrink-0 items-center justify-center rounded-[8px] bg-card shadow-xs"
                            >
                                <component
                                    :is="item.icon"
                                    class="size-4 text-foreground/80"
                                />
                            </div>

                            <!-- Teks Persentase langsung di dalam Bar Arsir -->
                            <span
                                class="px-2 text-[11px] font-semibold text-foreground/80 tabular-nums"
                            >
                                {{ item.percentage }}%
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Baris Keterangan Bawah Kartu -->
                <p class="truncate text-xs text-muted-foreground select-none">
                    Kalkulasi dari total
                    <span class="font-semibold text-foreground/80">
                        {{ totalExaminations }}
                    </span>
                    pemeriksaan tahun ini.
                </p>
            </div>
        </CardContent>
    </Card>
</template>
