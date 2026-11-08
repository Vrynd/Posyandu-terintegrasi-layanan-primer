<script setup lang="ts">
import type { InertiaLinkProps } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { ArrowUpRight } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
    title: string;
    description?: string;
    image?: string;
    gradient?: string;
    glow?: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    isLocked?: boolean;
    lockedTooltip?: string;
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    description: '',
    image: undefined,
    gradient: 'from-muted/40 via-muted/20 to-transparent',
    glow: 'bg-primary/20',
    href: undefined,
    isLocked: false,
    lockedTooltip: undefined,
    class: undefined,
});
</script>

<template>
    <component
        :is="isLocked || !href ? 'div' : Link"
        :href="isLocked ? undefined : href"
        :title="isLocked ? lockedTooltip : undefined"
        :aria-disabled="isLocked ? true : undefined"
        class="block select-none focus-visible:outline-none"
        :class="isLocked ? 'cursor-not-allowed' : 'cursor-pointer'"
    >
        <Card
            :class="
                cn(
                    'group relative flex flex-col justify-between gap-0 overflow-hidden rounded-xl border border-transparent bg-card p-2.5 pb-3 shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary sm:rounded-2xl sm:p-3.5 sm:pb-4.5 dark:border-border/40',
                    isLocked ? 'opacity-85' : 'active:scale-[0.99]',
                    props.class,
                )
            "
        >
            <!-- Area 1: Inner Graphic Stage (Aset Gambar 3D dengan Soft Ambient Glow) -->
            <div
                class="relative h-28 w-full overflow-hidden rounded-lg bg-gradient-to-b select-none sm:h-36 sm:rounded-xl lg:h-40"
                :class="gradient"
            >
                <slot name="stage">
                    <!-- Soft Glow Orb Melayang di Belakang Ilustrasi -->
                    <div
                        class="pointer-events-none absolute -top-8 left-1/2 size-32 -translate-x-1/2 rounded-full blur-2xl sm:size-36"
                        :class="glow"
                    />

                    <!-- Gambar Aset 3D -->
                    <slot name="image">
                        <img
                            v-if="image"
                            :src="image"
                            alt=""
                            aria-hidden="true"
                            class="pointer-events-none relative z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                            draggable="false"
                        />
                    </slot>

                    <!-- Gradien Fade-Out Otomatis ke Warna Dasar Kartu (Token bg-card) -->
                    <div
                        class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-card via-card/60 to-transparent sm:h-14"
                    />
                </slot>
            </div>

            <!-- Area 2: Judul & Deskripsi -->
            <div
                class="relative z-10 mt-2 flex flex-col px-0.5 text-left sm:mt-2.5 sm:px-1"
            >
                <div class="flex items-center justify-between gap-1.5 sm:gap-2">
                    <slot name="title">
                        <CardTitle
                            class="font-display text-xs leading-tight font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm lg:text-base"
                        >
                            {{ title }}
                        </CardTitle>
                    </slot>

                    <!-- Icon Panah Indikator Halus saat Hover -->
                    <slot name="action">
                        <ArrowUpRight
                            v-if="!isLocked"
                            aria-hidden="true"
                            class="size-3.5 shrink-0 -translate-x-1 translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100 sm:size-4"
                        />
                    </slot>
                </div>

                <slot name="description">
                    <CardDescription
                        v-if="description"
                        class="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs sm:leading-relaxed"
                    >
                        {{ description }}
                    </CardDescription>
                </slot>
            </div>
        </Card>
    </component>
</template>
