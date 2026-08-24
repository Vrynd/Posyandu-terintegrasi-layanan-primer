<script setup lang="ts">
import { Activity, CalendarCheck2, CalendarClock } from '@lucide/vue';
import { computed } from 'vue';
import type { ScheduleItem } from '@/types';
import ScheduleCard from './ScheduleCard.vue';

const props = defineProps<{
    schedules: ScheduleItem[];
    isAdmin?: boolean;
}>();

// 3 Kolom Status Utama (Happy Path Operasional Posyandu)
const columns = [
    {
        key: 'scheduled',
        label: 'Terjadwal',
        icon: CalendarClock,
        color: 'text-blue-600 dark:text-blue-400',
        bgBadge:
            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
        borderCol: 'border-t-blue-500',
    },
    {
        key: 'ongoing',
        label: 'Sedang Berlangsung',
        icon: Activity,
        color: 'text-amber-600 dark:text-amber-400',
        bgBadge:
            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        borderCol: 'border-t-amber-500',
    },
    {
        key: 'completed',
        label: 'Selesai',
        icon: CalendarCheck2,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgBadge:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        borderCol: 'border-t-emerald-500',
    },
];

// Kelompokkan kegiatan berdasarkan 3 status aktif
const columnData = computed(() => {
    return columns.map((col) => ({
        ...col,
        items: props.schedules.filter((s) => s.status === col.key),
    }));
});
</script>

<template>
    <!-- Layout Grid 3 Kolom Lega & Simetris -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
            v-for="col in columnData"
            :key="col.key"
            class="flex flex-col rounded-xl border border-t-4 border-border/70 bg-muted/30 p-3.5 shadow-xs dark:bg-zinc-950/40"
            :class="col.borderCol"
        >
            <!-- Header Kolom -->
            <div class="mb-3.5 flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <component
                        :is="col.icon"
                        class="h-4 w-4"
                        :class="col.color"
                    />
                    <span
                        class="text-sm font-semibold tracking-tight text-foreground"
                    >
                        {{ col.label }}
                    </span>
                </div>
                <span
                    class="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold"
                    :class="col.bgBadge"
                >
                    {{ col.items.length }}
                </span>
            </div>

            <!-- Daftar Kartu Jadwal di Kolom -->
            <div class="flex flex-1 flex-col gap-2.5 overflow-y-auto">
                <ScheduleCard
                    v-for="schedule in col.items"
                    :key="schedule.ulid"
                    :schedule="schedule"
                    :is-admin="isAdmin"
                />

                <!-- Empty State jika kolom kosong -->
                <div
                    v-if="col.items.length === 0"
                    class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground/70"
                >
                    Tidak ada kegiatan {{ col.label.toLowerCase() }}
                </div>
            </div>
        </div>
    </div>
</template>
