<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const props = defineProps<{
    id?: string;
    label: string;
    error?: string;
    placeholder?: string;
    type?: string;
    inputmode?:
        | 'none'
        | 'text'
        | 'decimal'
        | 'numeric'
        | 'tel'
        | 'search'
        | 'email'
        | 'url';
    maxlength?: number | string;
    min?: string;
    max?: string;
    onlyNumeric?: boolean;
}>();

const modelValue = defineModel<string>({ required: true });

const handleInput = (e: Event) => {
    if (props.onlyNumeric) {
        const target = e.target as HTMLInputElement;
        const cleaned = target.value.replace(/\D/g, '');
        if (target.value !== cleaned) {
            target.value = cleaned;
            modelValue.value = cleaned;
        }
    }
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <Label :for="id" class="text-xs font-medium text-foreground/90">
            {{ label }}
        </Label>

        <Input
            :id="id"
            v-model="modelValue"
            :type="type || 'text'"
            :inputmode="inputmode"
            :maxlength="maxlength"
            :min="min"
            :max="max"
            :placeholder="placeholder"
            @input="handleInput"
            :class="[
                'shadow-none',
                type === 'date' || type === 'time'
                    ? [
                          !modelValue
                              ? 'text-muted-foreground'
                              : 'text-foreground',
                          'dark:scheme-dark [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100',
                      ]
                    : '',
                error ? 'border-destructive' : '',
            ]"
        />
        <InputError v-if="error" :message="error" />
    </div>
</template>