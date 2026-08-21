<script setup lang="ts">
import { BadgeCheck, Lock } from '@lucide/vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps<{
    number: string;
    title: string;
    completed?: boolean;
    disabled?: boolean;
}>();
</script>

<template>
    <Card
        class="gap-0 border-border/80 bg-card py-0 shadow-xs transition-all duration-300"
        :class="{
            'pointer-events-none select-none opacity-40': disabled,
        }"
    >
        <CardHeader
            class="gap-0 border-b border-dashed border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
        >
            <div class="flex items-center justify-between gap-2.5">
                <div class="flex items-center gap-2.5">
                    <div
                        v-if="completed"
                        class="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white ring-3 ring-emerald-500/20 shadow-xs transition-all duration-300 dark:bg-emerald-500 dark:ring-emerald-400/20"
                    >
                        <BadgeCheck class="size-3.5 sm:size-4 stroke-[2.5]" />
                    </div>

                    <div
                        v-else-if="disabled"
                        class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-1 ring-border"
                    >
                        <Lock class="size-3.5 stroke-[2]" />
                    </div>
                    <div
                        v-else
                        class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30"
                    >
                        <span
                            class="font-mono text-xs font-bold text-primary tabular-nums"
                        >
                            {{ number }}
                        </span>
                    </div>

                    <CardTitle class="text-sm font-medium font-display">
                        {{ title }}
                    </CardTitle>
                </div>
                <span
                    v-if="disabled"
                    class="hidden text-[11px] font-medium text-muted-foreground/80 sm:inline"
                >
                    Pilih kategori terlebih dahulu
                </span>
            </div>
        </CardHeader>
        <CardContent class="p-4 sm:p-5">
            <slot />
        </CardContent>
    </Card>
</template>