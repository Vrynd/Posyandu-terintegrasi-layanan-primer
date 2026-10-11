<script setup lang="ts">
import { AltArrowLeftIcon, AltArrowRightIcon } from '@solar-icons/vue/linear';
import { computed, ref } from 'vue';
import ChartTooltip from '@/components/ChartTooltip.vue';
import type { ChartTooltipItem } from '@/components/ChartTooltip.vue';
import ChartWave from '@/components/ChartWave.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScroll } from '@/composables/useScroll';
import { monthNames } from '@/lib/date';
import type { MonthlyExamination, TrendCategory } from '@/types';

const props = defineProps<{
    trends?: MonthlyExamination[];
}>();

// State Tahun & Navigasi Scroll
const activeTooltipMonth = ref<string | null>(null);
const container = ref<HTMLElement | null>(null);

const barGap = 24;
const MIN_SEGMENT_HEIGHT = 20;
const SEGMENT_GAP = 4;
const MAX_AVAILABLE_BAR_HEIGHT = 212;
const BAR_AREA_HEIGHT = 228;

const {
    containerWidth,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
} = useScroll(container, { gap: barGap });

const barColumns = computed(() => {
    if (containerWidth.value > 0) {
        return containerWidth.value < 480 ? 6 : 9;
    }

    return typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 9;
});

const categories = [
    { key: 'pregnant', label: 'Ibu Hamil', color: 'bg-pink-500' },
    { key: 'toddler', label: 'Balita', color: 'bg-blue-500' },
    { key: 'teenager', label: 'Remaja', color: 'bg-teal-500' },
    { key: 'productive', label: 'Produktif', color: 'bg-orange-500' },
    { key: 'adult', label: 'Lansia', color: 'bg-amber-400' },
] as const;

// Data 12 Bulan
const emptyYearData: MonthlyExamination[] = monthNames.map((name) => ({
    month: name.slice(0, 3),
    fullMonth: name,
    pregnant: 0,
    toddler: 0,
    teenager: 0,
    productive: 0,
    adult: 0,
}));

const currentData = computed(() =>
    props.trends?.length ? props.trends : emptyYearData,
);

function getMonthTotal(d: MonthlyExamination): number {
    return d.pregnant + d.toddler + d.teenager + d.productive + d.adult;
}

function hasActivity(d: MonthlyExamination): boolean {
    return getMonthTotal(d) > 0;
}

const hasAnyActivity = computed(() =>
    currentData.value.some((d) => hasActivity(d)),
);

const scaleFactor = computed(() => {
    const baseMinTotal = MIN_SEGMENT_HEIGHT * categories.length;
    const maxDynamicSpace = MAX_AVAILABLE_BAR_HEIGHT - baseMinTotal;

    const maxMonthTotal = Math.max(
        ...currentData.value.map((d) => getMonthTotal(d)),
        1,
    );

    return maxMonthTotal > maxDynamicSpace
        ? maxDynamicSpace / maxMonthTotal
        : 1;
});

function getSegmentHeight(d: MonthlyExamination, key: TrendCategory): number {
    if (d[key] <= 0) {
        return MIN_SEGMENT_HEIGHT;
    }

    return MIN_SEGMENT_HEIGHT + Math.round(d[key] * scaleFactor.value);
}

function getActiveBarHeight(d: MonthlyExamination): number {
    const segmentsHeight = categories.reduce(
        (total, cat) => total + getSegmentHeight(d, cat.key),
        0,
    );
    const totalGaps = (categories.length - 1) * SEGMENT_GAP;

    return segmentsHeight + totalGaps;
}

function getEmptyBarHeight(index: number): number {
    for (let i = index - 1; i >= 0; i--) {
        const prevMonth = currentData.value[i];

        if (prevMonth && hasActivity(prevMonth)) {
            return getActiveBarHeight(prevMonth);
        }
    }

    return BAR_AREA_HEIGHT;
}

function getBarHeightByIndex(index: number): number {
    const item = currentData.value[index];

    if (!item) {
        return 0;
    }

    return hasActivity(item)
        ? getActiveBarHeight(item)
        : getEmptyBarHeight(index);
}

const barHeights = computed(() =>
    currentData.value.map((_, index) => getBarHeightByIndex(index)),
);

function getTooltipItems(d: MonthlyExamination): ChartTooltipItem[] {
    if (!hasActivity(d)) {
        return [];
    }

    return categories.map((cat) => ({
        key: cat.key,
        label: cat.label,
        value: d[cat.key],
        color: cat.color,
    }));
}

function isHighestCategory(d: MonthlyExamination, key: TrendCategory): boolean {
    if (!hasActivity(d)) {
        return false;
    }

    const maxVal = Math.max(
        d.pregnant,
        d.toddler,
        d.teenager,
        d.productive,
        d.adult,
    );

    return d[key] === maxVal && maxVal > 0;
}
</script>

<template>
    <!-- 1. -->
    <Card class="flex flex-col gap-0 rounded-2xl border-0 p-0">
        <CardHeader
            class="flex flex-row items-center justify-between gap-4 border-dashed p-4 sm:p-5"
        >
            <div class="flex items-center gap-2.5">
                <span
                    class="hidden h-5 w-2 shrink-0 rounded-full bg-accent sm:block"
                />
                <CardTitle class="text-base text-foreground/90">
                    Tren Pemeriksaan
                </CardTitle>
            </div>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                <div
                    class="hidden flex-wrap items-center gap-2 text-xs text-muted-foreground sm:flex sm:gap-2.5"
                >
                    <div
                        v-for="cat in categories"
                        :key="cat.key"
                        class="flex items-center gap-1.5 select-none"
                    >
                        <span class="size-2 rounded-full" :class="cat.color" />
                        <span
                            class="text-[11px] font-medium text-foreground/80 sm:text-xs"
                        >
                            {{ cat.label }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        class="size-7 rounded-full shadow-none"
                        :disabled="!canScrollLeft"
                        title="Bulan sebelumnya"
                        @click="scrollPrev"
                    >
                        <AltArrowLeftIcon
                            class="size-4 text-muted-foreground"
                        />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        class="size-7 rounded-full shadow-none"
                        :disabled="!canScrollRight"
                        title="Bulan berikutnya"
                        @click="scrollNext"
                    >
                        <AltArrowRightIcon
                            class="size-4 text-muted-foreground"
                        />
                    </Button>
                </div>
            </div>
        </CardHeader>

        <!-- 2. -->
        <CardContent class="px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
            <div
                ref="container"
                class="no-scrollbar relative flex h-64 w-full items-end overflow-x-auto scroll-smooth"
                :style="{ gap: `${barGap}px` }"
            >
                <ChartWave
                    v-if="hasAnyActivity"
                    :heights="barHeights"
                    :container-width="containerWidth"
                    :height="BAR_AREA_HEIGHT"
                    :visible-columns="barColumns"
                    :gap="barGap"
                />

                <div
                    v-for="(item, index) in currentData"
                    :key="item.month"
                    class="group relative z-10 flex h-full shrink-0 flex-col items-center justify-end gap-3 hover:z-30"
                    :style="{
                        width: `calc((100% - (${barColumns - 1} * ${barGap}px)) / ${barColumns})`,
                    }"
                    @mouseenter="activeTooltipMonth = item.month"
                    @mouseleave="activeTooltipMonth = null"
                >
                    <ChartTooltip
                        v-if="activeTooltipMonth === item.month"
                        :title="item.fullMonth"
                        :summary="`Total: ${getMonthTotal(item)}`"
                        :items="getTooltipItems(item)"
                        empty-text="Tidak ada kegiatan Posyandu"
                        :align="
                            index === 0
                                ? 'left'
                                : index >= barColumns - 1
                                  ? 'right'
                                  : 'center'
                        "
                    />

                    <!-- Bulan Aktif -->
                    <div
                        v-if="hasActivity(item)"
                        class="flex w-full flex-col-reverse gap-1"
                    >
                        <div
                            v-for="cat in categories"
                            :key="cat.key"
                            class="w-full rounded-[10px] transition-all duration-300"
                            :class="[
                                item[cat.key] > 0
                                    ? [
                                          cat.color,
                                          isHighestCategory(item, cat.key) &&
                                              'striped-pattern',
                                      ]
                                    : 'striped-empty-pattern border border-dashed border-border/80 bg-muted/25',
                            ]"
                            :style="{
                                height: `${getSegmentHeight(item, cat.key)}px`,
                            }"
                        />
                    </div>

                    <!-- Bulan Tanpa Kegiatan -->
                    <div
                        v-else
                        class="striped-empty-pattern w-full rounded-[10px] border border-dashed border-border/80 bg-muted/25 transition-all duration-300"
                        :style="{
                            height: `${getEmptyBarHeight(index)}px`,
                        }"
                    />

                    <!-- Label Bulan -->
                    <span
                        class="text-xs font-medium transition-colors select-none"
                        :class="[
                            hasActivity(item)
                                ? 'text-muted-foreground group-hover:text-foreground'
                                : 'text-muted-foreground/50 group-hover:text-muted-foreground',
                        ]"
                    >
                        {{ item.month }}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
