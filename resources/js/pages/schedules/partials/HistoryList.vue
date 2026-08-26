<script setup lang="ts">
import { MoreVertical, Trash2 } from '@lucide/vue';
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

export interface HistoryItem {
    id: number | string;
    title: string;
    date: string;
    time: string;
    location: string;
}

const props = defineProps<{
    items: HistoryItem[];
}>();

const emit = defineEmits<{
    (e: 'delete', id: number | string): void;
}>();
</script>

<template>
    <ListContent>
        <ListItem v-for="item in props.items" :key="item.id">
            <div class="flex min-w-0 flex-col gap-1 pr-2">
                <ListItemTitle>
                    {{ item.title }}
                </ListItemTitle>
                <ListItemMeta>
                    <span>{{ item.date }}</span>
                    <span>•</span>
                    <span>{{ item.time }}</span>
                    <span>•</span>
                    <span>{{ item.location }}</span>
                </ListItemMeta>
            </div>

            <ListItemAction>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="size-8 shrink-0 border border-transparent text-muted-foreground hover:border-white/10 hover:text-foreground dark:hover:bg-white/10"
                        >
                            <MoreVertical class="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            class="cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                            @click="emit('delete', item.id)"
                        >
                            <Trash2 class="h-4 w-4" />
                            <span>Hapus</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ListItemAction>
        </ListItem>
    </ListContent>
</template>
