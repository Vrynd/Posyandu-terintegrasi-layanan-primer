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
                class="h-8.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-white/10 bg-linear-to-b from-zinc-800 via-zinc-900 to-zinc-950 text-white shadow-xs transition-colors hover:bg-zinc-800"
            />
            <HeaderWidgetBar />
        </div>
    </header>
</template>
