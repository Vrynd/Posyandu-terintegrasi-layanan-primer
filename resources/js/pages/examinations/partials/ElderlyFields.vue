<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormInput, FormMultiSelect, FormSelect } from '@/components/ui/form';
import type { FilterOption, ScreeningItem } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

defineProps<{
    bmiCategories: FilterOption[];
    sensoryResults: FilterOption[];
    independenceLevels: FilterOption[];
    diseaseHistories: FilterOption[];
    questions?: ScreeningItem[];
}>();

// 1. Input tunggal Tekanan Darah (Contoh: 120/80)
const bloodPressure = ref(
    form.value.systolic_pressure && form.value.diastolic_pressure
        ? `${form.value.systolic_pressure}/${form.value.diastolic_pressure}`
        : form.value.systolic_pressure
          ? `${form.value.systolic_pressure}`
          : '',
);

watch(bloodPressure, (val) => {
    if (!val) {
        form.value.systolic_pressure = '';
        form.value.diastolic_pressure = '';

        return;
    }

    const parts = val.split('/');

    if (parts.length >= 2) {
        form.value.systolic_pressure = parts[0].trim();
        form.value.diastolic_pressure = parts[1].trim();
    } else {
        form.value.systolic_pressure = parts[0].trim();
        form.value.diastolic_pressure = '';
    }
});

watch(
    [() => form.value.systolic_pressure, () => form.value.diastolic_pressure],
    ([sys, dia]) => {
        const expected = sys && dia ? `${sys}/${dia}` : sys ? `${sys}` : '';

        if (expected && bloodPressure.value !== expected) {
            bloodPressure.value = expected;
        }
    },
);
</script>

<template>
    <div class="space-y-6">
        <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.border-input]:bg-muted/40 [&_input]:bg-muted/40"
        >
            <!-- 1. Berat Badan (kg) -->
            <FormInput
                id="weight"
                v-model="form.weight"
                label="Berat Badan (kg)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 58.0"
                :error="form.errors.weight"
            />

            <!-- 2. Tinggi Badan (cm) -->
            <FormInput
                id="height"
                v-model="form.height"
                label="Tinggi Badan (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 158.0"
                :error="form.errors.height"
            />

            <!-- 3. Index Massa Tubuh  -->
            <FormSelect
                id="bmi_category"
                v-model="form.bmi_category"
                label="Index Massa Tubuh"
                placeholder="Terhitung otomatis..."
                :options="bmiCategories"
                :error="form.errors.bmi_category"
            />

            <!-- 4. Lingkar Perut (cm) -->
            <FormInput
                id="abdominal_circumference"
                v-model="form.abdominal_circumference"
                label="Lingkar Perut (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Normal: P < 80, L < 90"
                :error="form.errors.abdominal_circumference"
            />

            <!-- 5. Tekanan Darah (mmHg) -->
            <FormInput
                id="blood_pressure"
                v-model="bloodPressure"
                label="Tekanan Darah (mmHg)"
                placeholder="Contoh: 120/80"
                :error="
                    form.errors.systolic_pressure ||
                    form.errors.diastolic_pressure
                "
            />

            <!-- 6. Gula Darah -->
            <FormInput
                id="blood_sugar"
                v-model="form.blood_sugar"
                label="Gula Darah (mg/dL)"
                inputmode="decimal"
                is-decimal
                placeholder="Normal < 200"
                :error="form.errors.blood_sugar"
            />

            <!-- 7. Asam Urat (mg/dL) -->
            <FormInput
                id="uric_acid"
                v-model="form.uric_acid"
                label="Asam Urat (mg/dL)"
                inputmode="decimal"
                is-decimal
                placeholder="P: 2.4-6.0 | L: 3.4-7.0"
                :error="form.errors.uric_acid"
            />

            <!-- 8. Kolesterol (mg/dL) -->
            <FormInput
                id="cholesterol"
                v-model="form.cholesterol"
                label="Kolesterol (mg/dL)"
                inputmode="decimal"
                is-decimal
                placeholder="Normal < 200"
                :error="form.errors.cholesterol"
            />

            <!-- 9. Tes Penglihatan (Mata) -->
            <FormSelect
                id="eye_test"
                v-model="form.eye_test"
                label="Tes Penglihatan (Mata)"
                placeholder="Pilih hasil tes mata..."
                :options="sensoryResults"
                :error="form.errors.eye_test"
            />

            <!-- 10. Tes Pendengaran (Telinga) -->
            <FormSelect
                id="ear_test"
                v-model="form.ear_test"
                label="Tes Pendengaran (Telinga)"
                placeholder="Pilih hasil tes telinga..."
                :options="sensoryResults"
                :error="form.errors.ear_test"
            />

            <!-- 11. Riwayat Penyakit Keluarga -->
            <FormMultiSelect
                id="family_disease_history"
                v-model="form.family_disease_history"
                label="Riwayat Penyakit Keluarga"
                placeholder="Pilih riwayat penyakit keluarga..."
                :options="diseaseHistories"
                none-option="Tidak Ada"
                :error="form.errors.family_disease_history"
            />

            <!-- 12. Riwayat Penyakit Diri Sendiri -->
            <FormMultiSelect
                id="personal_disease_history"
                v-model="form.personal_disease_history"
                label="Riwayat Penyakit Diri Sendiri"
                placeholder="Pilih riwayat komorbid lansia..."
                :options="diseaseHistories"
                none-option="Tidak Ada"
                :error="form.errors.personal_disease_history"
            />
        </div>

        <div class="border-t border-border/60 pt-5">
            <div class="mb-4">
                <h4 class="text-sm font-semibold text-foreground">
                    Pengkajian Kemandirian Lansia (ADL)
                </h4>
                <p class="text-xs text-muted-foreground">
                    Evaluasi kemampuan fungsional lansia dalam beraktivitas
                    sehari-hari dan penentuan tingkat kemandirian.
                </p>
            </div>
            <div
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.border-input]:bg-muted/40"
            >
                <FormSelect
                    v-for="item in questions"
                    :key="item.key"
                    :id="item.key"
                    v-model="form.adl_screenings[item.key]"
                    :label="item.question"
                    placeholder="Pilih..."
                    :options="item.options ?? []"
                    :error="form.errors?.[`adl_screenings.${item.key}`]"
                />

                <!-- Tingkat Kemandirian -->
                <FormSelect
                    id="independence_level"
                    v-model="form.independence_level"
                    label="Tingkat Kemandirian"
                    placeholder="Pilih tingkat kemandirian..."
                    :options="independenceLevels"
                    :error="form.errors.independence_level"
                />
            </div>
        </div>
    </div>
</template>
