<script setup lang="ts">
import { FormInput, FormRadioYesNo, FormSelect } from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

defineProps<{
    weightStatuses: FilterOption[];
}>();

const toddlerInterventions = [
    'ASI Eksklusif',
    'Makanan Pendamping ASI (MP-ASI)',
    'Imunisasi Rutin Lengkap',
    'Vitamin A',
    'Obat Cacing',
    'PMT Pemulihan',
];

const toggleIntervention = (item: string) => {
    if (!form.value.interventions) {
        form.value.interventions = [];
    }

    const idx = form.value.interventions.indexOf(item);

    if (idx > -1) {
        form.value.interventions.splice(idx, 1);
    } else {
        form.value.interventions.push(item);
    }
};
</script>

<template>
    <div class="space-y-6">
        <!-- 1. PENGUKURAN ANTROPOMETRI BALITA & GEJALA SAKIT -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Berat Badan (kg) -->
            <FormInput
                id="weight"
                v-model="form.weight"
                label="Berat Badan (BB) (kg)"
                type="number"
                step="0.01"
                placeholder="Contoh: 11.2"
                :error="form.errors.weight"
            />

            <!-- Panjang / Tinggi Badan (PB/TB cm) -->
            <FormInput
                id="toddler_height"
                v-model="form.height"
                label="Panjang / Tinggi Badan (cm)"
                type="number"
                step="0.1"
                placeholder="Contoh: 82.5"
                :error="form.errors.height"
            />

            <!-- Umur Balita (Bulan) -->
            <FormInput
                id="age_in_months"
                v-model="form.age_in_months"
                label="Umur Balita (Bulan)"
                type="number"
                placeholder="Contoh: 18"
                :error="form.errors.age_in_months"
            />

            <!-- Lingkar Kepala (cm) -->
            <FormInput
                id="head_circumference"
                v-model="form.head_circumference"
                label="Lingkar Kepala (cm)"
                type="number"
                step="0.1"
                placeholder="Contoh: 46.0"
                :error="form.errors.head_circumference"
            />

            <!-- Lingkar Lengan Atas (LiLA cm) -->
            <FormInput
                id="arm_circumference"
                v-model="form.arm_circumference"
                label="Lingkar Lengan Atas (cm)"
                type="number"
                step="0.1"
                placeholder="Contoh: 13.5"
                :error="form.errors.arm_circumference"
            />

            <!-- Hasil Penimbangan BB (KMS: N/T/BGM) -->
            <FormSelect
                id="weight_status"
                v-model="form.weight_status"
                label="Kesimpulan Kenaikan Berat Badan"
                placeholder="Pilih status kenaikan BB..."
                :options="weightStatuses"
                :error="form.errors.weight_status"
            />

            <!-- Balita Menunjukkan Gejala Sakit (Radio Ya/Tidak) -->
            <FormRadioYesNo
                id="has_illness_symptoms"
                v-model="form.has_illness_symptoms"
                name="has_illness_symptoms"
                label="Balita Menunjukkan Gejala Sakit"
                :error="form.errors.has_illness_symptoms"
            />
        </div>

        <!-- 2. PROGRAM & SUPLEMENTASI YANG DITERIMA BALITA (TANPA CARD WRAPPER) -->
        <div class="space-y-3">
            <div>
                <h4 class="text-sm font-bold text-foreground">
                    Program & Suplementasi yang Diterima Balita
                </h4>
                <p class="text-xs text-muted-foreground">
                    Pilih suplemen, imunisasi, dan makanan tambahan yang
                    diberikan pada kunjungan bulan ini.
                </p>
            </div>
            <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <label
                    v-for="item in toddlerInterventions"
                    :key="item"
                    class="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/60 p-3 text-xs transition-colors hover:bg-muted/40 sm:text-sm"
                    :class="{
                        'border-primary/60 bg-primary/5':
                            form.interventions?.includes(item),
                    }"
                >
                    <input
                        type="checkbox"
                        :checked="form.interventions?.includes(item)"
                        @change="toggleIntervention(item)"
                        class="rounded border-border text-primary focus:ring-primary"
                    />
                    <span class="font-medium text-foreground">{{ item }}</span>
                </label>
            </div>
        </div>
    </div>
</template>
