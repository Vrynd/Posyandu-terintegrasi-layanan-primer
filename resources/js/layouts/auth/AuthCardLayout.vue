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
        class="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 font-sans text-foreground antialiased transition-colors duration-300 selection:bg-primary selection:text-primary-foreground md:p-10"
    >
        <!-- Ambient Grid Background (DESIGN.md Dual Mode) -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <!-- Glowing Orbs -->
            <div
                class="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-primary/10 opacity-60 blur-3xl dark:opacity-100"
            ></div>
            <div
                class="absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-accent/10 opacity-40 blur-3xl dark:opacity-60"
            ></div>

            <!-- Grid Contour Layer -->
            <svg
                class="absolute inset-0 h-full w-full opacity-25 dark:opacity-40"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="auth-grid-contour-pattern"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="currentColor"
                            class="text-indigo-600 dark:text-indigo-400"
                            stroke-width="0.6"
                            stroke-opacity="0.2"
                        />
                        <path
                            d="M 0 4 L 0 -4 M -4 0 L 4 0"
                            stroke="currentColor"
                            class="text-indigo-600 dark:text-indigo-400"
                            stroke-width="0.8"
                            stroke-opacity="0.3"
                        />
                    </pattern>
                    <radialGradient
                        id="auth-grid-fade"
                        cx="50%"
                        cy="30%"
                        r="70%"
                    >
                        <stop offset="0%" stop-color="white" stop-opacity="1" />
                        <stop
                            offset="100%"
                            stop-color="white"
                            stop-opacity="0"
                        />
                    </radialGradient>
                    <mask id="auth-grid-mask">
                        <rect
                            width="100%"
                            height="100%"
                            fill="url(#auth-grid-fade)"
                        />
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

        <div class="relative z-10 flex w-full max-w-md flex-col gap-6 sm:gap-8">
            <div class="flex w-full items-center justify-between gap-2 px-0.5">
                <Link
                    :href="home()"
                    class="group flex min-w-0 items-center gap-2.5 transition-transform duration-300 hover:scale-105 sm:gap-3"
                >
                    <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-400 to-pink-400 text-white shadow-lg shadow-indigo-500/20 sm:h-10 sm:w-10"
                    >
                        <HeartPulse class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div class="min-w-0 leading-tight">
                        <span
                            class="block font-display text-sm leading-tight font-bold tracking-tight text-foreground sm:text-base"
                        >
                            Posyandu<br class="sm:hidden" />
                            <span class="inline">Tondomulyo</span>
                        </span>
                        <span
                            class="hidden text-xs font-medium text-muted-foreground sm:block"
                        >
                            Integrasi Layanan Primer
                        </span>
                    </div>
                </Link>

                <div
                    class="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1 whitespace-nowrap shadow-xs backdrop-blur-md sm:gap-2 sm:px-3 sm:py-1.5"
                >
                    <span class="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span
                            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                        ></span>
                        <span
                            class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 sm:h-2 sm:w-2"
                        ></span>
                    </span>
                    <span
                        class="text-[10px] font-medium whitespace-nowrap text-foreground/80 sm:text-[11px]"
                    >
                        Portal Akses Kader
                    </span>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <Card
                    class="gap-2 rounded-2xl border-border bg-card py-0 text-card-foreground shadow-lg backdrop-blur-xl transition-colors duration-300"
                >
                    <CardHeader class="px-6 pt-6 pb-0 text-left sm:px-8">
                        <CardTitle
                            class="font-display text-2xl font-semibold tracking-tight text-card-foreground"
                            >{{ title }}</CardTitle
                        >
                        <CardDescription class="text-xs text-muted-foreground">
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
