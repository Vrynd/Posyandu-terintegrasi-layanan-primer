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
    <!-- Kontainer Luar: Sticky Bottom Bar hanya di Layar Mobile (<sm), Normal Flow Bersih di Desktop (sm+) -->
    <div
        :class="
            cn(
                'pt-2 sm:flex sm:items-center sm:justify-end',
                'max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-30 max-sm:rounded-t-2xl max-sm:border-t max-sm:border-border/80 max-sm:bg-card/95 max-sm:p-3.5 max-sm:shadow-lg max-sm:backdrop-blur-md dark:max-sm:bg-zinc-950/95',
                props.class,
            )
        "
    >
        <!-- Kontainer Dalam: Distribusi Tombol Otomatis (1 Tombol = 100%, 2 Tombol = 50:50 di Mobile) -->
        <div
            :class="
                cn(
                    'flex w-full items-center gap-3 sm:w-auto max-sm:[&>*]:flex-1',
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
