<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    BookOpen,
    FileText,
    HeartHandshake,
    LayoutDashboard,
    Lock,
    Search,
    Shield,
    UserCheck,
    X,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useSearchModal } from '@/composables/useSearchModal';

const { isSearchOpen, closeSearchModal } = useSearchModal();
const searchQuery = ref('');

const closeModal = () => {
    closeSearchModal();
    searchQuery.value = '';
};

const searchItems = [
    {
        title: 'Dashboard',
        category: 'Utama',
        href: '/dashboard',
        icon: LayoutDashboard,
        isLocked: false,
    },
    {
        title: 'Statistik Posyandu',
        category: 'Utama',
        href: '#',
        icon: Activity,
        isLocked: true,
    },
    {
        title: 'Pendaftaran Peserta',
        category: 'Pelayanan',
        href: '#',
        icon: UserCheck,
        isLocked: true,
    },
    {
        title: 'Pemeriksaan Kesehatan',
        category: 'Pelayanan',
        href: '#',
        icon: FileText,
        isLocked: true,
    },
    {
        title: 'Monitoring Stunting',
        category: 'Pelayanan',
        href: '#',
        icon: Activity,
        isLocked: true,
    },
    {
        title: 'Kelola Kode Undangan',
        category: 'Manajemen Sistem',
        href: '#',
        icon: Shield,
        isLocked: false,
    },
    {
        title: 'Pengaduan Bug & Masalah',
        category: 'Dukungan',
        href: '#',
        icon: HeartHandshake,
        isLocked: false,
    },
    {
        title: 'Panduan & Bantuan',
        category: 'Dukungan',
        href: '#',
        icon: BookOpen,
        isLocked: true,
    },
];

const filteredSearch = computed(() => {
    if (!searchQuery.value.trim()) {
        return searchItems;
    }

    const q = searchQuery.value.toLowerCase();

    return searchItems.filter(
        (item) =>
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q),
    );
});

const navigateTo = (item: (typeof searchItems)[0]) => {
    if (item.isLocked) {
        return;
    }

    closeModal();
    router.visit(item.href);
};

watch(isSearchOpen, (newVal) => {
    if (newVal) {
        searchQuery.value = '';
    }
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isSearchOpen"
            class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
        >
            <div
                @click="closeModal"
                class="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
            />
            <div
                class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 text-white shadow-2xl transition-all"
            >
                <div
                    class="flex items-center border-b border-zinc-800 px-4 py-3"
                >
                    <Search class="mr-3 h-4 w-4 shrink-0 text-zinc-400" />
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Cari fitur, menu, atau layanan..."
                        autoFocus
                        class="w-full bg-transparent text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-hidden"
                    />
                    <button
                        type="button"
                        @click="closeModal"
                        class="ml-2 rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <div class="no-scrollbar max-h-80 overflow-y-auto p-2">
                    <div
                        v-if="filteredSearch.length === 0"
                        class="py-8 text-center text-sm text-zinc-400"
                    >
                        Tidak ada menu yang sesuai dengan "{{ searchQuery }}".
                    </div>

                    <div v-else class="flex flex-col gap-1">
                        <div
                            v-for="item in filteredSearch"
                            :key="item.title"
                            @click="navigateTo(item)"
                            :class="[
                                'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors',
                                item.isLocked
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer hover:bg-zinc-800',
                            ]"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950"
                                >
                                    <component
                                        :is="item.icon"
                                        class="h-4 w-4 text-indigo-400"
                                    />
                                </div>
                                <div>
                                    <div class="font-medium text-white">
                                        {{ item.title }}
                                    </div>
                                    <div class="text-xs text-zinc-400">
                                        {{ item.category }}
                                    </div>
                                </div>
                            </div>

                            <span
                                v-if="item.isLocked"
                                class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400"
                            >
                                <Lock class="h-3 w-3" />
                                Segera Hadir
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-400"
                >
                    <span>Posyandu Tondomulyo</span>
                    <div class="flex items-center gap-2">
                        <span
                            >Tekan
                            <kbd
                                class="rounded border border-zinc-700/80 bg-zinc-900 px-1 font-mono text-[10px]"
                                >ESC</kbd
                            >
                            untuk menutup</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
