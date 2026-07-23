<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { HeartPulse } from '@lucide/vue';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-950 p-6 font-sans text-white antialiased selection:bg-indigo-500 selection:text-white md:p-10"
    >
        <!-- Ambient Grid Background (DESIGN.md) -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
                class="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl"
            ></div>
            <div
                class="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-pink-500/5 blur-3xl"
            ></div>

            <!-- Grid Contour Layer -->
            <svg class="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
                <defs>
                    <pattern
                        id="auth-simple-grid-contour"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 32 0 L 0 0 0 32"
                            fill="none"
                            stroke="#818CF8"
                            stroke-width="0.5"
                            stroke-opacity="0.1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#auth-simple-grid-contour)" />
            </svg>
        </div>

        <div class="relative z-10 w-full max-w-sm">
            <div class="flex flex-col gap-6">
                <!-- Brand Emblem Header -->
                <div class="flex flex-col items-center gap-3">
                    <Link
                        :href="home()"
                        class="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
                    >
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-pink-400 text-white shadow-lg shadow-indigo-500/20"
                        >
                            <HeartPulse class="h-5 w-5" />
                        </div>
                        <div class="leading-tight">
                            <span class="font-display text-lg font-bold tracking-tight text-white">
                                Posyandu Tondomulyo
                            </span>
                            <span class="block text-[11px] font-medium text-zinc-400">
                                Integrasi Layanan Primer
                            </span>
                        </div>
                    </Link>
                </div>

                <!-- Slot (Card Component Untouched) -->
                <slot />
            </div>
        </div>
    </div>
</template>

