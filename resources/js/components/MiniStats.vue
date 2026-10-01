<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    label: string;
    value: string | number;
    unit?: string;
    icon?: Component;
    iconClass?: string;
    class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
    <div
        :class="
            cn(
                'flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-3.5 shadow-none select-none sm:p-4',
                props.class,
            )
        "
    >
        <!-- Baris Atas: Label & Ikon -->
        <div class="flex items-center justify-between">
            <slot name="label">
                <span class="text-xs text-muted-foreground">
                    {{ label }}
                </span>
            </slot>
            <slot name="icon">
                <component
                    :is="icon"
                    v-if="icon"
                    :class="cn('size-4 shrink-0', iconClass)"
                />
            </slot>
        </div>

        <!-- Baris Bawah: Nilai Angka & Satuan -->
        <div class="flex items-baseline gap-1.5">
            <slot name="value">
                <span
                    class="font-display text-2xl leading-none font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                    {{ value }}
                </span>
            </slot>
            <slot name="unit">
                <span v-if="unit" class="text-xs text-foreground">
                    {{ unit }}
                </span>
            </slot>
        </div>
    </div>
</template>
