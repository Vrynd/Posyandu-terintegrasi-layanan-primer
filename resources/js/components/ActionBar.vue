<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes['class'];
        align?: 'right' | 'left' | 'center' | 'between';
    }>(),
    {
        align: 'right',
    },
);
</script>

<template>
    <!-- Kontainer Luar: Sticky Bottom Sheet di Mobile, Normal Flow di Desktop -->
    <div
        :class="
            cn(
                'fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-border/80 bg-card/95 p-3.5 shadow-lg backdrop-blur-md sm:static sm:inset-auto sm:z-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:shadow-none sm:backdrop-blur-none dark:bg-zinc-950/95',
                props.class,
            )
        "
    >
        <!-- Kontainer Dalam: Distribusi Tombol Otomatis (1 Tombol = 100%, 2 Tombol = 50:50, Desktop = Sesuai Align) -->
        <div
            :class="
                cn(
                    'flex w-full items-center gap-3 sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-initial',
                    align === 'right' && 'sm:justify-end',
                    align === 'left' && 'sm:justify-start',
                    align === 'center' && 'sm:justify-center',
                    align === 'between' && 'sm:justify-between',
                )
            "
        >
            <slot />
        </div>
    </div>
</template>
