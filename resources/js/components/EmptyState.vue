<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

type Props = {
    class?: HTMLAttributes['class'];
    icon?: Component;
    title?: string;
    description?: string;
};

const props = defineProps<Props>();
</script>

<template>
    <div
        :class="
            cn(
                'flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center',
                props.class,
            )
        "
    >
        <div
            v-if="icon || $slots.icon"
            class="flex h-12 w-12 items-center justify-center rounded-full bg-muted"
        >
            <slot name="icon">
                <component
                    :is="icon"
                    v-if="icon"
                    class="h-6 w-6 text-muted-foreground"
                />
            </slot>
        </div>

        <div class="space-y-1">
            <p
                v-if="title || $slots.title"
                class="text-sm font-medium text-foreground"
            >
                <slot name="title">{{ title }}</slot>
            </p>
            <p
                v-if="description || $slots.description"
                class="text-xs text-muted-foreground"
            >
                <slot name="description">{{ description }}</slot>
            </p>
        </div>

        <div v-if="$slots.default" class="mt-1">
            <slot />
        </div>
    </div>
</template>
