<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Clock } from '@lucide/vue';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import type { NavGroup, NavItem } from '@/types';

defineProps<{
    items?: NavItem[];
    groups?: NavGroup[];
}>();

const { isCurrentUrl } = useCurrentUrl();
</script>

<template>
    <template v-if="groups && groups.length > 0">
        <SidebarGroup
            v-for="group in groups"
            :key="group.title"
            class="px-2 py-1"
        >
            <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem v-for="item in group.items" :key="item.title">
                    <SidebarMenuButton
                        as-child
                        :is-active="isCurrentUrl(item.href)"
                        :tooltip="
                            item.isLocked
                                ? `${item.title} (Segera Hadir)`
                                : item.title
                        "
                        :class="[
                            item.isLocked ? 'opacity-70' : '',
                            isCurrentUrl(item.href)
                                ? 'border border-zinc-300/80 bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 font-semibold text-zinc-900 shadow-xs dark:border-zinc-700/60 dark:from-zinc-800 dark:via-zinc-800/80 dark:to-zinc-900 dark:text-white'
                                : '',
                        ]"
                    >
                        <Link :href="item.isLocked ? '#' : item.href">
                            <component :is="item.icon" />
                            <span>{{ item.title }}</span>
                            <Clock
                                v-if="item.isLocked"
                                class="ml-auto h-3 w-3 text-muted-foreground/70"
                            />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    </template>

    <template v-else-if="items && items.length > 0">
        <SidebarGroup class="px-2 py-1">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem v-for="item in items" :key="item.title">
                    <SidebarMenuButton
                        as-child
                        :is-active="isCurrentUrl(item.href)"
                        :tooltip="
                            item.isLocked
                                ? `${item.title} (Segera Hadir)`
                                : item.title
                        "
                        :class="[
                            item.isLocked ? 'opacity-70' : '',
                            isCurrentUrl(item.href)
                                ? 'border border-zinc-300/80 bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 font-semibold text-zinc-900 shadow-xs dark:border-zinc-700/60 dark:from-zinc-800 dark:via-zinc-800/80 dark:to-zinc-900 dark:text-white'
                                : '',
                        ]"
                    >
                        <Link :href="item.isLocked ? '#' : item.href">
                            <component :is="item.icon" />
                            <span>{{ item.title }}</span>
                            <Clock
                                v-if="item.isLocked"
                                class="ml-auto h-3 w-3 text-muted-foreground/70"
                            />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    </template>
</template>
