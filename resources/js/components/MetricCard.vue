<script setup lang="ts">
import { MoreVertical } from '@lucide/vue';
import type { Component } from 'vue';
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    title: string;
    value: string | number;
    description?: string;
    badgeText?: string;
    icon?: Component;
    variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'default';
};

const props = withDefaults(defineProps<Props>(), {
    variant: 'emerald',
});

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'emerald':
            return {
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                cardHover: 'hover:border-emerald-500/40',
            };
        case 'indigo':
            return {
                iconColor: 'text-indigo-600 dark:text-indigo-400',
                badge: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
                cardHover: 'hover:border-indigo-500/40',
            };
        case 'amber':
            return {
                iconColor: 'text-amber-600 dark:text-amber-400',
                badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                cardHover: 'hover:border-amber-500/40',
            };
        case 'rose':
            return {
                iconColor: 'text-rose-600 dark:text-rose-400',
                badge: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
                cardHover: 'hover:border-rose-500/40',
            };
        default:
            return {
                iconColor: 'text-muted-foreground',
                badge: 'border-border bg-muted text-muted-foreground',
                cardHover: 'hover:border-border',
            };
    }
});
</script>

<template>
    <Card
        :class="[
            'relative gap-3 overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-4 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-200',
            variantClasses.cardHover,
        ]"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <component
                    v-if="icon"
                    :is="icon"
                    :class="['h-4 w-4 shrink-0', variantClasses.iconColor]"
                />
                <span class="text-xs font-medium text-foreground sm:text-sm">
                    {{ title }}
                </span>
            </div>

            <button
                type="button"
                class="flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Opsi"
            >
                <MoreVertical class="h-4 w-4" />
            </button>
        </div>

        <CardContent
            class="flex items-center justify-between rounded-xl border border-border/60 bg-muted/60 p-3 transition-colors dark:border-zinc-800/90 dark:bg-zinc-950/70"
        >
            <span
                class="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
                {{ value }}
            </span>

            <Badge
                v-if="badgeText"
                variant="outline"
                :class="[
                    'rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                    variantClasses.badge,
                ]"
            >
                {{ badgeText }}
            </Badge>
        </CardContent>
    </Card>
</template>
