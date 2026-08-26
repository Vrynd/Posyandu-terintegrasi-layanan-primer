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

        <div class="grid grid-cols-7 gap-1 sm:gap-2">
            <button
                v-for="cell in calendarGrid"
                :key="cell.dateString"
                type="button"
                @click="emit('select-date', cell.dateString)"
                :class="[
                    'group relative flex min-h-16 cursor-pointer flex-col rounded-xl border p-1 text-left transition-all sm:min-h-20 sm:p-2',
                    cell.dateString === selectedDate
                        ? 'border border-dashed border-primary bg-blue-500/10 dark:bg-blue-950/40'
                        : cell.isCurrentMonth
                          ? 'border-border bg-muted/40 hover:border-border hover:bg-muted/50'
                          : 'bg-transparant border-border',
                    cell.isToday && cell.dateString !== selectedDate
                        ? 'border border-blue-400/60 bg-muted/20 dark:bg-muted/40'
                        : '',
                ]"
            >
                <div
                    v-if="
                        cell.schedules.some(
                            (s) => s.effective_status === 'completed',
                        )
                    "
                    class="pointer-events-none absolute inset-0 rounded-xl bg-radial from-emerald-500/15 to-transparent"
                />
                <div class="flex items-center justify-between">
                    <span
                        :class="[
                            'inline-flex h-5.5 w-5.5 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors sm:h-6.5 sm:w-6.5 sm:text-xs',
                            cell.dateString === selectedDate
                                ? 'border border-white/15 bg-white/10 text-white'
                                : cell.isToday
                                  ? 'border border-white/10 bg-white/10 text-white'
                                  : 'text-foreground',
                        ]"
                    >
                        {{ cell.dayNumber }}
                    </span>
                </div>

                <div class="mt-auto flex flex-col gap-1 overflow-hidden pt-1">
                    <div
                        v-for="schedule in cell.schedules.slice(0, 2)"
                        :key="schedule.ulid"
                        class="flex items-center gap-1.5 overflow-hidden"
                    >
                        <span
                            class="h-2.5 w-0.5 shrink-0 rounded-full"
                            :class="
                                statusBg(schedule.effective_status, statuses)
                            "
                        />
                        <span
                            class="truncate text-[10px] font-medium text-muted-foreground/90 group-hover:text-foreground"
                        >
                            {{ schedule.title }}
                        </span>
                    </div>
                    <span
                        v-if="cell.schedules.length > 2"
                        class="text-[9px] font-medium text-muted-foreground/70"
                    >
                        +{{ cell.schedules.length - 2 }} lainnya
                    </span>
                </div>
            </button>
        </div>
    </div>
</template>
