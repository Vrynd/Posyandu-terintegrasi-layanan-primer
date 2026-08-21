<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Label } from '@/components/ui/label';

defineProps<{
    id?: string;
    label: string;
    error?: string;
    placeholder?: string;
    rows?: number | string;
}>();

const modelValue = defineModel<string>({ required: true });
</script>

<template>
    <div class="space-y-2">
        <Label :for="id" class="text-xs font-medium text-foreground/90">
            {{ label }}
        </Label>
        <textarea
            :id="id"
            v-model="modelValue"
            :rows="rows || 3"
            :placeholder="placeholder"
            :class="[
                'w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-xs placeholder:text-muted-foreground focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                error ? 'border-destructive' : '',
            ]"
        ></textarea>
        <InputError :message="error" />
    </div>
</template>