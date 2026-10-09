<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import type { MetricVariant } from '@/types';

type Props = {
    variant?: MetricVariant;
};

const props = defineProps<Props>();
const injectedVariant = inject<ComputedRef<MetricVariant> | null>(
    'metricVariant',
    null,
);

const activeVariant = computed(
    () => props.variant ?? injectedVariant?.value ?? 'blue',
);
</script>

<template>
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <!-- 1. Total Peserta (Violet - Simpul Jaringan Konsentris) -->
        <template v-if="activeVariant === 'violet'">
            <svg
                class="absolute -right-5 -top-5 size-36 stroke-violet-500/15"
                fill="none"
                viewBox="0 0 100 100"
            >
                <circle cx="80" cy="20" r="16" stroke-width="1.5" />
                <circle cx="80" cy="20" r="32" stroke-width="1.5" stroke-dasharray="3 3" />
                <circle cx="80" cy="20" r="48" stroke-width="1.5" />
            </svg>
            <div class="absolute -top-6 -right-6 size-20 rounded-full bg-violet-500/10 blur-xl" />
        </template>

        <!-- 2. Ibu Hamil & Nifas (Pink - Kurva Denyut Lembut) -->
        <template v-else-if="activeVariant === 'pink' || activeVariant === 'rose'">
            <svg
                class="absolute -right-3 -bottom-3 size-32 stroke-pink-500/20"
                fill="none"
                viewBox="0 0 100 100"
            >
                <path d="M10 80 Q 40 40, 60 70 T 90 20" stroke-width="2" stroke-linecap="round" />
                <circle cx="82" cy="25" r="10" stroke-width="1.5" />
                <circle cx="82" cy="25" r="22" stroke-width="1.5" stroke-dasharray="4 4" />
            </svg>
            <div class="absolute -bottom-6 -right-6 size-20 rounded-full bg-pink-500/10 blur-xl" />
        </template>

        <!-- 3. Balita (Biru - Gelembung Organik Lembut) -->
        <template v-else-if="activeVariant === 'blue' || activeVariant === 'indigo'">
            <svg
                class="absolute -right-4 -top-4 size-32 fill-blue-500/10"
                viewBox="0 0 100 100"
            >
                <circle cx="75" cy="25" r="18" />
                <circle cx="45" cy="35" r="10" />
                <circle cx="68" cy="60" r="13" />
            </svg>
            <div class="absolute -top-6 -right-6 size-20 rounded-full bg-blue-500/10 blur-xl" />
        </template>

        <!-- 4. Anak Remaja (Tosca - Garis Kisi & Diagonal Dinamis) -->
        <template v-else-if="activeVariant === 'tosca' || activeVariant === 'emerald'">
            <svg
                class="absolute -right-3 -top-3 size-32 stroke-teal-500/20"
                fill="none"
                viewBox="0 0 100 100"
                >
                <line x1="35" y1="0" x2="100" y2="65" stroke-width="1.5" />
                <line x1="55" y1="0" x2="100" y2="45" stroke-width="1.5" />
                <line x1="75" y1="0" x2="100" y2="25" stroke-width="1.5" />
                <circle cx="45" cy="18" r="2.5" fill="currentColor" class="text-teal-500/30" />
                <circle cx="65" cy="38" r="2.5" fill="currentColor" class="text-teal-500/30" />
                <circle cx="85" cy="58" r="2.5" fill="currentColor" class="text-teal-500/30" />
            </svg>
            <div class="absolute -top-6 -right-6 size-20 rounded-full bg-teal-500/10 blur-xl" />
        </template>

        <!-- 5. Usia Produktif (Orange - Sudut Balok Pertumbuhan Karir) -->
        <template v-else-if="activeVariant === 'orange'">
            <svg
                class="absolute -right-3 -top-3 size-32 stroke-orange-500/20"
                fill="none"
                viewBox="0 0 100 100"
            >
                <path d="M45 0 L100 0 L100 55 Z" fill="currentColor" class="text-orange-500/5" stroke-width="1.5" />
                <path d="M25 0 L100 75" stroke-width="1.5" stroke-dasharray="4 4" />
                <path d="M60 0 L100 40" stroke-width="1.5" />
            </svg>
            <div class="absolute -top-6 -right-6 size-20 rounded-full bg-orange-500/10 blur-xl" />
        </template>

        <!-- 6. Usia Lansia (Kuning - Busur Tenang Melingkar) -->
        <template v-else-if="activeVariant === 'yellow' || activeVariant === 'amber'">
            <svg
                class="absolute -right-4 -bottom-4 size-36 stroke-amber-500/20"
                fill="none"
                viewBox="0 0 100 100"
            >
                <path d="M100 40 A 60 60 0 0 0 40 100" stroke-width="1.5" />
                <path d="M100 60 A 40 40 0 0 0 60 100" stroke-width="1.5" stroke-dasharray="3 3" />
                <path d="M100 80 A 20 20 0 0 0 80 100" stroke-width="1.5" />
            </svg>
            <div class="absolute -bottom-6 -right-6 size-20 rounded-full bg-amber-400/10 blur-xl" />
        </template>
    </div>
</template>
