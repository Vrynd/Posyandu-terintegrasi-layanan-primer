<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

defineProps<{
    id?: string;
    label: string;
    error?: string;
    placeholder?: string;
    options: Array<{ label: string; value: string }>;
    disabled?: boolean;
}>();

const modelValue = defineModel<string>({ required: true });
</script>

<template>
    <div class="space-y-2">
        <Label :for="id" class="text-xs font-medium text-foreground/90">
            {{ label }}
        </Label>
        <Select v-model="modelValue" :disabled="disabled">
            <SelectTrigger
                :id="id"
                class="h-10 w-full text-sm sm:h-9.5"
                :class="{ 'border-red-500': error }"
            >
                <SelectValue :placeholder="placeholder || 'Pilih...'" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    v-for="opt in options"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ opt.label }}
                </SelectItem>
            </SelectContent>
        </Select>
        <InputError :message="error" />
    </div>
</template>