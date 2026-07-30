<script setup lang="ts">
import { Loader2 } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

withDefaults(
    defineProps<{
        open: boolean;
        title: string;
        description: string;
        confirmText?: string;
        cancelText?: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary';
        processing?: boolean;
        borderStyle?: 'solid' | 'dashed';
    }>(),
    {
        confirmText: 'Lanjutkan',
        cancelText: 'Batal',
        variant: 'default',
        processing: false,
        borderStyle: 'solid',
    },
);

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();
</script>

<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent
            class="gap-0 overflow-hidden border-border/80 p-0 shadow-xl sm:max-w-md"
        >
            <DialogHeader
                class="flex flex-row items-center justify-between border-b border-border px-4 py-3.5"
                :class="{ 'border-dashed': borderStyle === 'dashed' }"
            >
                <DialogTitle class="text-base tracking-tight">
                    {{ title }}
                </DialogTitle>
            </DialogHeader>
            <div class="px-4 py-5">
                <DialogDescription
                    class="text-sm leading-relaxed whitespace-pre-line text-muted-foreground"
                >
                    {{ description }}
                </DialogDescription>
            </div>
            <DialogFooter
                class="flex flex-row justify-end gap-2.5 border-t border-border px-4 py-3.5"
                :class="{ 'border-dashed': borderStyle === 'dashed' }"
            >
                <DialogClose as-child>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        class="h-8.5"
                        :disabled="processing"
                        @click="emit('cancel')"
                    >
                        {{ cancelText }}
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    :variant="variant"
                    size="sm"
                    class="h-8.5"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    <Loader2
                        v-if="processing"
                        class="mr-2 h-4 w-4 animate-spin"
                    />
                    {{ confirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
