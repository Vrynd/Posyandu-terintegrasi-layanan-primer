<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { CheckCircle2, XCircle } from '@lucide/vue';
import { ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import { List, ListBadge, ListHeader, ListTitle } from '@/components/ui/list';
import { dashboard } from '@/routes';
import { index as scheduleIndex } from '@/routes/schedules';
import HistoryList from './partials/HistoryList.vue';
import type { HistoryItem } from './partials/HistoryList.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Jadwal Kegiatan', href: scheduleIndex() },
            { title: 'Riwayat Kegiatan' },
        ],
    },
});

// Data Dummy Sementara
const completedItems = ref<HistoryItem[]>([
    {
        id: 1,
        title: 'Posyandu Lansia & Skrining PTM',
        date: '24 Agt 2026',
        time: '08:30 WIB',
        location: 'Balai Pertemuan RW 03',
    },
    {
        id: 2,
        title: 'Kelas Edukasi PMT Balita Gizi Kurang',
        date: '22 Agt 2026',
        time: '13:00 WIB',
        location: 'Posyandu Mawar RW 03',
    },
]);

const cancelledItems = ref<HistoryItem[]>([
    {
        id: 3,
        title: 'Senam Kebugaran Jasmani Lansia RW 02',
        date: '20 Agt 2026',
        time: '06:30 WIB',
        location: 'Lapangan RW 02',
    },
    {
        id: 4,
        title: 'Penyuluhan Kesehatan Reproduksi Remaja',
        date: '18 Agt 2026',
        time: '09:00 WIB',
        location: 'Aula Kantor Kelurahan',
    },
]);

// 1. State untuk Kontrol Modal Konfirmasi
const isConfirmOpen = ref(false);
const selectedItemId = ref<number | string | null>(null);

// 2. Fungsi saat tombol hapus pada baris item diklik (Membuka Modal)
const promptDelete = (id: number | string) => {
    selectedItemId.value = id;
    isConfirmOpen.value = true;
};

// 3. Fungsi saat tombol "Hapus Kegiatan" pada modal dikonfirmasi
const tapToDelete = () => {
    if (selectedItemId.value) {
        completedItems.value = completedItems.value.filter(
            (item) => item.id !== selectedItemId.value,
        );
        cancelledItems.value = cancelledItems.value.filter(
            (item) => item.id !== selectedItemId.value,
        );
    }

    isConfirmOpen.value = false;
    selectedItemId.value = null;
};

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
                description="Arsip seluruh agenda posyandu yang telah selesai"
                variant="small"
            />
        </header>

        <div
            class="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 lg:hidden"
        >
            <button
                type="button"
                class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all"
                :class="
                    activeTab === 'completed'
                        ? 'bg-card text-foreground shadow-2xs dark:bg-zinc-800'
                        : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeTab = 'completed'"
            >
                <CheckCircle2
                    class="h-3.5 w-3.5"
                    :class="
                        activeTab === 'completed'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-muted-foreground'
                    "
                />
                <span>Selesai</span>
                <span
                    class="inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    :class="
                        activeTab === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                    "
                >
                    {{ completedItems.length }}
                </span>
            </button>
            <button
                type="button"
                class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all"
                :class="
                    activeTab === 'cancelled'
                        ? 'bg-card text-foreground shadow-2xs dark:bg-zinc-800'
                        : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeTab = 'cancelled'"
            >
                <XCircle
                    class="h-3.5 w-3.5"
                    :class="
                        activeTab === 'cancelled'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-muted-foreground'
                    "
                />
                <span>Dibatalkan</span>
                <span
                    class="inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    :class="
                        activeTab === 'cancelled'
                            ? 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/25 dark:text-rose-400'
                            : 'bg-muted text-muted-foreground'
                    "
                >
                    {{ cancelledItems.length }}
                </span>
            </button>
        </div>

        <!-- 2. Grid 2 Kolom Pembungkus Seksi -->
        <div class="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
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
                            completedItems.length
                        }}</ListBadge>
                    </ListHeader>
                    <HistoryList
                        :items="completedItems"
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
                            cancelledItems.length
                        }}</ListBadge>
                    </ListHeader>
                    <HistoryList
                        :items="cancelledItems"
                        @delete="promptDelete"
                    />
                </List>
            </section>
        </div>

        <ConfirmDialog
            :open="isConfirmOpen"
            title="Hapus Riwayat Kegiatan?"
            description="Kegiatan ini akan dihapus permanen dari arsip riwayat dan tidak dapat dikembalikan."
            confirm-text="Hapus Kegiatan"
            cancel-text="Batal"
            variant="destructive"
            @update:open="isConfirmOpen = $event"
            @confirm="tapToDelete"
            @cancel="isConfirmOpen = false"
        />
    </div>
</template>
