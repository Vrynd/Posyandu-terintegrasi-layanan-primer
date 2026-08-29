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
import { formatDate } from '@/lib/date';
import { formatLocation } from '@/lib/schedule';
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
                    <span class="shrink-0">{{
                        item.start_date === item.end_date
                            ? formatDate(item.start_date)
                            : `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`
                    }}</span>
                    <template v-if="item.start_time">
                        <span class="shrink-0">•</span>
                        <span class="shrink-0">{{
                            formatTime(item.start_time)
                        }}</span>
                    </template>
                    <template v-if="item.location">
                        <span class="shrink-0">•</span>
                        <span class="truncate">{{
                            formatLocation(item.location)
                        }}</span>
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

    <!-- 2. Kondisi Kosong (Empty State) -->
    <div v-else class="flex flex-1 items-center justify-center p-4 sm:p-6">
        <EmptyState
            :icon="props.isFilterApplied ? CalendarX2 : Inbox"
            :title="
                props.isFilterApplied
                    ? 'Tidak ada riwayat kegiatan ditemukan'
                    : props.type === 'completed'
                      ? 'Belum ada kegiatan yang selesai'
                      : 'Belum ada kegiatan yang dibatalkan'
            "
            :description="
                props.isFilterApplied
                    ? 'Coba ubah periode bulan atau tahun pada filter di atas untuk melihat data riwayat lainnya.'
                    : props.type === 'completed'
                      ? 'Riwayat kegiatan yang telah selesai dilaksanakan akan diarsipkan secara otomatis di sini.'
                      : 'Riwayat kegiatan yang dibatalkan akan diarsipkan di sini.'
            "
            class="min-h-56 max-w-md border-border/40 p-4 sm:p-6"
        >
            <Button
                v-if="props.isFilterApplied"
                type="button"
                variant="outline"
                size="sm"
                class="mt-1 cursor-pointer text-xs"
                @click="emit('reset')"
            >
                <RotateCcw class="mr-1.5 h-3.5 w-3.5" />
                <span>Reset Filter</span>
            </Button>
        </EmptyState>
    </div>
</template>
