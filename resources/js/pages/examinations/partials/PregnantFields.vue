<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormInput, FormRadioYesNo } from '@/components/ui/form';

const form = defineModel<Record<string, any>>('form', { required: true });

// Input tunggal Tekanan Darah (Contoh: 120/80)
const bloodPressure = ref(
    form.value.systolic_pressure && form.value.diastolic_pressure
        ? `${form.value.systolic_pressure}/${form.value.diastolic_pressure}`
        : form.value.systolic_pressure
          ? `${form.value.systolic_pressure}`
          : '',
);

// Sinkronisasi teks "120/80" ke form.systolic_pressure dan form.diastolic_pressure
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

// Sinkronisasi balik jika form diubah secara eksternal
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
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- 1. Usia Kehamilan (Minggu) -->
        <FormInput
            id="gestational_age_weeks"
            v-model="form.gestational_age_weeks"
            label="Usia Kehamilan (Minggu)"
            type="number"
            placeholder="Contoh: 24"
            :error="form.errors.gestational_age_weeks"
        />

        <!-- 2. Berat Badan Sekarang (kg) -->
        <FormInput
            id="weight"
            v-model="form.weight"
            label="Berat Badan Sekarang (kg)"
            type="number"
            step="0.01"
            placeholder="Contoh: 62.5"
            :error="form.errors.weight"
        />

        <!-- 3. Lingkar Lengan (cm) -->
        <FormInput
            id="upper_arm_circumference"
            v-model="form.upper_arm_circumference"
            label="Lingkar Lengan (cm)"
            type="number"
            step="0.1"
            placeholder="Contoh: 23.5 cm"
            :error="form.errors.upper_arm_circumference"
        />

        <!-- 4. Tekanan Darah (mmHg) -->
        <FormInput
            id="blood_pressure"
            v-model="bloodPressure"
            label="Tekanan Darah (mmHg)"
            placeholder="Contoh: 120/80"
            :error="
                form.errors.systolic_pressure || form.errors.diastolic_pressure
            "
        />

        <!-- 5. Tablet Tambah Darah (TTD) -->
        <FormRadioYesNo
            id="has_iron_tablets"
            v-model="form.has_iron_tablets"
            name="has_iron_tablets"
            label="Tablet Tambah Darah (TTD)"
            :error="form.errors.has_iron_tablets"
        />

        <!-- 6. PMT Pemulihan Bumil KEK -->
        <FormRadioYesNo
            id="receives_pmt_kek"
            v-model="form.receives_pmt_kek"
            name="receives_pmt_kek"
            label="PMT Pemulihan Bumil KEK"
            :error="form.errors.receives_pmt_kek"
        />

        <!-- 7. Konseling ASI Eksklusif -->
        <FormRadioYesNo
            id="exclusive_breastfeeding_counseling"
            v-model="form.exclusive_breastfeeding_counseling"
            name="exclusive_breastfeeding_counseling"
            label="Konseling ASI Eksklusif"
            :error="form.errors.exclusive_breastfeeding_counseling"
        />

        <!-- 8. Kelas Ibu Hamil -->
        <FormRadioYesNo
            id="attends_prenatal_class"
            v-model="form.attends_prenatal_class"
            name="attends_prenatal_class"
            label="Kelas Ibu Hamil"
            :error="form.errors.attends_prenatal_class"
        />
    </div>
</template>
