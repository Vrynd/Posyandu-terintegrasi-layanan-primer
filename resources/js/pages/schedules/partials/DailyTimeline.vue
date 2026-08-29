<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import {
    Activity,
    ArrowRight,
    Ban,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Plus,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import { Button } from '@/components/ui/button';
import { TileGroup, TileItem } from '@/components/ui/tile';
import { formatDate, formatTime } from '@/lib/date';
import { formatLocation, formatStatus, statusText } from '@/lib/schedule';
import { updateStatus } from '@/routes/schedules';
import type { LocationOption, ScheduleItem, StatusOption } from '@/types';

const props = defineProps<{
    selectedDate: string;
    schedules: ScheduleItem[];
    isAdmin?: boolean;
    statuses?: StatusOption[];
    locations?: LocationOption[];
}>();

const emit = defineEmits<{
    (e: 'prev-day'): void;
    (e: 'next-day'): void;
    (e: 'go-today'): void;
    (e: 'create-schedule', date: string): void;
}>();

// Tanggal hari ini lokal YYYY-MM-DD
const todayDate = computed(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
});

// Cek apakah tanggal yang sedang dipilih sudah lewat dari hari ini
const isPastDate = computed(() => props.selectedDate < todayDate.value);

const processingUlid = ref<string | null>(null);

const updateActivityStatus = (schedule: ScheduleItem, targetStatus: string) => {
    processingUlid.value = schedule.ulid;

    router.patch(
        updateStatus.url(schedule.ulid),
        { status: targetStatus },
        {
            preserveScroll: true,
            onFinish: () => {
                processingUlid.value = null;
            },
        },
    );
};
</script>

<template>
    <div class="flex h-full flex-col">
        <!-- Header Timeline Asli (Sesuai Desain Awal) -->
        <div class="mb-5 flex shrink-0 items-center justify-between">
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

            <div class="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 cursor-pointer rounded-full border border-white/10 bg-white/10 text-muted-foreground hover:text-foreground"
                    title="Hari ini"
                    @click="emit('go-today')"
                >
                    <Calendar class="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 cursor-pointer rounded-full border border-white/10 bg-white/10 text-muted-foreground hover:text-foreground"
                    @click="emit('prev-day')"
                >
                    <ChevronLeft class="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 cursor-pointer rounded-full border border-white/10 bg-white/10 text-muted-foreground hover:text-foreground"
                    @click="emit('next-day')"
                >
                    <ChevronRight class="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>

        <!-- Daftar Kegiatan -->
        <div
            v-if="schedules.length > 0"
            class="flex max-h-143 flex-1 flex-col gap-3 overflow-y-auto pr-1.5"
        >
            <div
                v-for="schedule in schedules"
                :key="schedule.ulid"
                class="group relative flex shrink-0 flex-col gap-3.5 rounded-xl border border-border/80 bg-muted p-4 dark:bg-muted/30"
            >
                <div class="flex flex-col gap-1">
                    <h4
                        class="line-clamp-2 font-display text-sm font-bold text-foreground"
                    >
                        {{ schedule.title }}
                    </h4>
                </div>

                <TileGroup
                    class="border-border/40 bg-background text-xs dark:bg-zinc-900/40"
                >
                    <TileItem
                        :icon="Clock"
                        label="Waktu"
                        :value="
                            formatTime(schedule.start_time, schedule.end_time)
                        "
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    />

                    <!-- Lokasi dengan Format Label Asli -->
                    <TileItem
                        :icon="MapPin"
                        label="Lokasi"
                        :value="
                            formatLocation(schedule.location, props.locations)
                        "
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    />

                    <TileItem
                        :icon="Activity"
                        label="Status"
                        :value="
                            formatStatus(schedule.effective_status, statuses)
                        "
                        class="px-3 py-2 text-xs"
                        icon-class="h-3.5 w-3.5 text-muted-foreground"
                    >
                        <span
                            class="font-semibold"
                            :class="
                                statusText(schedule.effective_status, statuses)
                            "
                        >
                            {{
                                formatStatus(
                                    schedule.effective_status,
                                    statuses,
                                )
                            }}
                        </span>
                    </TileItem>
                </TileGroup>

                <div
                    class="flex items-center justify-between border-t border-border/40 pt-2.5"
                >
                    <div class="flex items-center">
                        <!-- 1. Jika Telah Selesai (Effective Status Selesai) -->
                        <span
                            v-if="
                                schedule.effective_status === 'completed' ||
                                schedule.status === 'completed'
                            "
                            class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                            <Check class="h-3.5 w-3.5" />
                            Kegiatan Telah Selesai
                        </span>

                        <!-- 2. Jika Dibatalkan -->
                        <span
                            v-else-if="
                                schedule.effective_status === 'cancelled' ||
                                schedule.status === 'cancelled'
                            "
                            class="flex items-center gap-1.5 text-xs font-medium text-rose-500"
                        >
                            <Ban class="h-3.5 w-3.5" />
                            Kegiatan Dibatalkan
                        </span>

                        <!-- 3. Jika Sedang Berlangsung: Tombol Tandai Selesai -->
                        <Button
                            v-else-if="schedule.effective_status === 'ongoing'"
                            variant="outline"
                            size="sm"
                            class="h-7 cursor-pointer border-emerald-500/30 px-2.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                            :disabled="processingUlid === schedule.ulid"
                            @click.stop="
                                updateActivityStatus(schedule, 'completed')
                            "
                        >
                            <Check class="mr-1.5 h-3.5 w-3.5" />
                            Tandai Selesai
                        </Button>

                        <!-- 4. Jika Masih Terjadwal: Tombol Batalkan Kegiatan -->
                        <Button
                            v-else-if="
                                schedule.effective_status === 'scheduled'
                            "
                            variant="outline"
                            size="sm"
                            class="h-7 cursor-pointer border-rose-500/30 px-2.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400"
                            :disabled="processingUlid === schedule.ulid"
                            @click.stop="
                                updateActivityStatus(schedule, 'cancelled')
                            "
                        >
                            <Ban class="mr-1.5 h-3.5 w-3.5" />
                            Batalkan Kegiatan
                        </Button>
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

        <EmptyState
            v-else
            :icon="Calendar"
            title="Tidak ada agenda posyandu"
            :description="
                isPastDate
                    ? 'Tidak ada agenda kegiatan pada tanggal ini karena periode waktu telah berlalu.'
                    : 'Tidak ada jadwal kegiatan yang direncanakan pada tanggal ini.'
            "
            class="min-h-64 border-border/70 p-6"
        >
            <!-- Tombol Tambah Jadwal hanya muncul jika tanggal hari ini atau masa depan (bukan tanggal lampau) -->
            <Button
                v-if="isAdmin && !isPastDate"
                type="button"
                variant="outline"
                size="sm"
                class="cursor-pointer gap-1.5 text-xs font-medium"
                @click="emit('create-schedule', selectedDate)"
            >
                <Plus class="size-4" />
                <span>Tambah Jadwal</span>
            </Button>
        </EmptyState>
    </div>
</template>
