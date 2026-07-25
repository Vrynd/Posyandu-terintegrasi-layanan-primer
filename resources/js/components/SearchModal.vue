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
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSearchModal } from '@/composables/useSearchModal';

const { isSearchOpen, closeSearchModal } = useSearchModal();

const searchQuery = ref('');

const closeModal = () => {
    closeSearchModal();
    searchQuery.value = '';
};

// Application Search Items
const searchItems = [
    {
        title: 'Dashboard Utama',
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
        href: '/invitations',
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

const filteredSearchItems = computed(() => {
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
    <Dialog
        :open="isSearchOpen"
        @update:open="
            (val) => {
                if (!val) closeSearchModal();
            }
        "
    >
        <DialogContent
            @pointerDownOutside="closeModal"
            class="top-16 max-w-lg translate-y-0 overflow-hidden rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl sm:top-24 [&>button]:hidden"
        >
            <div class="flex items-center gap-2 border-b border-border p-3">
                <div class="relative flex-1">
                    <Search
                        class="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <div
                        class="pointer-events-none absolute top-1/2 left-8 z-10 h-4 w-px -translate-y-1/2 bg-border"
                    />
                    <Input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Cari fitur, menu, atau layanan..."
                        autoFocus
                        class="h-8 w-full rounded-lg border border-border bg-background pr-3 pl-11 text-sm font-medium text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:outline-none"
                    />
                </div>
                <DialogClose
                    class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:text-foreground"
                >
                    <X class="h-4 w-4" />
                </DialogClose>
            </div>

            <div class="no-scrollbar max-h-80 overflow-y-auto p-2">
                <div
                    v-if="filteredSearchItems.length === 0"
                    class="py-8 text-center text-sm text-muted-foreground"
                >
                    Tidak ada menu yang sesuai dengan "{{ searchQuery }}".
                </div>

                <div v-else class="flex flex-col gap-1">
                    <div
                        v-for="item in filteredSearchItems"
                        :key="item.title"
                        @click="navigateTo(item)"
                        :class="[
                            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors',
                            item.isLocked
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/80 dark:hover:text-white',
                        ]"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted"
                            >
                                <component
                                    :is="item.icon"
                                    class="h-4 w-4 text-primary"
                                />
                            </div>
                            <div>
                                <div class="font-medium text-foreground">
                                    {{ item.title }}
                                </div>
                                <div class="text-xs text-muted-foreground">
                                    {{ item.category }}
                                </div>
                            </div>
                        </div>

                        <span
                            v-if="item.isLocked"
                            class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500 dark:text-amber-400"
                        >
                            <Lock class="h-3 w-3" />
                            Segera Hadir
                        </span>
                    </div>
                </div>
            </div>

            <div
                class="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground"
            >
                <span>Posyandu Tondomulyo</span>
                <div class="flex items-center gap-2">
                    <span>
                        Tekan
                        <kbd
                            class="rounded border border-border bg-background px-1 font-mono text-[10px]"
                        >
                            ESC
                        </kbd>
                        untuk menutup
                    </span>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
