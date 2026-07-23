<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { HeartPulse } from '@lucide/vue';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>


<template>
    <div
        class="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-950 p-6 font-sans text-white antialiased selection:bg-indigo-500 selection:text-white md:p-10">

        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <!-- Glowing Orbs -->
            <div class="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-pink-500/5 blur-3xl"></div>

            <!-- Grid Contour Layer -->
            <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <pattern
                        id="auth-grid-contour-pattern"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse">
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#818CF8"
                            stroke-width="0.6"
                            stroke-opacity="0.12"
                        />
                        <path
                            d="M 0 4 L 0 -4 M -4 0 L 4 0"
                            stroke="#818CF8"
                            stroke-width="0.8"
                            stroke-opacity="0.2"
                        />
                    </pattern>
                    <radialGradient id="auth-grid-fade" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="white" stop-opacity="1" />
                        <stop offset="100%" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <mask id="auth-grid-mask">
                        <rect width="100%" height="100%" fill="url(#auth-grid-fade)" />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#auth-grid-contour-pattern)"
                    mask="url(#auth-grid-mask)"
                />
            </svg>
        </div>

        <div class="relative z-10 flex w-full max-w-md flex-col sm:gap-8 gap-6">
            <div class="flex w-full items-center justify-between">
                <Link
                    :href="home()"
                    class="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-400 to-pink-400 text-white shadow-lg shadow-indigo-500/20">
                        <HeartPulse class="h-5 w-5" />
                    </div>
                    <div class="leading-tight">
                        <span class="block font-display text-sm sm:text-base font-bold tracking-tight leading-tight text-white">
                            Posyandu<br class="sm:hidden" /> <span class="inline">Tondomulyo</span>
                        </span>

                        <span class="hidden sm:block text-xs font-medium text-zinc-400">
                            Integrasi Layanan Primer
                        </span>
                    </div>
                </Link>

                <div class="flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1.5 backdrop-blur-md">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    <span class="text-[11px] whitespace-nowrap font-medium text-zinc-300">
                        Portal Akses Kader
                    </span>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <Card class="rounded-2xl gap-2 py-0 border-zinc-800 bg-zinc-900/90 text-white shadow-2xl backdrop-blur-xl">
                    <CardHeader class="px-6 pt-6 pb-0 text-left sm:px-8">
                        <CardTitle class="font-display text-2xl font-semibold tracking-tight text-white">{{ title }}</CardTitle>
                        <CardDescription class="text-xs text-zinc-400">
                            {{ description }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="px-6 py-6 sm:px-8">
                        <slot />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

