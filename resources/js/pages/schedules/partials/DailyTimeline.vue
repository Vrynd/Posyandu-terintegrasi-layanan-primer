<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    Activity,
    ArrowRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Plus,
} from '@lucide/vue';
import EmptyState from '@/components/EmptyState.vue';
import { Button } from '@/components/ui/button';
import { TileGroup, TileItem } from '@/components/ui/tile';
import UserAvatar from '@/components/UserAvatar.vue';
import {
    formatDate,
    formatTimeRange,
    getScheduleStatusLabel,
} from '@/lib/formatters';
import type { ScheduleItem } from '@/types';

defineProps<{
    selectedDate: string;
    schedules: ScheduleItem[];
    isAdmin?: boolean;
}>();

const emit = defineEmits<{
    (e: 'prev-day'): void;
    (e: 'next-day'): void;
    (e: 'go-today'): void;
}>();
</script>

<template>
    <div class="flex h-full flex-col">
        <!-- 1. Header Agenda Harian -->
        <div class="mb-5 flex items-center justify-between">
            <div>
                <h3
                    class="mb-0.5 font-display text-sm font-semibold text-foreground"
                >
                    Agenda Kegiatan
                </h3>
                <p class="text-xs text-muted-foreground">
                    {{
                        formatDate(selectedDate, {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })
                    }}
                </p>
            </div>

            <!-- Navigasi Hari -->
            <div class="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 rounded-full border border-white/10 bg-white/10 text-muted-foreground hover:text-foreground"
                    @click="emit('go-today')"
                >
                    <Calendar class="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 rounded-full border border-white/10 bg-white/10"
                    @click="emit('prev-day')"
                >
                    <ChevronLeft class="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 rounded-full border border-white/10 bg-white/10"
                    @click="emit('next-day')"
                >
                    <ChevronRight class="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>

        <!-- 2. Daftar Kartu Agenda di Tanggal Ini -->
        <div
            v-if="schedules.length > 0"
            class="flex max-h-130 flex-1 flex-col gap-3 overflow-y-auto pr-1"
        >
            <div
                v-for="schedule in schedules"
                :key="schedule.ulid"
                class="group relative flex flex-col gap-3.5 overflow-hidden rounded-xl border border-border/80 bg-muted p-4 dark:bg-muted/30"
            >
                <div class="flex flex-col gap-1">
                    <h4
                        class="line-clamp-2 font-display text-sm font-bold text-foreground"
                    >
                        {{ schedule.title }}
                    </h4>
                    <p
                        v-if="schedule.description"
                        class="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80"
                    >
                        {{ schedule.description }}
                    </p>
                </div>

                <TileGroup
                    class="border-border/40 bg-background text-xs dark:bg-zinc-900/40"
                >
                    <TileItem
                        :icon="Clock"
                        label="Waktu"
                        :value="
                            formatTimeRange(
                                schedule.start_time,
                                schedule.end_time,
                            )
                        "
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    />
                    <TileItem
                        :icon="MapPin"
                        label="Lokasi"
                        :value="schedule.location"
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    />
                    <TileItem
                        :icon="Activity"
                        label="Status"
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    >
                        <span
                            class="font-semibold"
                            :class="{
                                'text-blue-500 dark:text-blue-400':
                                    schedule.status === 'scheduled',
                                'text-amber-500 dark:text-amber-400':
                                    schedule.status === 'ongoing',
                                'text-emerald-500 dark:text-emerald-400':
                                    schedule.status === 'completed',
                                'text-rose-500 dark:text-rose-400':
                                    schedule.status === 'cancelled',
                            }"
                        >
                            {{ getScheduleStatusLabel(schedule.status) }}
                        </span>
                    </TileItem>
                </TileGroup>

                <!-- 5. Footer: Inisial Kader Bertugas & Aksi Arrow Detail -->
                <div
                    class="flex items-center justify-between border-t border-border/40 pt-2.5"
                >
                    <div class="flex min-w-0 items-center gap-2">
                        <UserAvatar
                            :name="schedule.creator?.name ?? 'Kader Posyandu'"
                            size="sm"
                            class="h-6 w-6 text-xs"
                        />
                        <span
                            class="max-w-32 truncate text-xs font-medium text-muted-foreground"
                        >
                            {{ schedule.creator?.name ?? 'Kader Bertugas' }}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7 rounded-full text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground dark:hover:bg-accent/80"
                        as-child
                    >
                        <Link href="#">
                            <ArrowRight class="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>

        <!-- 6. Empty State jika tanggal kosong -->
        <EmptyState
            v-else
            :icon="Calendar"
            title="Tidak ada agenda posyandu"
            description="Tidak ada jadwal kegiatan yang direncanakan pada tanggal ini."
            class="min-h-64 border-border/70 p-6"
        >
            <Button
                v-if="isAdmin"
                variant="outline"
                size="sm"
                class="text-xs font-medium"
                as-child
            >
                <Link href="#">
                    <Plus class="size-4" />
                    Tambah Jadwal
                </Link>
            </Button>
        </EmptyState>
    </div>
</template>
