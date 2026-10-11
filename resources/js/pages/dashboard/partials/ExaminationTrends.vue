<script setup lang="ts">
import { AltArrowLeftIcon, AltArrowRightIcon } from '@solar-icons/vue/linear';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import ChartLegend from '@/components/ChartLegend.vue';
import ChartTooltip from '@/components/ChartTooltip.vue';
import type { ChartTooltipItem } from '@/components/ChartTooltip.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScroll } from '@/composables/useScroll';
import { monthNames } from '@/lib/date';
import { trendCategories } from '@/lib/participant';
import type { MonthlyExamination, TrendCategory } from '@/types';

const props = defineProps<{
    trends?: MonthlyExamination[];
}>();

// State Tahun & Navigasi Scroll
const activeTooltipMonth = ref<string | null>(null);
const container = ref<HTMLElement | null>(null);

const MIN_SEGMENT_HEIGHT = 20;
const MAX_AVAILABLE_BAR_HEIGHT = 220;
const BAR_AREA_HEIGHT = 228;
const currentMonth = new Date().getMonth();

const {
    containerWidth,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
    scrollToEnd,
} = useScroll(container, { gap: () => barGap.value });

const isMobileContainer = computed(() => {
    if (containerWidth.value > 0) {
        return containerWidth.value < 550;
    }

    return typeof window !== 'undefined' && window.innerWidth < 640;
});

const barGap = computed(() => (isMobileContainer.value ? 20 : 24));
const barColumns = computed(() => (isMobileContainer.value ? 6 : 9));

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

const scaleFactor = computed(() => {
    const baseMinTotal = MIN_SEGMENT_HEIGHT * trendCategories.length;
    const maxDynamicSpace = MAX_AVAILABLE_BAR_HEIGHT - baseMinTotal;

    const maxMonthTotal = Math.max(
        ...currentData.value.map((d) => getMonthTotal(d)),
        1,
    );

    return Math.min(maxDynamicSpace / maxMonthTotal, 3);
});

function getSegmentHeight(d: MonthlyExamination, key: TrendCategory): number {
    return MIN_SEGMENT_HEIGHT + Math.round(d[key] * scaleFactor.value);
}

function getActiveCategories(d: MonthlyExamination) {
    return trendCategories.filter((cat) => d[cat.key] > 0);
}

function getTooltipItems(d: MonthlyExamination): ChartTooltipItem[] {
    if (!hasActivity(d)) {
        return [];
    }

    return trendCategories.map((cat) => ({
        key: cat.key,
        label: cat.shortLabel,
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

function syncActiveMonthScroll(): void {
    nextTick(() => {
        if (currentMonth >= barColumns.value) {
            scrollToEnd();
        }
    });
}

onMounted(syncActiveMonthScroll);
watch(barColumns, syncActiveMonthScroll);
</script>

<template>
    <!-- 1. -->
    <Card class="flex flex-col gap-0 rounded-2xl border-0 p-0">
        <CardHeader
            class="flex flex-row items-center justify-between gap-4 border-dashed p-4 sm:p-5"
        >
            <div class="flex items-center gap-2.5">
                <span class="h-5 w-2 shrink-0 rounded-full bg-accent" />
                <CardTitle class="text-base text-foreground/90">
                    Tren Pemeriksaan
                </CardTitle>
            </div>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                <ChartLegend class="hidden sm:flex" />

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
                        class="flex w-full flex-col-reverse gap-0.5"
                    >
                        <div
                            v-for="cat in getActiveCategories(item)"
                            :key="cat.key"
                            class="w-full rounded-[10px] transition-all duration-300"
                            :class="[
                                cat.color,
                                isHighestCategory(item, cat.key) &&
                                    'striped-pattern',
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
                            height: `${BAR_AREA_HEIGHT}px`,
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
