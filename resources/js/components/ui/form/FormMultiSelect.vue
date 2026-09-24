<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { Check, ChevronDown, X } from '@lucide/vue';
import InputError from '@/components/InputError.vue';
import { Label } from '@/components/ui/label';

export interface MultiSelectOption {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        id?: string;
        label?: string;
        error?: string;
        placeholder?: string;
        options: Array<MultiSelectOption | string>;
        disabled?: boolean;
        noneOption?: string;
        maxVisibleTags?: number;
    }>(),
    {
        placeholder: 'Pilih beberapa opsi...',
        noneOption: 'Tidak Ada',
        disabled: false,
        maxVisibleTags: 2,
    }
);

const modelValue = defineModel<string[]>({ default: () => [] });

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

onClickOutside(containerRef, () => {
    isOpen.value = false;
});

const normalizedOptions = computed<MultiSelectOption[]>(() => {
    return props.options.map((opt) => {
        if (typeof opt === 'string') {
            return { label: opt, value: opt };
        }

        return opt;
    });
});

const isSelected = (val: string) => {
    return Array.isArray(modelValue.value) && modelValue.value.includes(val);
};

const visibleItems = computed(() => {
    if (!Array.isArray(modelValue.value)) {
        return [];
    }

    return modelValue.value.slice(0, props.maxVisibleTags);
});

const remainingCount = computed(() => {
    if (!Array.isArray(modelValue.value)) {
        return 0;
    }

    return Math.max(0, modelValue.value.length - props.maxVisibleTags);
});

const getLabel = (val: string) => {
    const found = normalizedOptions.value.find((opt) => opt.value === val);

    return found ? found.label : val;
};

const toggleOption = (val: string) => {
    if (props.disabled) {
        return;
    }

    if (!Array.isArray(modelValue.value)) {
        modelValue.value = [];
    }

    const current = [...modelValue.value];

    if (val === props.noneOption) {
        if (current.includes(props.noneOption)) {
            modelValue.value = [];
        } else {
            modelValue.value = [props.noneOption];
        }

        return;
    }

    // Jika memilih opsi lain, hapus opsi 'Tidak Ada' jika ada
    const noneIdx = current.indexOf(props.noneOption);

    if (noneIdx > -1) {
        current.splice(noneIdx, 1);
    }

    const idx = current.indexOf(val);

    if (idx > -1) {
        current.splice(idx, 1);
    } else {
        current.push(val);
    }

    modelValue.value = current;
};

const removeOption = (val: string) => {
    if (props.disabled || !Array.isArray(modelValue.value)) {
        return;
    }

    modelValue.value = modelValue.value.filter((item) => item !== val);
};

const clearAll = () => {
    if (props.disabled) {
        return;
    }

    modelValue.value = [];
};
</script>

<template>
    <div ref="containerRef" class="relative flex flex-col gap-2">
        <Label v-if="label" :for="id" class="text-xs font-medium text-foreground/90">
            {{ label }}
        </Label>

        <!-- Trigger Input Box -->
        <div
            :id="id"
            role="combobox"
            :aria-expanded="isOpen"
            tabindex="0"
            @click="!disabled && (isOpen = !isOpen)"
            @keydown.enter.prevent="!disabled && (isOpen = !isOpen)"
            @keydown.space.prevent="!disabled && (isOpen = !isOpen)"
            class="flex min-h-10 sm:min-h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,box-shadow] outline-none cursor-pointer select-none"
            :class="[
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/15',
                isOpen ? 'border-ring ring-2 ring-ring/20' : '',
                error ? 'border-destructive ring-destructive/20' : '',
            ]"
        >
            <!-- Placeholder atau Selected Tags -->
            <div class="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden py-0.5 pr-2">
                <span
                    v-if="!modelValue || modelValue.length === 0"
                    class="text-muted-foreground text-sm truncate"
                >
                    {{ placeholder }}
                </span>

                <template v-else>
                    <span
                        v-for="item in visibleItems"
                        :key="item"
                        class="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent border border-accent/25"
                    >
                        <span class="max-w-[130px] truncate">{{ getLabel(item) }}</span>
                        <button
                            type="button"
                            @click.stop="removeOption(item)"
                            class="hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors cursor-pointer"
                            title="Hapus"
                        >
                            <X class="size-3" />
                        </button>
                    </span>

                    <span
                        v-if="remainingCount > 0"
                        class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground"
                    >
                        +{{ remainingCount }} lainnya
                    </span>
                </template>
            </div>

            <!-- Clear & Chevron Icons -->
            <div class="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                <button
                    v-if="modelValue && modelValue.length > 0 && !disabled"
                    type="button"
                    @click.stop="clearAll"
                    class="hover:text-foreground p-0.5 rounded transition-colors cursor-pointer"
                    title="Kosongkan pilihan"
                >
                    <X class="size-3.5" />
                </button>
                <ChevronDown
                    class="size-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                />
            </div>
        </div>

        <!-- Dropdown Menu Panel (Multi-Choice Sekaligus) -->
        <div
            v-if="isOpen"
            class="absolute top-full left-0 z-50 mt-1.5 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-lg outline-none"
        >
            <div class="max-h-60 overflow-y-auto p-1 space-y-0.5">
                <div
                    v-for="opt in normalizedOptions"
                    :key="opt.value"
                    @click="toggleOption(opt.value)"
                    class="flex items-center justify-between rounded-sm px-2.5 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground select-none transition-colors"
                    :class="{
                        'bg-accent/40 font-medium text-foreground': isSelected(opt.value),
                    }"
                >
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div
                            class="size-4 shrink-0 rounded border flex items-center justify-center transition-colors"
                            :class="[
                                isSelected(opt.value)
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-muted-foreground/40 bg-background',
                            ]"
                        >
                            <Check v-if="isSelected(opt.value)" class="size-3 stroke-[3]" />
                        </div>
                        <span class="truncate">{{ opt.label }}</span>
                    </div>

                    <span
                        v-if="opt.value === noneOption"
                        class="text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60"
                    >
                        Eksklusif
                    </span>
                </div>
            </div>

            <!-- Footer: Indikator Pilihan & Tombol Selesai -->
            <div class="flex items-center justify-between border-t border-border/60 bg-muted/20 px-3 py-2 text-xs">
                <span class="text-muted-foreground">
                    <strong class="text-foreground font-semibold">{{ modelValue?.length || 0 }}</strong> dipilih
                </span>
                <button
                    type="button"
                    @click="isOpen = false"
                    class="rounded bg-primary px-3 py-1 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                >
                    Selesai
                </button>
            </div>
        </div>

        <InputError v-if="error" :message="error" />
    </div>
</template>
