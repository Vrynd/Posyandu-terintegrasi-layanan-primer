<script setup lang="ts">
import {
    FormInput,
    FormMultiSelect,
    FormRadioYesNo,
    FormSelect,
} from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

defineProps<{
    weightStatuses: FilterOption[];
    interventions: FilterOption[];
}>();
</script>

<template>
    <div class="space-y-6">
        <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.border-input]:bg-muted/40 [&_input]:bg-muted/40"
        >
            <!-- 1. Umur Balita (Bulan) -->
            <FormInput
                id="age_in_months"
                v-model="form.age_in_months"
                label="Umur Balita (Bulan)"
                inputmode="numeric"
                only-numeric
                placeholder="Contoh: 24 bulan"
                :error="form.errors.age_in_months"
            />

            <!-- 2. Berat Badan (kg) -->
            <FormInput
                id="weight"
                v-model="form.weight"
                label="Berat Badan (kg)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 11.2 kg"
                :error="form.errors.weight"
            />

            <!-- 3. Kesimpulan Berat Badan (N/T/BGM) -->
            <FormSelect
                id="weight_status"
                v-model="form.weight_status"
                label="Kesimpulan Berat Badan"
                placeholder="Pilih status kenaikan BB..."
                :options="weightStatuses"
                :error="form.errors.weight_status"
            />

            <!-- 4. Panjang Badan (cm) -->
            <FormInput
                id="toddler_height"
                v-model="form.height"
                label="Panjang Badan (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 82.5 cm"
                :error="form.errors.height"
            />

            <!-- 5. Lingkar Kepala (cm) -->
            <FormInput
                id="head_circumference"
                v-model="form.head_circumference"
                label="Lingkar Kepala (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 46.0 cm"
                :error="form.errors.head_circumference"
            />

            <!-- 6. Lingkar Lengan Atas (cm) -->
            <FormInput
                id="arm_circumference"
                v-model="form.arm_circumference"
                label="Lingkar Lengan Atas (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 13.5 cm"
                :error="form.errors.arm_circumference"
            />

            <!-- 7. Balita Menunjukkan Gejala Sakit (Ya/Tidak) -->
            <FormRadioYesNo
                id="has_illness_symptoms"
                v-model="form.has_illness_symptoms"
                name="has_illness_symptoms"
                label="Balita Menunjukkan Gejala Sakit"
                :error="form.errors.has_illness_symptoms"
            />

            <!-- 8. Suplementasi yang Diterima Balita -->
            <FormMultiSelect
                id="interventions"
                v-model="form.interventions"
                label="Suplementasi yang Diterima Balita"
                placeholder="Pilih suplemen, imunisasi, atau makanan tambahan..."
                :options="interventions"
                :error="form.errors.interventions"
            />
        </div>
    </div>
</template>
