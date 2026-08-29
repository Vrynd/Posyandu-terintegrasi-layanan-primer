<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import { ClockFading, Plus } from '@lucide/vue';
import { computed, ref, toRef, watch } from 'vue';
import ScheduleController from '@/actions/App/Http/Controllers/Schedules/ScheduleController';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCalendar } from '@/composables/useCalendar';
import { dashboard } from '@/routes';
import { history } from '@/routes/schedules';
import type { LocationOption, ScheduleItem, StatusOption } from '@/types';
import CalendarGrid from './partials/CalendarGrid.vue';
import DailyTimeline from './partials/DailyTimeline.vue';
import GeneralFields from './partials/GeneralFields.vue';

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
    locations?: LocationOption[];
}

const props = withDefaults(defineProps<Props>(), {
    schedules: () => [],
    currentYear: () => new Date().getFullYear(),
    statuses: () => [],
    locations: () => [],
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
const isSheetOpen = ref(false);

const form = useForm({
    title: '',
    location: '',
    custom_location: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
});

const openCreateSheet = (dateString?: string) => {
    const d = new Date();
    const todayString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const targetDate = dateString || selectedDate.value || todayString;
    const initialDate = targetDate < todayString ? todayString : targetDate;

    form.clearErrors();
    form.reset();
    form.start_date = initialDate;
    isSheetOpen.value = true;
};

const submitSchedule = () => {
    form.post(ScheduleController.store.url(), {
        preserveScroll: true,
        onSuccess: () => {
            isSheetOpen.value = false;
            form.reset();
        },
    });
};

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
                    class="cursor-pointer gap-1.5"
                    @click="openCreateSheet(selectedDate)"
                >
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Buat Jadwal</span>
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
                class="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm lg:w-80 lg:self-stretch lg:rounded-none lg:border-none lg:bg-transparent lg:p-5 lg:shadow-none lg:backdrop-blur-none xl:w-96 dark:bg-zinc-900/60 lg:dark:bg-transparent"
            >
                <DailyTimeline
                    :selected-date="selectedDate"
                    :schedules="selectedDateSchedules"
                    :is-admin="isAdmin"
                    :statuses="props.statuses"
                    :locations="props.locations"
                    @prev-day="prevDay"
                    @next-day="nextDay"
                    @go-today="goToToday"
                    @create-schedule="openCreateSheet"
                />
            </div>
        </div>
        <Sheet v-model:open="isSheetOpen">
            <SheetContent
                side="bottom"
                class="inset-x-0 bottom-0 max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card/95 px-6 pt-3 pb-6 shadow-2xl backdrop-blur-md dark:bg-zinc-950/95"
            >
                <div
                    class="mx-auto mb-3 h-1.5 w-12 cursor-pointer rounded-full bg-muted-foreground/30 transition-colors hover:bg-muted-foreground/50"
                    @click="isSheetOpen = false"
                />

                <div class="mx-auto w-full max-w-3xl space-y-6">
                    <!-- Header Sheet -->
                    <SheetHeader class="p-0 text-left">
                        <SheetTitle class="font-display text-lg font-semibold">
                            Buat Jadwal Baru
                        </SheetTitle>
                        <SheetDescription class="text-xs text-muted-foreground">
                            Isi formulir berikut untuk merencanakan agenda
                            posyandu pada tanggal terpilih.
                        </SheetDescription>
                    </SheetHeader>
                    <form @submit.prevent="submitSchedule" class="space-y-6">
                        <GeneralFields
                            v-model:form="form"
                            :locations="props.locations"
                        />

                        <div class="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                class="cursor-pointer text-xs"
                                @click="isSheetOpen = false"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                :disabled="form.processing"
                                class="cursor-pointer gap-2 text-xs font-semibold"
                            >
                                <Plus class="size-4" />
                                <span>{{
                                    form.processing
                                        ? 'Menyimpan...'
                                        : 'Jadwalkan Kegiatan'
                                }}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    </div>
</template>
