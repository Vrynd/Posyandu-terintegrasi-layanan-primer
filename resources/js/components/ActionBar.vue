<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes['class'];
        align?: 'right' | 'left' | 'center' | 'between';
        distribution?: 'primary-wide' | 'equal' | 'auto';
    }>(),
    {
        align: 'right',
        distribution: 'primary-wide',
    },
);
</script>

<template>
    <!-- Kontainer Luar: Sticky Bottom Bar hanya di Layar Mobile (<sm), Normal Flow Bersih di Desktop (sm+) -->
    <div
        :class="
            cn(
                'max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-30 max-sm:rounded-t-2xl max-sm:border-t max-sm:border-border/80 max-sm:bg-card/95 max-sm:p-3.5 max-sm:pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] max-sm:shadow-lg max-sm:backdrop-blur-md dark:max-sm:bg-card',
                props.class?.toString().includes('hidden')
                    ? ''
                    : 'sm:flex sm:items-center sm:justify-end',
                props.class,
            )
        "
    >
        <!-- Kontainer Dalam: Distribusi Tombol Otomatis Berdasarkan Prop distribution -->
        <div
            :class="
                cn(
                    'flex w-full items-center gap-3 sm:w-auto',
                    props.distribution === 'primary-wide' &&
                        'max-sm:[&>*:first-child]:flex-1 max-sm:[&>*:last-child]:flex-2',
                    props.distribution === 'equal' && 'max-sm:*:flex-1',
                    props.distribution === 'auto' && 'max-sm:*:w-auto',
                    props.align === 'right' && 'sm:justify-end',
                    props.align === 'left' && 'sm:justify-start',
                    props.align === 'center' && 'sm:justify-center',
                    props.align === 'between' && 'sm:justify-between',
                )
            "
        >
            <slot />
        </div>
    </div>
</template>
