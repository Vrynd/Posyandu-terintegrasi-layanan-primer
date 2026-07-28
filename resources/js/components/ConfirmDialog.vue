<script setup lang="ts">
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
    }>(),
    {
        confirmText: 'Lanjutkan',
        cancelText: 'Batal',
        variant: 'default',
        processing: false,
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
        <DialogContent class="sm:max-w-106.25">
            <DialogHeader class="space-y-2 text-left">
                <DialogTitle class="text-lg font-semibold">{{
                    title
                }}</DialogTitle>
                <DialogDescription class="text-sm text-muted-foreground">
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter class="mt-6 flex flex-row justify-end gap-2 sm:gap-2">
                <DialogClose as-child>
                    <Button
                        type="button"
                        variant="outline"
                        :disabled="processing"
                        @click="emit('cancel')"
                    >
                        {{ cancelText }}
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    :variant="variant"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    {{ confirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
