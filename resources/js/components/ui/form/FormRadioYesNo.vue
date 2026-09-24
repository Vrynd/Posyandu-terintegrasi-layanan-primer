<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Label } from '@/components/ui/label';

defineProps<{
    id?: string;
    name: string;
    label: string;
    error?: string;
    yesLabel?: string;
    noLabel?: string;
}>();

const modelValue = defineModel<boolean | null | undefined>({ required: true });
</script>

<template>
    <div class="flex flex-col gap-2">
        <Label
            v-if="label"
            :for="id"
            class="text-xs font-medium text-foreground/90 truncate"
            :title="label"
        >
            {{ label }}
        </Label>

        <div
            :id="id"
            :class="[
                'border-input h-10 sm:h-9.5 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 flex items-center justify-start gap-6 shadow-none transition-colors',
                error ? 'border-destructive ring-1 ring-destructive' : '',
            ]"
        >
            <!-- Opsi Ya -->
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-foreground select-none">
                <input
                    type="radio"
                    :name="name"
                    :value="true"
                    v-model="modelValue"
                    class="h-4 w-4 border-input text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span>{{ yesLabel ?? 'Ya' }}</span>
            </label>

            <!-- Opsi Tidak -->
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-foreground select-none">
                <input
                    type="radio"
                    :name="name"
                    :value="false"
                    v-model="modelValue"
                    class="h-4 w-4 border-input text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span>{{ noLabel ?? 'Tidak' }}</span>
            </label>
        </div>

        <InputError v-if="error" :message="error" />
    </div>
</template>
