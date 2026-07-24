<script setup lang="ts">
import HeaderWidgetBar from '@/components/HeaderWidgetBar.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/70 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-4"
    >
        <div class="flex w-full flex-1 items-center gap-3 overflow-hidden">
            <SidebarTrigger
                class="h-8.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-border/80 bg-background/70 shadow-xs backdrop-blur-md hover:bg-accent dark:border-zinc-800/80 dark:bg-zinc-900/80"
            />
            <HeaderWidgetBar />
        </div>
    </header>
</template>
