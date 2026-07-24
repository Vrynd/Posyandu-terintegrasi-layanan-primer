<script setup lang="ts">
import { Bell, Calendar, Clock, Search } from '@lucide/vue';
import SearchModal from '@/components/SearchModal.vue';
import { useDateTime } from '@/composables/useDateTime';
import { useSearchModal } from '@/composables/useSearchModal';

const { currentTime, currentDate } = useDateTime();
const { openSearchModal } = useSearchModal();
</script>

<template>
    <div class="flex w-full items-center justify-between gap-2 py-1 sm:gap-3">
        <div class="hidden shrink-0 items-center gap-2 md:flex">
            <div
                class="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-linear-to-r from-zinc-800/90 via-zinc-900 to-zinc-800/90 px-3.5 py-2 text-xs font-medium text-zinc-100 shadow-xs dark:border-zinc-700/80 dark:from-zinc-800/90 dark:via-zinc-900 dark:to-zinc-800/90"
            >
                <Calendar class="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                <span>{{ currentDate }}</span>
            </div>
        </div>

        <div class="flex flex-1 items-center justify-center px-1">
            <div
                @click="openSearchModal"
                class="group relative flex w-full cursor-pointer items-center"
            >
                <Search
                    class="absolute left-3.5 z-10 h-3.5 w-3.5 shrink-0 text-zinc-400 transition-colors group-hover:text-white"
                />
                <input
                    type="text"
                    readonly
                    placeholder="Cari data peserta, pemeriksaan..."
                    @click="openSearchModal"
                    class="h-8.5 w-full cursor-pointer rounded-full border border-zinc-700/80 bg-linear-to-r from-zinc-800/90 via-zinc-900 to-zinc-800/90 pr-14 pl-9 text-xs font-medium text-zinc-100 shadow-xs transition-all group-hover:border-zinc-600 placeholder:text-zinc-400 dark:border-zinc-700/80 dark:from-zinc-800/90 dark:via-zinc-900 dark:to-zinc-800/90"
                />
                <kbd
                    class="pointer-events-none absolute right-2.5 z-10 hidden rounded-md border border-zinc-700/80 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-400 shadow-2xs select-none sm:inline-block"
                >
                    Ctrl+K
                </kbd>
            </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <div
                class="hidden items-center gap-2 rounded-full border border-zinc-700/80 bg-linear-to-r from-zinc-800/90 via-zinc-900 to-zinc-800/90 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-400 shadow-xs md:inline-flex dark:border-zinc-700/80 dark:from-zinc-800/90 dark:via-zinc-900 dark:to-zinc-800/90"
            >
                <span class="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                    />
                    <span
                        class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                </span>
                <Clock class="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>{{ currentTime }}</span>
            </div>

            <button
                type="button"
                class="relative flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-700/80 bg-linear-to-r from-zinc-800/90 via-zinc-900 to-zinc-800/90 text-zinc-300 shadow-xs transition-colors hover:border-zinc-600 hover:text-white dark:border-zinc-700/80 dark:from-zinc-800/90 dark:via-zinc-900 dark:to-zinc-800/90"
                title="Notifikasi Sistem"
            >
                <Bell class="h-3.5 w-3.5" />
                <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
                    />
                    <span
                        class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"
                    />
                </span>
            </button>
        </div>
    </div>

    <SearchModal />
</template>
