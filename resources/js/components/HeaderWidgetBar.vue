<script setup lang="ts">
import { Calendar, Clock, Moon, Search, Sun } from '@lucide/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/composables/useAppearance';

const { appearance, updateAppearance } = useAppearance();

const toggleTheme = () => {
    updateAppearance(appearance.value === 'dark' ? 'light' : 'dark');
};

// Dynamic Real-time Clock & Indonesian Date
const currentTime = ref('');
const currentDate = ref('');

const updateDateTime = () => {
    const now = new Date();

    // Format time: HH:mm:ss
    currentTime.value = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    // Format date: Jumat, 24 Jul 2026
    currentDate.value = now.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

let timer: ReturnType<typeof setInterval>;

onMounted(() => {
    updateDateTime();
    timer = setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});
</script>

<template>
    <div class="flex w-full items-center justify-between gap-3 py-1">
        <!-- KELOMPOK KIRI: Tanggal & Bulan -->
        <div class="flex shrink-0 items-center gap-2">
            <!-- 1. [Tanggal & Bulan] -->
            <div
                class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3.5 py-2 text-xs font-medium text-foreground shadow-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80"
            >
                <Calendar
                    class="h-3.5 w-3.5 shrink-0 text-indigo-500 dark:text-indigo-400"
                />
                <span>{{ currentDate }}</span>
            </div>
        </div>

        <!-- KELOMPOK TENGAH: Pencarian Melebar Pas Tanpa Celah Lengang -->
        <div class="flex flex-1 items-center justify-center px-1">
            <div class="relative w-full">
                <Search
                    class="absolute top-1/2 left-3 h-3.5 w-3.5 shrink-0 -translate-y-1/2 text-muted-foreground"
                />
                <input
                    type="text"
                    placeholder="Cari data peserta, pemeriksaan..."
                    class="h-8.5 w-full rounded-full border border-border/80 bg-background/70 pr-14 pl-8.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-md transition-all placeholder:text-muted-foreground/70 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800/80 dark:bg-zinc-900/80"
                />
                <kbd
                    class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs select-none dark:border-zinc-800"
                >
                    Ctrl+K
                </kbd>
            </div>
        </div>

        <!-- KELOMPOK KANAN: Waktu Live & Toggle Tema -->
        <div class="flex shrink-0 items-center gap-2">
            <!-- 2. [Waktu Live] -->
            <div
                class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-600 shadow-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-emerald-400"
            >
                <span class="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                    />
                    <span
                        class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                </span>
                <Clock class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>{{ currentTime }}</span>
            </div>

            <!-- 3. [Toggle Tema] -->
            <Button
                type="button"
                variant="outline"
                size="icon"
                @click="toggleTheme"
                class="h-8.5 w-8.5 shrink-0 cursor-pointer rounded-full border-border/80 bg-background/70 shadow-xs backdrop-blur-md hover:bg-accent dark:border-zinc-800/80 dark:bg-zinc-900/80"
                title="Ganti Mode Gelap / Terang"
            >
                <Sun
                    v-if="appearance === 'dark'"
                    class="h-3.5 w-3.5 text-amber-400"
                />
                <Moon v-else class="h-3.5 w-3.5 text-indigo-500" />
            </Button>
        </div>
    </div>
</template>
