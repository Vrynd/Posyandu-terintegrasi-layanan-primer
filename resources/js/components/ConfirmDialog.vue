<script setup lang="ts">
import { AlertTriangle, HelpCircle, Loader2 } from '@lucide/vue';
import type { Component } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
        icon?: Component;
        align?: 'center' | 'left';
    }>(),
    {
        confirmText: 'Lanjutkan',
        cancelText: 'Batal',
        variant: 'default',
        processing: false,
        align: 'center',
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
            class="gap-0 overflow-hidden border-border/80 p-0 shadow-2xl sm:max-w-md"
        >
            <!-- Konten Utama Dialog: Icon + Judul + Deskripsi -->
            <div
                class="space-y-3.5 p-6 sm:p-7"
                :class="{
                    'flex flex-col items-center text-center':
                        align === 'center',
                }"
            >
                <!-- 1. Circle Icon dengan Ring Efek -->
                <div
                    v-if="variant === 'destructive'"
                    class="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-8 ring-red-500/10 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-500/10"
                >
                    <component
                        :is="icon ?? AlertTriangle"
                        class="size-5.5 stroke-[2.2]"
                    />
                </div>
                <div
                    v-else
                    class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/10 dark:bg-primary/20 dark:text-primary dark:ring-primary/10"
                >
                    <component
                        :is="icon ?? HelpCircle"
                        class="size-5.5 stroke-[2.2]"
                    />
                </div>

                <!-- 2. Judul & Deskripsi -->
                <div
                    class="space-y-1.5"
                    :class="{ 'max-w-sm': align === 'center' }"
                >
                    <DialogTitle
                        class="text-base font-semibold tracking-tight text-foreground sm:text-lg"
                    >
                        {{ title }}
                    </DialogTitle>
                    <DialogDescription
                        class="text-sm leading-relaxed whitespace-pre-line text-muted-foreground"
                    >
                        {{ description }}
                    </DialogDescription>
                </div>
            </div>

            <!-- 3. Border Dashed Footer untuk Tombol Batal & Aksi -->
            <DialogFooter
                class="flex flex-row items-center justify-end gap-2.5 border-t border-dashed border-border/80 bg-muted/15 px-6 py-4"
            >
                <DialogClose as-child>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        class="h-8.5 cursor-pointer"
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
                    class="h-8.5 cursor-pointer"
                    :disabled="processing"
                    @click="emit('confirm')"
                >
                    <Loader2
                        v-if="processing"
                        class="mr-1.5 h-4 w-4 animate-spin"
                    />
                    {{ confirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
