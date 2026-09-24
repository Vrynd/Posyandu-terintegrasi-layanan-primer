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

withDefaults(
    defineProps<{
        bmiCategories: FilterOption[];
        sensoryResults: FilterOption[];
        section?: 'physical' | 'screening' | 'all';
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

// 1. Opsi Riwayat Penyakit Keluarga (8 Opsi)
const familyDiseaseOptions = [
    'Hipertensi',
    'Diabetes Melitus',
    'Stroke',
    'Jantung',
    'Asma',
    'Kanker',
    'Kolestrol Tinggi',
    'Tidak Ada',
];

// 2. Opsi Riwayat Penyakit Diri Sendiri (9 Opsi)
const personalDiseaseOptions = [
    'Hipertensi',
    'Diabetes Melitus',
    'Stroke',
    'Penyakit Jantung',
    'Asma / Alergi',
    'Kolesterol Tinggi',
    'Asam Urat Tinggi',
    'Penyakit Paru / TBC',
    'Tidak Ada',
];

// 3. Opsi Alat Kontrasepsi (KB) Standar Posyandu
const contraceptiveOptions = [
    { value: 'Spiral', label: 'Spiral / IUD' },
    { value: 'Implan', label: 'Implan / Susuk' },
    { value: 'Pil', label: 'Pil KB' },
    { value: 'Kondom', label: 'Kondom' },
    { value: 'Steril Wanita', label: 'Steril Wanita (MOW)' },
    { value: 'Menopause', label: 'Sudah Menopause' },
    { value: 'Tidak KB', label: 'Tidak Menggunakan KB' },
];

// 4. Kuesioner 4 Pertanyaan PUMA (Skrining Paru / PPOK)
const pumaQuestions = [
    {
        key: 'napas_pendek',
        question:
            'Apakah Anda pernah merasa napas pendek ketika berjalan lebih cepat pada jalan datar atau sedikit menanjak?',
    },
    {
        key: 'dahak_paru',
        question:
            'Apakah Anda mempunyai dahak yang berasal dari paru atau kesulitan mengeluarkan dahak saat sedang tidak flu?',
    },
    {
        key: 'batuk_non_flu',
        question: 'Apakah Anda biasanya batuk saat sedang tidak menderita flu?',
    },
    {
        key: 'pernah_spirometri',
        question:
            'Apakah dokter/nakes pernah meminta Anda melakukan pemeriksaan spirometri atau peakflow meter (meniup ke alat)?',
    },
];

const setPumaAnswer = (key: string, value: 'ya' | 'tidak') => {
    if (
        !form.value.puma_screenings ||
        typeof form.value.puma_screenings !== 'object' ||
        Array.isArray(form.value.puma_screenings)
    ) {
        form.value.puma_screenings = {};
    }

    if (form.value.puma_screenings[key] === value) {
        delete form.value.puma_screenings[key];
    } else {
        form.value.puma_screenings[key] = value;
    }

    // Kalkulasi skor skrining: Ya = 1, Tidak = 0
    let score = 0;
    Object.values(form.value.puma_screenings).forEach((ans) => {
        if (ans === 'ya') {
            score += 1;
        }
    });

    form.value.puma_score = score;
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
                    placeholder="Contoh: 65.0"
                    :error="form.errors.weight"
                />

                <!-- Tinggi Badan (cm) -->
                <FormInput
                    id="height"
                    v-model="form.height"
                    label="Tinggi Badan (TB) (cm)"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 165.0"
                    :error="form.errors.height"
                />

                <!-- Lingkar Perut (cm) -->
                <FormInput
                    id="abdominal_circumference"
                    v-model="form.abdominal_circumference"
                    label="Lingkar Perut (cm)"
                    type="number"
                    step="0.1"
                    placeholder="Normal: P < 80, L < 90"
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

                <!-- Gula Darah Sewaktu (GDS) -->
                <FormInput
                    id="blood_sugar"
                    v-model="form.blood_sugar"
                    label="Gula Darah Sewaktu (GDS) (mg/dL)"
                    type="number"
                    step="0.1"
                    placeholder="Normal < 200"
                    :error="form.errors.blood_sugar"
                />

                <!-- Kolesterol Total (mg/dL) -->
                <FormInput
                    id="cholesterol"
                    v-model="form.cholesterol"
                    label="Kolesterol Total (mg/dL)"
                    type="number"
                    step="0.1"
                    placeholder="Normal < 200"
                    :error="form.errors.cholesterol"
                />

                <!-- Asam Urat (mg/dL) -->
                <FormInput
                    id="uric_acid"
                    v-model="form.uric_acid"
                    label="Asam Urat (mg/dL)"
                    type="number"
                    step="0.1"
                    placeholder="P: 2.4-6.0 | L: 3.4-7.0"
                    :error="form.errors.uric_acid"
                />

                <!-- Tes Penglihatan (Mata) -->
                <FormSelect
                    id="eye_test"
                    v-model="form.eye_test"
                    label="Tes Penglihatan (Mata)"
                    placeholder="Pilih hasil tes mata..."
                    :options="sensoryResults"
                    :error="form.errors.eye_test"
                />

                <!-- Tes Pendengaran (Telinga) -->
                <FormSelect
                    id="ear_test"
                    v-model="form.ear_test"
                    label="Tes Pendengaran (Telinga)"
                    placeholder="Pilih hasil tes telinga..."
                    :options="sensoryResults"
                    :error="form.errors.ear_test"
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

                <!-- Riwayat Penyakit Diri Sendiri -->
                <FormMultiSelect
                    id="personal_disease_history"
                    v-model="form.personal_disease_history"
                    label="Riwayat Penyakit Diri Sendiri"
                    placeholder="Pilih riwayat penyakit diri sendiri..."
                    :options="personalDiseaseOptions"
                    :error="form.errors.personal_disease_history"
                />

                <!-- Penggunaan Alat Kontrasepsi (KB) -->
                <FormSelect
                    id="contraceptive"
                    v-model="form.contraceptive"
                    label="Penggunaan Alat Kontrasepsi (KB)"
                    placeholder="Pilih jenis alat kontrasepsi yang digunakan..."
                    :options="contraceptiveOptions"
                    :error="form.errors.contraceptive"
                />

                <!-- Merokok -->
                <FormRadioYesNo
                    id="is_smoking"
                    name="is_smoking"
                    label="Merokok"
                    v-model="form.is_smoking"
                    :error="form.errors.is_smoking"
                />

                <!-- Konsumsi Tinggi Gula -->
                <FormRadioYesNo
                    id="high_sugar_intake"
                    name="high_sugar_intake"
                    label="Konsumsi Tinggi Gula"
                    v-model="form.high_sugar_intake"
                    :error="form.errors.high_sugar_intake"
                />

                <!-- Konsumsi Tinggi Garam -->
                <FormRadioYesNo
                    id="high_salt_intake"
                    name="high_salt_intake"
                    label="Konsumsi Tinggi Garam"
                    v-model="form.high_salt_intake"
                    :error="form.errors.high_salt_intake"
                />

                <!-- Konsumsi Tinggi Lemak -->
                <FormRadioYesNo
                    id="high_fat_intake"
                    name="high_fat_intake"
                    label="Konsumsi Tinggi Lemak"
                    v-model="form.high_fat_intake"
                    :error="form.errors.high_fat_intake"
                />
            </div>
        </template>

        <!-- Kuesioner Skrining PUMA (Deteksi PPOK) -->
        <template v-if="section === 'screening' || section === 'all'">
            <div
                class="divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/10"
            >
                <div
                    v-for="(item, idx) in pumaQuestions"
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
                            @click="setPumaAnswer(item.key, 'ya')"
                            class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all"
                            :class="[
                                form.puma_screenings?.[item.key] === 'ya'
                                    ? 'bg-destructive text-destructive-foreground shadow-xs'
                                    : 'border border-border/80 text-muted-foreground hover:bg-muted',
                            ]"
                        >
                            Ya
                        </button>
                        <button
                            type="button"
                            @click="setPumaAnswer(item.key, 'tidak')"
                            class="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all"
                            :class="[
                                form.puma_screenings?.[item.key] === 'tidak'
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
