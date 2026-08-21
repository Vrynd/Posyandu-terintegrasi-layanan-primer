<script setup lang="ts">
import {
    Baby,
    Briefcase,
    GraduationCap,
    HeartPulse,
    HeartHandshake,
    PersonStanding,
} from '@lucide/vue';
import { computed } from 'vue';

const modelValue = defineModel<string>({ required: true });

const props = defineProps<{
    options: Array<{ label: string; value: string }>;
    error?: string;
}>();

// Fungsi untuk memilih atau membatalkan pilihan (toggle)
const toggleCategory = (id: string) => {
    modelValue.value = modelValue.value === id ? '' : id;
};

// Metadata warna: diselaraskan persis dengan kode Anda + warna border/bg saat aktif
const categoryMetadata: Record<
    string,
    {
        icon: any;
        defaultColor: string;
        activeColor: string;
        activeCardColor: string;

        description: string;
    }
> = {
    pregnant_mother: {
        icon: HeartPulse,
        defaultColor: 'bg-pink-500/10 text-pink-500 ring-1 ring-pink-500/20',
        activeColor: 'bg-pink-500 text-white shadow-xs',
        activeCardColor:
            'border-solid border-pink-500 bg-pink-500/10 shadow-xs',
        description: 'Pemantauan kehamilan & HPHT',
    },
    toddler: {
        icon: Baby,
        defaultColor: 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20',
        activeColor: 'bg-amber-500 text-white shadow-xs',
        activeCardColor:
            'border-solid border-amber-500 bg-amber-500/10 shadow-xs',
        description: 'Tumbuh kembang anak (0–5 thn)',
    },
    teenager: {
        icon: GraduationCap,
        defaultColor:
            'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20',
        activeColor: 'bg-emerald-500 text-white shadow-xs',
        activeCardColor:
            'border-solid border-emerald-500 bg-emerald-500/10 shadow-xs',
        description: 'Skrining remaja (10–18 thn)',
    },
    productive: {
        icon: Briefcase,
        defaultColor: 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20',
        activeColor: 'bg-blue-500 text-white shadow-xs',
        activeCardColor:
            'border-solid border-blue-500 bg-blue-500/10 shadow-xs',
        description: 'Skrining usia kerja (19–59 thn)',
    },
    adult: {
        icon: HeartHandshake,
        defaultColor:
            'bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/20',
        activeColor: 'bg-violet-500 text-white shadow-xs',
        activeCardColor:
            'border-solid border-violet-500 bg-violet-500/10 shadow-xs',
        description: 'Kesehatan lansia (60+ thn)',
    },
};

const categories = computed(() => {
    return props.options.map((item) => {
        const meta = categoryMetadata[item.value] || {
            icon: PersonStanding,
            defaultColor: 'bg-muted text-muted-foreground ring-1 ring-border',
            activeColor: 'bg-primary text-primary-foreground',
            activeCardColor:
                'border-solid border-primary bg-primary/10 shadow-xs',
            badgeColor: 'bg-primary text-primary-foreground',
            description: '',
        };

        return {
            id: item.value,
            title: item.label,
            description: meta.description,
            icon: meta.icon,
            defaultColor: meta.defaultColor,
            activeColor: meta.activeColor,
            activeCardColor: meta.activeCardColor,
        };
    });
});
</script>

<template>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            @click="toggleCategory(item.id)"
            :class="[
                'group relative flex cursor-pointer flex-col items-start gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-row sm:items-center',
                modelValue === item.id
                    ? item.activeCardColor
                    : 'border-dashed border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/30',
            ]"
        >
            <!-- Box Ikon -->
            <div
                :class="[
                    'flex size-8 shrink-0 items-center justify-center rounded-md transition-all duration-200 sm:size-9',
                    modelValue === item.id
                        ? item.activeColor
                        : item.defaultColor,
                ]"
            >
                <component :is="item.icon" class="size-4.5" />
            </div>

            <!-- Konten Teks -->
            <div class="flex min-w-0 flex-1 flex-col gap-1 pr-4 sm:pr-2">
                <h3
                    class="font-display text-sm leading-tight font-medium text-foreground"
                >
                    {{ item.title }}
                </h3>
                <p class="text-xs text-muted-foreground">
                    {{ item.description }}
                </p>
            </div>
        </button>
    </div>

    <!-- Error Message -->
    <span
        v-if="error"
        class="mt-3 block text-xs font-medium text-red-500 italic"
    >
        {{ error }}
    </span>
</template>
