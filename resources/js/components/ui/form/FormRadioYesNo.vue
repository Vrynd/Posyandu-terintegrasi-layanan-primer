<script setup lang="ts">
import { computed } from 'vue';
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

const isYesSelected = computed(
    () =>
        modelValue.value === true ||
        (modelValue.value as unknown) === 1 ||
        (modelValue.value as unknown) === '1',
);

const isNoSelected = computed(
    () =>
        modelValue.value === false ||
        (modelValue.value as unknown) === 0 ||
        (modelValue.value as unknown) === '0',
);
</script>

<template>
    <div class="flex flex-col justify-between gap-2 h-full">
        <Label
            v-if="label"
            :for="id"
            class="text-xs font-medium text-foreground/90 leading-relaxed break-words whitespace-normal"
            :title="label"
        >
            {{ label }}
        </Label>

        <div class="space-y-1">
            <div
                :id="id"
                :class="[
                    'border-input min-h-10 sm:h-9.5 w-full min-w-0 rounded-md border bg-transparent overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-start divide-y divide-border/60 sm:divide-y-0 sm:gap-6 sm:px-3 sm:py-1 shadow-none transition-colors',
                    error ? 'border-destructive ring-1 ring-destructive' : '',
                ]"
            >
                <!-- Opsi Ya -->
                <label
                    :class="[
                        'w-full sm:w-auto inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm select-none transition-colors px-3 py-2 sm:px-0 sm:py-0',
                        isYesSelected
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                >
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
                <label
                    :class="[
                        'w-full sm:w-auto inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm select-none transition-colors px-3 py-2 sm:px-0 sm:py-0',
                        isNoSelected
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                >
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
    </div>
</template>