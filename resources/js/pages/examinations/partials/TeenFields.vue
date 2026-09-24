<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormInput, FormMultiSelect, FormSelect } from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

withDefaults(
    defineProps<{
        bmiCategories: FilterOption[];
        section?: 'physical' | 'mental' | 'all';
    }>(),
    {
        section: 'all',
    },
);

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

// 2. Opsi Riwayat Penyakit Keluarga
const familyDiseaseOptions = [
    'Hipertensi',
    'Diabetes Melitus',
    'Stroke',
    'Penyakit Jantung',
    'Asma / Alergi',
    'Kanker',
    'Kolesterol Tinggi',
    'Tidak Ada',
];

// 3. Opsi Perilaku Berisiko Remaja (6 Opsi Baku CERDIK Kemenkes)
const riskBehaviorOptions = [
    'Merokok',
    'Kurang Aktivitas Fisik',
    'Kurang Sayur dan Buah',
    'Konsumsi Alkohol',
    'Konsumsi Gula/Garam/Lemak Berlebih',
    'Tidak Ada',
];

// 4. Instrumen 7 Pertanyaan Skrining Mental Remaja (Ya / Tidak)
const mentalQuestions = [
    {
        key: 'beban_sekolah',
        question: 'Apakah kamu merasa ada beban di sekolah?',
    },
    {
        key: 'citra_tubuh',
        question: 'Apakah ada yang kamu suka atau tidak suka pada tubuhmu?',
    },
    {
        key: 'teman_luar_grup',
        question: 'Apakah kamu mempunyai teman di luar grupmu?',
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
        key: 'ingin_bunuh_diri',
        question: 'Apakah kamu pernah merasa ingin bunuh diri?',
    },
];

const setMentalAnswer = (key: string, value: 'ya' | 'tidak') => {
    if (
        !form.value.mental_screenings ||
        typeof form.value.mental_screenings !== 'object' ||
        Array.isArray(form.value.mental_screenings)
    ) {
        form.value.mental_screenings = {};
    }

    form.value.mental_screenings[key] = value;
};
</script>

<template>
    <div class="space-y-6">
        <template v-if="section === 'physical' || section === 'all'">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Berat Badan (kg) -->
                <FormInput
                    id="weight"
                    v-model="form.weight"
                    label="Berat Badan (BB) (kg)"
                    type="number"
                    step="0.01"
                    placeholder="Contoh: 48.5"
                    :error="form.errors.weight"
                />

                <!-- Tinggi Badan (cm) -->
                <FormInput
                    id="height"
                    v-model="form.height"
                    label="Tinggi Badan (TB) (cm)"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 155.0"
                    :error="form.errors.height"
                />

                <!-- Lingkar Perut (cm) -->
                <FormInput
                    id="abdominal_circumference"
                    v-model="form.abdominal_circumference"
                    label="Lingkar Perut (cm)"
                    type="number"
                    step="0.1"
                    placeholder="Batas: P < 80, L < 90"
                    :error="form.errors.abdominal_circumference"
                />

                <!-- Kategori IMT -->
                <FormSelect
                    id="bmi_category"
                    v-model="form.bmi_category"
                    label="Kategori IMT (Otomatis)"
                    placeholder="Terhitung otomatis..."
                    :options="bmiCategories"
                    :error="form.errors.bmi_category"
                />

                <!-- Tekanan Darah 1 Field Tunggal (mmHg) -->
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

                <!-- Gula Darah Sewaktu (mg/dL) -->
                <FormInput
                    id="blood_sugar"
                    v-model="form.blood_sugar"
                    label="Gula Darah Sewaktu (GDS) (mg/dL)"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 90"
                    :error="form.errors.blood_sugar"
                />

                <!-- Kadar Hemoglobin (Hb) Remaja Putri -->
                <FormInput
                    id="hemoglobin"
                    v-model="form.hemoglobin"
                    label="Kadar Hemoglobin (Hb Putri) (g/dL)"
                    placeholder="Contoh: 12.5 atau < 12"
                    :error="form.errors.hemoglobin"
                />

                <!-- Riwayat Penyakit Keluarga -->
                <FormMultiSelect
                    id="family_disease_history"
                    v-model="form.family_disease_history"
                    label="Riwayat Penyakit Keluarga"
                    placeholder="Pilih riwayat penyakit keluarga..."
                    :options="familyDiseaseOptions"
                    :error="form.errors.family_disease_history"
                />

                <!-- Perilaku Berisiko Diri Sendiri -->
                <FormMultiSelect
                    id="risk_behaviors"
                    v-model="form.risk_behaviors"
                    label="Perilaku Berisiko Diri Sendiri"
                    placeholder="Pilih perilaku berisiko..."
                    :options="riskBehaviorOptions"
                    :error="form.errors.risk_behaviors"
                />
            </div>
        </template>

        <template v-if="section === 'mental' || section === 'all'">
            <div
                class="divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/10"
            >
                <div
                    v-for="(item, idx) in mentalQuestions"
                    :key="item.key"
                    class="flex flex-col justify-between gap-3 p-3.5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center"
                >
                    <div class="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span class="font-bold text-primary"
                            >{{ idx + 1 }}.</span
                        >
                        <span class="font-medium text-foreground">{{
                            item.question
                        }}</span>
                    </div>
                    <div
                        class="flex shrink-0 items-center gap-2 self-end sm:self-center"
                    >
                        <button
                            type="button"
                            @click="setMentalAnswer(item.key, 'ya')"
                            class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all"
                            :class="[
                                form.mental_screenings?.[item.key] === 'ya'
                                    ? 'bg-destructive text-destructive-foreground shadow-xs'
                                    : 'border border-border/80 text-muted-foreground hover:bg-muted',
                            ]"
                        >
                            Ya
                        </button>
                        <button
                            type="button"
                            @click="setMentalAnswer(item.key, 'tidak')"
                            class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all"
                            :class="[
                                form.mental_screenings?.[item.key] === 'tidak'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'border border-border/80 text-muted-foreground hover:bg-muted',
                            ]"
                        >
                            Tidak
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
