<script setup lang="ts">
import { ClipboardCheck } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { FormInput, FormMultiSelect, FormSelect } from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

withDefaults(
    defineProps<{
        bmiCategories: FilterOption[];
        sensoryResults: FilterOption[];
        independenceLevels: FilterOption[];
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

// 1. Opsi Riwayat Penyakit Keluarga
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

// 2. Opsi Riwayat Penyakit Diri Sendiri
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

// 3. Instrumen Pengkajian Fungsional ADL (Aktivitas Kehidupan Sehari-hari - Indeks Barthel)
const adlActivities = [
    {
        key: 'pengendalian_bab',
        name: 'Pengendalian Buang Air Besar',
        options: [
            {
                value: '0',
                label: 'Tidak Terkendali / Tak Teratur Perlu Pencahar = 0',
            },
            {
                value: '1',
                label: 'Kadang-kadang Tak Terkendali (1x/minggu) = 1',
            },
            { value: '2', label: 'Terkendali / Teratur = 2' },
        ],
    },
    {
        key: 'pengendalian_bak',
        name: 'Pengendalian Buang Air Kecil',
        options: [
            { value: '0', label: 'Tidak Terkendali Pakai Kateter = 0' },
            {
                value: '1',
                label: 'Kadang-kadang Tak Terkendali (1x24 jam) = 1',
            },
            { value: '2', label: 'Mandiri = 2' },
        ],
    },
    {
        key: 'kebersihan_diri',
        name: 'Kebersihan Diri',
        options: [
            { value: '0', label: 'Butuh Pertolongan = 0' },
            { value: '1', label: 'Mandiri = 1' },
        ],
    },
    {
        key: 'penggunaan_wc',
        name: 'Penggunaan WC',
        options: [
            { value: '0', label: 'Butuh Pertolongan = 0' },
            {
                value: '1',
                label: 'Perlu Pertolongan Pada Kegiatan Tertentu = 1',
            },
            { value: '2', label: 'Mandiri = 2' },
        ],
    },
    {
        key: 'makan_minum',
        name: 'Makan dan Minum',
        options: [
            { value: '0', label: 'Tidak Mampu / Disuapi = 0' },
            {
                value: '1',
                label: 'Perlu Pertolongan (Memotong Makanan dll) = 1',
            },
            { value: '2', label: 'Mandiri = 2' },
        ],
    },
    {
        key: 'transfer_kursi_roda',
        name: 'Bergerak dari Kursi Roda ke Tempat Tidur',
        options: [
            { value: '0', label: 'Tidak Mampu / Tidak Seimbang = 0' },
            { value: '1', label: 'Bisa Pindah dengan Kursi Roda = 1' },
            { value: '2', label: 'Berjalan dengan Bantuan 1 Orang = 2' },
            { value: '3', label: 'Mandiri = 3' },
        ],
    },
    {
        key: 'berjalan_tempat_rata',
        name: 'Berjalan Ditempat Rata',
        options: [
            { value: '0', label: 'Tidak Mampu = 0' },
            { value: '1', label: 'Bisa Pindah dengan Kursi Roda = 1' },
            { value: '2', label: 'Berjalan dengan Bantuan 1 Orang = 2' },
            { value: '3', label: 'Mandiri = 3' },
        ],
    },
    {
        key: 'naik_turun_tangga',
        name: 'Naik Turun Tangga',
        options: [
            { value: '0', label: 'Tidak Mampu = 0' },
            { value: '1', label: 'Butuh Pertolongan = 1' },
            { value: '2', label: 'Mandiri = 2' },
        ],
    },
];

const getAdlValue = (key: string): string => {
    const val = form.value.adl_screenings?.[key];

    return val !== undefined && val !== null ? String(val) : '';
};

const setAdlScore = (activityKey: string, score: number) => {
    if (
        !form.value.adl_screenings ||
        typeof form.value.adl_screenings !== 'object' ||
        Array.isArray(form.value.adl_screenings)
    ) {
        form.value.adl_screenings = {};
    }

    form.value.adl_screenings = {
        ...form.value.adl_screenings,
        [activityKey]: score,
    };

    // Kalkulasi total skor ADL (skala 0 - 20)
    let totalScore = 0;
    const answeredCount = Object.keys(form.value.adl_screenings).length;
    Object.values(form.value.adl_screenings).forEach((val) => {
        totalScore += Number(val || 0);
    });

    form.value.adl_score = totalScore;

    // Klasifikasi Tingkat Kemandirian Barthel jika semua 8 aktivitas telah dinilai
    if (answeredCount === adlActivities.length) {
        if (totalScore >= 17) {
            form.value.independence_level = 'independent';
        } else if (totalScore >= 12) {
            form.value.independence_level = 'mild';
        } else if (totalScore >= 9) {
            form.value.independence_level = 'moderate';
        } else if (totalScore >= 5) {
            form.value.independence_level = 'severe';
        } else {
            form.value.independence_level = 'total';
        }
    } else {
        form.value.independence_level = '';
    }
};

const independenceBadge = computed(() => {
    const level = form.value.independence_level;
    const answeredCount = form.value.adl_screenings
        ? Object.keys(form.value.adl_screenings).length
        : 0;

    if (answeredCount === 0 && !level) {
        return {
            label: 'Belum Dinilai',
            class: 'bg-muted text-muted-foreground border-border',
        };
    }

    if (answeredCount > 0 && answeredCount < adlActivities.length) {
        return {
            label: `Belum Lengkap (${answeredCount}/${adlActivities.length} Terisi)`,
            class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
    }

    switch (level) {
        case 'independent':
            return {
                label: 'Mandiri (Skor 17-20)',
                class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            };
        case 'mild':
            return {
                label: 'Ketergantungan Ringan (Skor 12-16)',
                class: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
            };
        case 'moderate':
            return {
                label: 'Ketergantungan Sedang (Skor 9-11)',
                class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            };
        case 'severe':
            return {
                label: 'Ketergantungan Berat (Skor 5-8)',
                class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            };
        case 'total':
            return {
                label: 'Ketergantungan Total (Skor 0-4)',
                class: 'bg-destructive/10 text-destructive border-destructive/20',
            };
        default:
            return {
                label: 'Belum Dinilai',
                class: 'bg-muted text-muted-foreground border-border',
            };
    }
});
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
                    placeholder="Contoh: 58.0"
                    :error="form.errors.weight"
                />

                <!-- Tinggi Badan (cm) -->
                <FormInput
                    id="height"
                    v-model="form.height"
                    label="Tinggi Badan (TB) (cm)"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 158.0"
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

                <!-- Tekanan Darah (mmHg) -->
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

                <!-- Riwayat Penyakit Diri Sendiri (Komorbid Lansia) -->
                <FormMultiSelect
                    id="personal_disease_history"
                    v-model="form.personal_disease_history"
                    label="Riwayat Penyakit Diri Sendiri (Komorbid)"
                    placeholder="Pilih riwayat komorbid lansia..."
                    :options="personalDiseaseOptions"
                    :error="form.errors.personal_disease_history"
                />
            </div>
        </template>

        <!-- 8 Aktivitas Pengkajian Fungsional ADL & Ringkasan Hasil -->
        <template v-if="section === 'screening' || section === 'all'">
            <div class="space-y-6">
                <div
                    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <FormSelect
                        v-for="act in adlActivities"
                        :key="act.key"
                        :id="act.key"
                        :model-value="getAdlValue(act.key)"
                        @update:model-value="
                            (val) => setAdlScore(act.key, Number(val))
                        "
                        :label="act.name"
                        placeholder="Pilih..."
                        :options="act.options"
                        :error="form.errors?.[`adl_screenings.${act.key}`]"
                    />
                </div>

                <!-- Banner Ringkasan: Skor Total di Kiri & Tingkat Kemandirian di Kanan -->
                <div
                    class="flex flex-col justify-between gap-4 rounded-xl border p-4 transition-all sm:flex-row sm:items-center"
                    :class="[
                        form.adl_score > 0 || form.independence_level
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-border/60 bg-muted/20',
                    ]"
                >
                    <!-- Skor Total di Kiri -->
                    <div class="flex items-center gap-3.5">
                        <div
                            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
                        >
                            <ClipboardCheck class="h-5 w-5 stroke-[2.2]" />
                        </div>
                        <div>
                            <div
                                class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
                            >
                                Total Skor ADL
                            </div>
                            <div
                                class="text-lg font-extrabold text-foreground sm:text-xl"
                            >
                                <span class="text-primary">{{
                                    form.adl_score ?? 0
                                }}</span>
                                <span
                                    class="text-xs font-medium text-muted-foreground"
                                >
                                    / 20 poin</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Tingkat Kemandirian di Kanan -->
                    <div
                        class="flex flex-col gap-1.5 self-start sm:items-end sm:self-center"
                    >
                        <div
                            class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
                        >
                            Tingkat Kemandirian
                        </div>
                        <span
                            class="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold shadow-xs sm:text-sm"
                            :class="independenceBadge.class"
                        >
                            {{ independenceBadge.label }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
