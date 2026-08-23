<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { ChevronDown } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface Props {
    title?: string;
    options: Option[];
    defaultValue?: string;
    icon?: Component;
    class?: HTMLAttributes['class'];
}

const modelValue = defineModel<string>({ default: '' });
const props = withDefaults(defineProps<Props>(), {
    defaultValue: 'latest',
});

const selectedLabel = computed(() => {
    const found = props.options.find((opt) => opt.value === modelValue.value);
    return found ? found.label : props.title;
});

const isActive = computed(() => {
    return Boolean(modelValue.value) && modelValue.value !== props.defaultValue;
});
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                :class="
                    cn(
                        'h-9.5 justify-between gap-2 rounded-lg border-border/80 bg-background/50 px-3 text-xs font-normal transition-colors hover:bg-accent/40',
                        isActive &&
                            'border-primary/50 bg-primary/5 font-medium text-foreground',
                        props.class,
                    )
                "
            >
                <div class="flex items-center gap-1.5 whitespace-nowrap">
                    <component
                        :is="props.icon"
                        v-if="props.icon"
                        :class="
                            cn(
                                'h-3.5 w-3.5 shrink-0',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            )
                        "
                    />
                    <span class="truncate">{{ selectedLabel }}</span>
                    <!-- Dot indikator aktif -->
                    <span
                        v-if="isActive"
                        class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    />
                </div>
                <ChevronDown class="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" class="w-auto min-w-52 rounded-lg">
            <DropdownMenuLabel
                v-if="props.title"
                class="text-xs text-muted-foreground"
            >
                {{ props.title }}
            </DropdownMenuLabel>
            <DropdownMenuSeparator v-if="props.title" />

            <!-- Grid 2 kolom tombol bergaya pill -->
            <div class="grid grid-cols-2 gap-1.5 p-1.5">
                <button
                    v-for="(opt, index) in props.options"
                    :key="opt.value"
                    type="button"
                    :class="
                        cn(
                            'rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-all',
                            index === 0 && 'col-span-2',
                            modelValue === opt.value
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )
                    "
                    @click="modelValue = opt.value"
                >
                    {{ opt.label }}
                </button>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
