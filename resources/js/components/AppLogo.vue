<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-pink-500 text-white shadow-md shadow-indigo-500/20"
    >
        <AppLogoIcon class="size-4 stroke-[2.5] text-white" />
    </div>
    <div class="ml-1.5 grid flex-1 text-left text-sm leading-tight">
        <span
            class="truncate font-display font-bold tracking-tight text-foreground"
        >
            Posyandu Tondomulyo
        </span>
        <span class="truncate text-[10px] font-medium text-muted-foreground">
            Sistem Layanan Primer
        </span>
    </div>
</template>
