<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import { computed, toRef } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/composables/useCalendar';
import { dashboard } from '@/routes';
import type { ScheduleItem } from '@/types';
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
}

const props = withDefaults(defineProps<Props>(), {
    schedules: () => [],
});

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'administrator');

// Inisialisasi Composable Kalender Reaktif
const schedulesRef = toRef(props, 'schedules');
const {
    currentYear,
    currentMonth,
    selectedDate,
    monthYearLabel,
    calendarGrid,
    selectedDateSchedules,
    prevMonth,
    nextMonth,
    goToToday,
    selectDate,
    jumpToMonth,
    jumpToYear,
    prevDay, // <-- tambah
    nextDay, // <-- tambah
} = useCalendar(schedulesRef);
</script>

<template>
    <Head title="Jadwal Kegiatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Jadwal Kegiatan"
                description="Papan kalender agenda posyandu yang direncanakan"
                variant="small"
            />
            <Button
                v-if="isAdmin"
                variant="default"
                class="h-9 w-fit bg-linear-to-br"
                as-child
            >
                <Link href="#">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Jadwal</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Master-Detail Calendar Dashboard -->
        <div
            class="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:shadow-sm lg:backdrop-blur-sm lg:dark:bg-zinc-900/60"
        >
            <!-- Card 1 (Mobile) / Sisi Kiri (Desktop): Kalender Bulanan -->
            <div
                class="flex flex-1 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm lg:rounded-none lg:border-none lg:bg-transparent lg:p-6 lg:shadow-none lg:backdrop-blur-none dark:bg-zinc-900/60 lg:dark:bg-transparent"
            >
                <CalendarGrid
                    :month-year-label="monthYearLabel"
                    :current-month="currentMonth"
                    :current-year="currentYear"
                    :calendar-grid="calendarGrid"
                    :selected-date="selectedDate"
                    @prev-month="prevMonth"
                    @next-month="nextMonth"
                    @go-today="goToToday"
                    @select-date="selectDate"
                    @jump-to-month="jumpToMonth"
                    @jump-to-year="jumpToYear"
                />
            </div>
            <!-- Garis Pemisah (Hanya Muncul di Desktop) -->
            <div class="hidden lg:block lg:w-px lg:shrink-0 lg:bg-border/50" />
            <!-- Card 2 (Mobile) / Sisi Kanan (Desktop): Agenda Kegiatan -->
            <div
                class="flex w-full shrink-0 flex-col overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm lg:w-72 lg:rounded-none lg:border-none lg:bg-transparent lg:p-5 lg:shadow-none lg:backdrop-blur-none xl:w-96 dark:bg-zinc-900/60 lg:dark:bg-transparent"
            >
                <DailyTimeline
                    :selected-date="selectedDate"
                    :schedules="selectedDateSchedules"
                    :is-admin="isAdmin"
                    @prev-day="prevDay"
                    @next-day="nextDay"
                    @go-today="goToToday"
                />
            </div>
        </div>
    </div>
</template>
