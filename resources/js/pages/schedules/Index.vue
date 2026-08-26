<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Plus, ClockFading } from '@lucide/vue';
import { computed, ref, toRef, watch } from 'vue';
import ScheduleController from '@/actions/App/Http/Controllers/Schedules/ScheduleController';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/composables/useCalendar';
import { dashboard } from '@/routes';
import { history } from '@/routes/schedules';
import type { ScheduleItem, StatusOption } from '@/types';
import CalendarGrid from './partials/CalendarGrid.vue';
import DailyTimeline from './partials/DailyTimeline.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Jadwal Kegiatan' },
        ],
    },
});

interface Props {
    schedules?: ScheduleItem[];
    currentYear?: number;
    statuses?: StatusOption[];
}

const props = withDefaults(defineProps<Props>(), {
    schedules: () => [],
    currentYear: () => new Date().getFullYear(),
    statuses: () => [],
});

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'administrator');

const schedulesRef = toRef(props, 'schedules');
const {
    currentYear,
    currentMonth,
    selectedDate,
    calendarGrid,
    selectedDateSchedules,
    prevMonth,
    nextMonth,
    goToToday,
    selectDate,
    jumpToMonth,
    jumpToYear,
    prevDay,
    nextDay,
} = useCalendar(schedulesRef, props.currentYear);

const isLoadingYear = ref(false);

watch(currentYear, (newYear, oldYear) => {
    if (newYear === oldYear) {
        return;
    }

    router.cancelAll();

    router.get(
        ScheduleController.index.url({ query: { year: newYear } }),
        {},
        {
            preserveState: true,
            preserveScroll: true,
            only: ['schedules', 'currentYear'],
            onStart: () => {
                isLoadingYear.value = true;
            },
            onFinish: () => {
                isLoadingYear.value = false;
            },
        },
    );
});
</script>

<template>
    <Head title="Jadwal Kegiatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Jadwal Kegiatan"
                description="Papan kalender agenda posyandu yang direncanakan"
                variant="small"
            />
            <div class="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    class="cursor-pointer"
                    as-child
                >
                    <Link :href="history()">
                        <ClockFading class="h-4 w-4" />
                        <span class="hidden sm:inline">Riwayat Kegiatan</span>
                    </Link>
                </Button>
                <Button
                    v-if="isAdmin"
                    type="button"
                    variant="default"
                    class="cursor-pointer"
                    as-child
                >
                    <Link href="#">
                        <Plus class="h-4 w-4" />
                        <span class="hidden sm:inline">Tambah Jadwal</span>
                    </Link>
                </Button>
            </div>
        </header>

        <div
            class="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:shadow-sm lg:backdrop-blur-sm lg:dark:bg-zinc-900/60"
        >
            <div
                class="flex flex-1 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm lg:rounded-none lg:border-none lg:bg-transparent lg:p-6 lg:shadow-none lg:backdrop-blur-none dark:bg-zinc-900/60 lg:dark:bg-transparent"
                :class="{ 'pointer-events-none opacity-60': isLoadingYear }"
            >
                <CalendarGrid
                    :current-month="currentMonth"
                    :current-year="currentYear"
                    :calendar-grid="calendarGrid"
                    :selected-date="selectedDate"
                    :statuses="props.statuses"
                    @prev-month="prevMonth"
                    @next-month="nextMonth"
                    @go-today="goToToday"
                    @select-date="selectDate"
                    @jump-to-month="jumpToMonth"
                    @jump-to-year="jumpToYear"
                />
            </div>

            <div class="hidden lg:block lg:w-px lg:shrink-0 lg:bg-border/50" />

            <div
                class="flex w-full shrink-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm lg:w-80 lg:self-stretch lg:rounded-none lg:border-none lg:bg-transparent lg:p-5 lg:shadow-none lg:backdrop-blur-none xl:w-96 dark:bg-zinc-900/60 lg:dark:bg-transparent"
            >
                <DailyTimeline
                    :selected-date="selectedDate"
                    :schedules="selectedDateSchedules"
                    :is-admin="isAdmin"
                    :statuses="props.statuses"
                    @prev-day="prevDay"
                    @next-day="nextDay"
                    @go-today="goToToday"
                />
            </div>
        </div>
    </div>
</template>
