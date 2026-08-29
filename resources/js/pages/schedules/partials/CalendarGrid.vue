<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CalendarDay } from '@/composables/useCalendar';
import { dayNames, monthNames } from '@/lib/date';
import { statusBg } from '@/lib/schedule';
import type { StatusOption } from '@/types';

defineProps<{
    currentMonth: number;
    currentYear: number;
    calendarGrid: CalendarDay[];
    selectedDate: string;
    statuses?: StatusOption[];
}>();

const emit = defineEmits<{
    (e: 'prev-month'): void;
    (e: 'next-month'): void;
    (e: 'go-today'): void;
    (e: 'select-date', dateString: string): void;
    (e: 'jump-to-month', month: number): void;
    (e: 'jump-to-year', year: number): void;
}>();

const yearOptions = computed(() => {
    const now = new Date().getFullYear();
    const years: number[] = [];

    for (let y = now - 10; y <= now + 5; y++) {
        years.push(y);
    }

    return years;
});
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="mb-5 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="0 h-auto py-1.5 font-display text-sm font-semibold tracking-tight text-foreground"
                        >
                            {{ monthNames[currentMonth] }}
                            <ChevronDown
                                class="ml-1 h-4 w-4 text-muted-foreground"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        class="max-h-72 overflow-y-auto"
                    >
                        <DropdownMenuItem
                            v-for="(name, index) in monthNames"
                            :key="index"
                            :class="{
                                'bg-accent font-semibold':
                                    index === currentMonth,
                            }"
                            @click="emit('jump-to-month', index)"
                        >
                            {{ name }}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="h-auto py-1.5 font-display text-sm font-semibold tracking-tight text-foreground"
                        >
                            {{ currentYear }}
                            <ChevronDown
                                class="ml-1 h-4 w-4 text-muted-foreground"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        class="max-h-72 overflow-y-auto"
                    >
                        <DropdownMenuItem
                            v-for="year in yearOptions"
                            :key="year"
                            :class="{
                                'bg-accent font-semibold': year === currentYear,
                            }"
                            @click="emit('jump-to-year', year)"
                        >
                            {{ year }}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div class="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8 rounded-full"
                    @click="emit('prev-month')"
                >
                    <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8 rounded-full"
                    @click="emit('next-month')"
                >
                    <ChevronRight class="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div class="mb-2 grid grid-cols-7 text-center sm:text-left">
            <div
                v-for="day in dayNames"
                :key="day"
                class="py-1 text-xs font-medium tracking-wider text-muted-foreground"
            >
                <span class="sm:hidden">{{ day.slice(0, 3) }}</span>
                <span class="hidden sm:inline">{{ day }}</span>
            </div>
        </div>

        <!-- Grid Kalender (Mengisi Penuh Tinggi Tanpa Ruang Sisa) -->
        <div class="grid flex-1 grid-cols-7 grid-rows-6 gap-1 sm:gap-2">
            <button
                v-for="cell in calendarGrid"
                :key="cell.dateString"
                type="button"
                @click="emit('select-date', cell.dateString)"
                :class="[
                    'group relative flex h-full min-h-14 cursor-pointer flex-col justify-between rounded-xl border border-border p-1 text-left transition-all sm:min-h-18 sm:p-2',
                    cell.dateString === selectedDate
                        ? 'bg-muted/70 shadow-inner dark:bg-muted/60'
                        : cell.isCurrentMonth
                          ? 'bg-muted/40 hover:bg-muted/50'
                          : 'bg-transparent opacity-40 hover:opacity-70',
                ]"
            >
                <!-- Glow Hijau untuk Kegiatan Selesai -->
                <div
                    v-if="
                        cell.schedules.some(
                            (s) => s.effective_status === 'completed',
                        )
                    "
                    class="pointer-events-none absolute inset-0 rounded-xl bg-radial from-emerald-500/15 to-transparent"
                />

                <!-- Glow Merah/Rose untuk Kegiatan Dibatalkan -->
                <div
                    v-else-if="
                        cell.schedules.some(
                            (s) => s.effective_status === 'cancelled',
                        )
                    "
                    class="pointer-events-none absolute inset-0 rounded-xl bg-radial from-rose-500/15 to-transparent"
                />

                <!-- Nomor Tanggal Asli -->
                <div class="flex items-center justify-between">
                    <span
                        :class="[
                            'inline-flex h-5.5 w-5.5 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors sm:h-6.5 sm:w-6.5 sm:text-xs',
                            cell.dateString === selectedDate
                                ? 'border border-white/20 bg-white/20 text-white'
                                : cell.isToday
                                  ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                                  : 'text-foreground',
                        ]"
                    >
                        {{ cell.dayNumber }}
                    </span>
                </div>

                <!-- Indikator Titik (Dots) Sesuai Instruksi -->
                <div
                    v-if="cell.schedules.length > 0"
                    class="mt-auto flex items-center gap-1.5 overflow-hidden pt-1"
                >
                    <span
                        v-for="schedule in cell.schedules.slice(0, 3)"
                        :key="schedule.ulid"
                        class="h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2"
                        :class="statusBg(schedule.effective_status, statuses)"
                    />
                    <span
                        v-if="cell.schedules.length > 3"
                        class="text-[9px] font-medium text-muted-foreground/70"
                    >
                        +{{ cell.schedules.length - 3 }} lainnya
                    </span>
                </div>
            </button>
        </div>
    </div>
</template>
