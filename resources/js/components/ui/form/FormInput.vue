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
    min?: number | string;
    max?: number | string;
    step?: number | string;
    onlyNumeric?: boolean;
    isDecimal?: boolean;
}>();

const modelValue = defineModel<string>({ required: true });

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let val = target.value;

    if (props.onlyNumeric) {
        val = val.replace(/\D/g, '');
    } else if (props.isDecimal) {
        val = val.replace(/,/g, '.');
        val = val.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }
    }

    if (target.value !== val) {
        target.value = val;
    }
    modelValue.value = val;
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
            :step="step"
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