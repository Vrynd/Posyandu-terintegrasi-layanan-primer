<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Trash2,
    XCircle,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { List, ListBadge, ListHeader, ListTitle } from '@/components/ui/list';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import schedules from '@/routes/schedules';
import schedulesHistory from '@/routes/schedules/history';
import type { HistoryFilters, ScheduleItem } from '@/types';
import FilterHistory from './partials/FilterHistory.vue';
import HistoryList from './partials/HistoryList.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Jadwal Kegiatan', href: schedules.index() },
            { title: 'Riwayat Kegiatan' },
        ],
    },
});

interface Props {
    completedSchedules?: ScheduleItem[];
    cancelledSchedules?: ScheduleItem[];
    filters?: HistoryFilters;
}

const props = withDefaults(defineProps<Props>(), {
    completedSchedules: () => [],
    cancelledSchedules: () => [],
    filters: () => ({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    }),
});

const page = usePage();
const isAdmin = computed(() => page.props.auth?.user?.role === 'administrator');

// State Loading Filter
const isLoading = ref(false);

const isConfirmOpen = ref(false);
const isDeleting = ref(false);
const deleteMode = ref<'single' | 'all'>('single');
const selectedItemId = ref<string | null>(null);

const now = new Date();
const currentMonthNumber = now.getMonth() + 1;
const currentYearNumber = now.getFullYear();

// Cek Apakah Filter Diluar Bulan Berjalan Sedang Aktif
const isFilterApplied = computed(
    () =>
        Number(props.filters?.month ?? currentMonthNumber) !==
            currentMonthNumber ||
        Number(props.filters?.year ?? currentYearNumber) !== currentYearNumber,
);

function applyFilter({ month, year }: HistoryFilters) {
    router.cancelAll();
    router.get(
        schedules.history.url({
            query: { ...(month && { month }), ...(year && { year }) },
        }),
        {},
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['completedSchedules', 'cancelledSchedules', 'filters'],
            onStart: () => {
                isLoading.value = true;
            },
            onFinish: () => {
                isLoading.value = false;
            },
        },
    );
}

function resetFilter() {
    applyFilter({
        month: currentMonthNumber,
        year: currentYearNumber,
    });
}

function promptDelete(ulid: string) {
    deleteMode.value = 'single';
    selectedItemId.value = ulid;
    isConfirmOpen.value = true;
}

function promptClearAll() {
    deleteMode.value = 'all';
    isConfirmOpen.value = true;
}

function tapToDelete() {
    isDeleting.value = true;

    const options = {
        preserveScroll: true,
        onFinish: () => {
            isDeleting.value = false;
            isConfirmOpen.value = false;
            selectedItemId.value = null;
        },
    };

    if (deleteMode.value === 'all') {
        router.delete(schedulesHistory.clear().url, options);
    } else if (selectedItemId.value) {
        router.delete(
            schedules.destroy({ schedule: selectedItemId.value }).url,
            options,
        );
    }
}

// State Tab Aktif untuk Layanan Mobile
const activeTab = ref<'completed' | 'cancelled'>('completed');
</script>

<template>
    <Head title="Riwayat Kegiatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Riwayat Kegiatan"
                description="Arsip seluruh agenda posyandu yang selesai dilakukan"
                variant="small"
            />
            <div class="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="cursor-pointer"
                            :disabled="isLoading"
                            :class="{
                                'border-primary/60 bg-primary/10 font-semibold text-primary':
                                    isFilterApplied,
                            }"
                        >
                            <Loader2
                                v-if="isLoading"
                                class="h-4 w-4 animate-spin text-primary"
                            />
                            <CalendarIcon v-else class="h-4 w-4" />
                            <span class="hidden sm:inline">Filter</span>
                            <ChevronDown class="h-3 w-3 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                    <FilterHistory
                        :filters="props.filters"
                        :is-loading="isLoading"
                        @apply="applyFilter"
                    />
                </DropdownMenu>
                <Button
                    v-if="
                        isAdmin &&
                        (props.completedSchedules.length > 0 ||
                            props.cancelledSchedules.length > 0)
                    "
                    type="button"
                    variant="destructive"
                    class="cursor-pointer"
                    @click="promptClearAll"
                >
                    <Trash2 class="h-4 w-4" />
                    <span class="hidden sm:inline">Hapus Semua</span>
                </Button>
            </div>
        </header>

        <!-- 2. Tabs Untuk Layanan Mobile -->
        <Tabs v-model="activeTab" class="mb-4 lg:hidden">
            <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger
                    value="completed"
                    :count="props.completedSchedules.length"
                    badge-variant="emerald"
                >
                    <CheckCircle2 class="h-3.5 w-3.5" />
                    <span>Selesai</span>
                </TabsTrigger>
                <TabsTrigger
                    value="cancelled"
                    :count="props.cancelledSchedules.length"
                    badge-variant="rose"
                >
                    <XCircle class="h-3.5 w-3.5" />
                    <span>Dibatalkan</span>
                </TabsTrigger>
            </TabsList>
        </Tabs>

        <!-- 3. Grid 2 Kolom Pembungkus Seksi -->
        <div
            class="grid flex-1 grid-cols-1 gap-6 transition-opacity duration-200 lg:grid-cols-2"
            :class="{ 'pointer-events-none opacity-60': isLoading }"
        >
            <section
                aria-label="Daftar Kegiatan Selesai"
                class="flex flex-1 flex-col"
                :class="activeTab === 'completed' ? 'flex' : 'hidden lg:flex'"
            >
                <List>
                    <ListHeader class="hidden lg:flex">
                        <div class="flex items-center gap-2">
                            <CheckCircle2
                                class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                            />
                            <ListTitle>Kegiatan Selesai</ListTitle>
                        </div>
                        <ListBadge variant="emerald">{{
                            props.completedSchedules.length
                        }}</ListBadge>
                    </ListHeader>
                    <HistoryList
                        type="completed"
                        :items="props.completedSchedules"
                        :is-admin="isAdmin"
                        :is-filter-applied="isFilterApplied"
                        @reset="resetFilter"
                        @delete="promptDelete"
                    />
                </List>
            </section>

            <section
                aria-label="Daftar Kegiatan Dibatalkan"
                class="flex flex-1 flex-col"
                :class="activeTab === 'cancelled' ? 'flex' : 'hidden lg:flex'"
            >
                <List>
                    <ListHeader class="hidden lg:flex">
                        <div class="flex items-center gap-2">
                            <XCircle
                                class="h-4 w-4 text-rose-600 dark:text-rose-400"
                            />
                            <ListTitle>Kegiatan Dibatalkan</ListTitle>
                        </div>
                        <ListBadge variant="rose">{{
                            props.cancelledSchedules.length
                        }}</ListBadge>
                    </ListHeader>
                    <HistoryList
                        type="cancelled"
                        :items="props.cancelledSchedules"
                        :is-admin="isAdmin"
                        :is-filter-applied="isFilterApplied"
                        @reset="resetFilter"
                        @delete="promptDelete"
                    />
                </List>
            </section>
        </div>

        <!-- 4. Modal Konfirmasi Hapus -->
        <ConfirmDialog
            :open="isConfirmOpen"
            :processing="isDeleting"
            :title="
                deleteMode === 'all'
                    ? 'Hapus Semua Riwayat?'
                    : 'Hapus Riwayat Kegiatan?'
            "
            :description="
                deleteMode === 'all'
                    ? 'Seluruh data riwayat kegiatan selesai dan dibatalkan akan dihapus permanen.'
                    : 'Kegiatan ini akan dihapus permanen dari arsip riwayat dan tidak dapat dikembalikan.'
            "
            confirm-text="Hapus Kegiatan"
            cancel-text="Batal"
            variant="destructive"
            @update:open="isConfirmOpen = $event"
            @confirm="tapToDelete"
            @cancel="isConfirmOpen = false"
        />
    </div>
</template>
