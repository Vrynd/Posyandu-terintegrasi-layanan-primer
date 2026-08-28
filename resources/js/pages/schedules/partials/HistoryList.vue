<script setup lang="ts">
import {
    CalendarX2,
    Inbox,
    MoreHorizontal,
    MoreVertical,
    RotateCcw,
    Trash2,
} from '@lucide/vue';
import EmptyState from '@/components/EmptyState.vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ListContent,
    ListItem,
    ListItemAction,
    ListItemMeta,
    ListItemTitle,
} from '@/components/ui/list';
import type { ScheduleItem } from '@/types';

const props = withDefaults(
    defineProps<{
        items: ScheduleItem[];
        isAdmin?: boolean;
        type?: 'completed' | 'cancelled';
        isFilterApplied?: boolean;
    }>(),
    {
        isAdmin: false,
        type: 'completed',
        isFilterApplied: false,
    },
);

const emit = defineEmits<{
    (e: 'delete', ulid: string): void;
    (e: 'reset'): void;
}>();

const formatDate = (dateStr: string) => {
    if (!dateStr) {
        return '-';
    }

    const date = new Date(dateStr);

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const formatTime = (timeStr?: string | null) => {
    if (!timeStr) {
        return '';
    }

    return timeStr.slice(0, 5) + ' WIB';
};
</script>

<template>
    <!-- 1. Kondisi Ada Data Riwayat -->
    <ListContent v-if="props.items.length > 0">
        <ListItem
            v-for="item in props.items"
            :key="item.id"
            class="items-start lg:items-center"
        >
            <div class="flex min-w-0 flex-1 flex-col gap-1 pr-2">
                <ListItemTitle>
                    {{ item.title }}
                </ListItemTitle>
                <ListItemMeta class="w-full min-w-0 truncate">
                    <span class="shrink-0">{{ formatDate(item.date) }}</span>
                    <template v-if="item.start_time">
                        <span class="shrink-0">•</span>
                        <span class="shrink-0">{{
                            formatTime(item.start_time)
                        }}</span>
                    </template>
                    <template v-if="item.location">
                        <span class="shrink-0">•</span>
                        <span class="truncate">{{ item.location }}</span>
                    </template>
                </ListItemMeta>
            </div>

            <ListItemAction v-if="isAdmin" class="mt-0.5 lg:mt-0">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors outline-none hover:border-white/10 hover:bg-white/10 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <MoreHorizontal class="h-4 w-4 lg:hidden" />
                        <MoreVertical class="hidden h-4 w-4 lg:block" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            variant="destructive"
                            class="cursor-pointer"
                            @click="emit('delete', item.ulid)"
                        >
                            <Trash2 class="mr-2 h-4 w-4" />
                            <span>Hapus</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ListItemAction>
        </ListItem>
    </ListContent>

    <!-- 2. Kondisi Kosong (Empty State Mandiri) -->
    <EmptyState
        v-else
        :icon="props.isFilterApplied ? CalendarX2 : Inbox"
        :title="
            props.isFilterApplied
                ? props.type === 'completed'
                    ? 'Tidak Ada Kegiatan Selesai'
                    : 'Tidak Ada Kegiatan Dibatalkan'
                : props.type === 'completed'
                  ? 'Belum Ada Kegiatan Selesai'
                  : 'Tidak Ada Kegiatan Dibatalkan'
        "
        :description="
            props.isFilterApplied
                ? props.type === 'completed'
                    ? 'Tidak ditemukan arsip kegiatan selesai pada periode filter ini.'
                    : 'Tidak ada agenda kegiatan yang dibatalkan pada periode filter ini.'
                : props.type === 'completed'
                  ? 'Kegiatan posyandu yang telah selesai dilaksanakan akan otomatis terarsip di sini.'
                  : 'Saat ini belum ada agenda kegiatan posyandu yang dibatalkan.'
        "
        class="min-h-56 border-border/70 p-6"
    >
        <Button
            v-if="props.isFilterApplied"
            variant="outline"
            size="sm"
            class="cursor-pointer gap-1.5 text-xs"
            @click="emit('reset')"
        >
            <RotateCcw class="h-3 w-3" />
            <span>Kembali ke Bulan Ini</span>
        </Button>
    </EmptyState>
</template>
