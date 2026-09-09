<script setup lang="ts">
import { BadgeCheck, Lock } from '@lucide/vue';

defineProps<{
    number: string;
    title: string;
    completed?: boolean;
    disabled?: boolean;
    locked?: boolean;
}>();
</script>

<template>
    <div class="flex flex-col gap-0.5 transition-colors duration-200">
        <div
            class="flex items-center justify-between gap-4 rounded-t-2xl rounded-b-md border border-card bg-card/80 px-5 py-4 dark:border-border"
            :class="{
                'border-border/60 bg-card/60': locked,
            }"
        >
            <div class="flex items-center gap-4">
                <div
                    v-if="completed"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600/30 transition-colors dark:bg-emerald-500"
                >
                    <BadgeCheck class="size-4 stroke-2" />
                </div>

                <div
                    v-else-if="disabled || locked"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-1 ring-border"
                >
                    <Lock class="size-4 stroke-2" />
                </div>

                <div
                    v-else
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30"
                >
                    <span
                        class="font-mono text-xs font-bold text-primary tabular-nums"
                    >
                        {{ number }}
                    </span>
                </div>

                <h3
                    class="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base"
                >
                    {{ title }}
                </h3>
            </div>

            <span
                v-if="disabled"
                class="hidden text-xs text-muted-foreground sm:inline"
            >
                Pilih kategori terlebih dahulu
            </span>
        </div>
        <div
            class="rounded-t-md rounded-b-2xl border border-card bg-card/80 p-5 dark:border-border"
            :class="{
                'border-border/60 bg-card/60': locked,
            }"
        >
            <fieldset
                :disabled="disabled"
                class="contents"
                :class="{
                    '[&_input]:cursor-not-allowed [&_button]:cursor-not-allowed [&_select]:cursor-not-allowed [&_textarea]:cursor-not-allowed **:[[role=combobox]]:cursor-not-allowed [&_label]:text-muted-foreground [&_label]:opacity-75 [&_label]:cursor-not-allowed':
                        disabled,
                }"
            >
                <slot />
            </fieldset>
        </div>
    </div>
</template>