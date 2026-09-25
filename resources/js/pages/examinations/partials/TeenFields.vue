<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    FormInput,
    FormMultiSelect,
    FormRadioYesNo,
    FormSelect,
} from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

const props = defineProps<{
    bmiCategories: FilterOption[];
    diseaseHistories: FilterOption[];
    riskBehaviors: FilterOption[];
    gender?: string;
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

watch(
    () => props.gender,
    (newGender) => {
        if (newGender !== 'female') {
            form.value.hemoglobin = '';
        }
    },
    { immediate: true },
);

// 2. Instrumen 7 Pertanyaan Skrining Mental Remaja (Kemenkes)
const mentalQuestions = [
    {
        key: 'nyaman_di_rumah',
        question: 'Apakah kamu merasa nyaman di rumah?',
    },
    {
        key: 'beban_sekolah',
        question: 'Apakah kamu merasa ada beban di sekolah?',
    },
    {
        key: 'citra_tubuh',
        question: 'Apakah ada yang kamu suka atau tidak suka pada tubuhmu?',
    },
    {
        key: 'zat_adiktif',
        question:
            'Apakah kamu pernah mengonsumsi rokok/alkohol atau obat-obatan (narkoba)?',
    },
    {
        key: 'seksual_pranikah',
        question:
            'Apakah kamu pernah melakukan hubungan seksual dengan laki-laki/perempuan?',
    },
    {
        key: 'keamanan_lingkungan',
        question:
            'Apakah kamu merasa tidak aman di rumah/lingkungan sekolah/di masyarakat/di jalan?',
    },
    {
        key: 'teman_luar_grup',
        question: 'Apakah kamu mempunyai teman di luar grupmu?',
    },
    {
        key: 'ingin_bunuh_diri',
        question: 'Apakah kamu pernah merasa ingin bunuh diri?',
    },
];
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
                placeholder="Contoh: 48.5 kg"
                :error="form.errors.weight"
            />

            <!-- 2. Tinggi Badan (cm) -->
            <FormInput
                id="height"
                v-model="form.height"
                label="Tinggi Badan (cm)"
                inputmode="decimal"
                is-decimal
                placeholder="Contoh: 155.0 cm"
                :error="form.errors.height"
            />

            <!-- 3. Kategori IMT -->
            <FormSelect
                id="bmi_category"
                v-model="form.bmi_category"
                label="Indeks Massa Tubuh"
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
                placeholder="Batas: P < 80, L < 90 cm"
                :error="form.errors.abdominal_circumference"
            />

            <!-- 5. Tekanan Darah (mmHg) -->
            <FormInput
                id="blood_pressure"
                v-model="bloodPressure"
                label="Tekanan Darah (mmHg)"
                placeholder="Contoh: 120/80 mmHg"
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
                placeholder="Contoh: 90 "
                :error="form.errors.blood_sugar"
            />

            <!-- 7. Kadar Hemoglobin (Hb) Remaja Putri -->
            <FormInput
                v-if="gender === 'female'"
                id="hemoglobin"
                v-model="form.hemoglobin"
                label="Kadar Hemoglobin Remaja Putri (g/dL)"
                placeholder="Contoh: 12.5 atau < 12"
                :error="form.errors.hemoglobin"
            />

            <!-- 8. Riwayat Penyakit Keluarga -->
            <FormMultiSelect
                id="family_disease_history"
                v-model="form.family_disease_history"
                label="Riwayat Penyakit Keluarga"
                placeholder="Pilih riwayat penyakit keluarga..."
                :options="diseaseHistories"
                none-option="Tidak Ada"
                :error="form.errors.family_disease_history"
            />

            <!-- 9. Perilaku Berisiko Diri Sendiri-->
            <FormMultiSelect
                id="risk_behaviors"
                v-model="form.risk_behaviors"
                label="Perilaku Berisiko Diri Sendiri"
                placeholder="Pilih perilaku berisiko..."
                :options="riskBehaviors"
                none-option="Tidak Ada"
                :error="form.errors.risk_behaviors"
            />
        </div>

        <div class="border-t border-border/60 pt-5">
            <div class="mb-4">
                <h4 class="text-sm font-semibold text-foreground">
                    Skrining Kesehatan Mental & Emosional Remaja
                </h4>
                <p class="text-xs text-muted-foreground">
                    Kuesioner evaluasi kesehatan mental, beban psikologis, dan
                    perilaku remaja (Kemenkes).
                </p>
            </div>

            <div
                class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.border-input]:bg-muted/40"
            >
                <FormRadioYesNo
                    v-for="item in mentalQuestions"
                    :key="item.key"
                    :id="`mental_${item.key}`"
                    v-model="form.mental_screenings[item.key]"
                    :name="`mental_${item.key}`"
                    :label="item.question"
                    yes-label="Ya"
                    no-label="Tidak"
                />
            </div>
        </div>
    </div>
</template>
