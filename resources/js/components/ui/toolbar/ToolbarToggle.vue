<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ChevronsDownUp } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        open?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    {
        open: false,
    },
);

const emit = defineEmits<{
    (e: 'click'): void;
}>();
</script>

<template>
    <Button
        variant="outline"
        size="sm"
        :class="
            cn(
                'h-9 w-9 shrink-0 cursor-pointer p-0 text-muted-foreground transition-colors hover:text-foreground',
                props.class,
            )
        "
        :title="props.open ? 'Tutup panel status' : 'Buka panel status'"
        :aria-expanded="props.open"
        @click="emit('click')"
    >
        <ChevronsDownUp
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': props.open }"
        />
    </Button>
</template>
