<script setup lang="ts">
import { X } from '@lucide/vue';
import { Badge } from '@/components/ui/badge';

defineProps<{
    label: string;
}>();

const emit = defineEmits<{
    (e: 'remove'): void;
}>();
</script>

<template>
    <Badge variant="outline" class="gap-1 bg-muted/50 text-xs font-normal">
        <span>{{ label }}</span>
        <button
            type="button"
            class="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
            title="Hapus pencarian"
            @click="emit('remove')"
        >
            <X class="h-3 w-3" />
        </button>
    </Badge>
</template>
