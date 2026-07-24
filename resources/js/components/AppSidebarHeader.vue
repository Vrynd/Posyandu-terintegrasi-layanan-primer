<script setup lang="ts">
import HeaderWidgetBar from '@/components/HeaderWidgetBar.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-6"
    >
        <div class="flex flex-1 items-center gap-3 overflow-hidden">
            <SidebarTrigger
                class="h-8.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-zinc-700/80 bg-linear-to-r from-zinc-800/90 via-zinc-900 to-zinc-800/90 text-zinc-300 shadow-xs transition-colors hover:border-zinc-600 hover:text-white dark:border-zinc-700/80 dark:from-zinc-800/90 dark:via-zinc-900 dark:to-zinc-800/90"
            />
            <HeaderWidgetBar />
        </div>
    </header>
</template>
