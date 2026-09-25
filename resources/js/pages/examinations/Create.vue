<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Save } from '@lucide/vue';
import { computed, watch } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form';
import { useAutoClearErrors } from '@/composables/useAutoClear';
import { dashboard } from '@/routes';
import { index, store } from '@/routes/examinations';
import type { FilterOption, ParticipantItem } from '@/types';
import ElderlyFields from './partials/ElderlyFields.vue';
import GeneralFields from './partials/GeneralFields.vue';
import PregnantFields from './partials/PregnantFields.vue';
import ProductiveFields from './partials/ProductiveFields.vue';
import TeenFields from './partials/TeenFields.vue';
import ToddlerFields from './partials/ToddlerFields.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pemeriksaan', href: index() },
            { title: 'Catat Pemeriksaan Baru' },
        ],
    },
});

const props = defineProps<{
    participants: ParticipantItem[];
    selectedParticipant: ParticipantItem | null;
    locations: FilterOption[];
    weightStatuses: FilterOption[];
    bmiCategories: FilterOption[];
    sensoryResults: FilterOption[];
    independenceLevels: FilterOption[];
    tbcSymptoms: FilterOption[];
    educationTopics: FilterOption[];
    toddlerInterventions: FilterOption[];
    diseaseHistories: FilterOption[];
    riskBehaviors: FilterOption[];
}>();

const form = useForm({
    participant_id: props.selectedParticipant
        ? String(props.selectedParticipant.id)
        : '',
    examination_date: new Date().toISOString().split('T')[0],
    location: '', // Dibiarkan kosong agar kader memilih secara sadar
    weight: '',
    is_referred: false,
    skrining_tbc: [] as string[],
    edukasi: [] as string[],

    // Balita
    age_in_months: '',
    weight_status: '',
    head_circumference: '',
    arm_circumference: '',
    has_illness_symptoms: null as boolean | null,
    interventions: [] as string[],

    // Bumil
    pregnancy_id: props.selectedParticipant?.latest_pregnancy?.id
        ? String(props.selectedParticipant.latest_pregnancy.id)
        : '',
    gestational_age_weeks: '',
    upper_arm_circumference: '',
    systolic_pressure: '',
    diastolic_pressure: '',
    has_iron_tablets: null as boolean | null,
    exclusive_breastfeeding_counseling: null as boolean | null,
    receives_pmt_kek: null as boolean | null,
    attends_prenatal_class: null as boolean | null,

    // Remaja, Produktif & Lansia
    height: '',
    abdominal_circumference: '',
    blood_sugar: '',
    hemoglobin: '',
    bmi_category: '',
    family_disease_history: [] as string[],
    risk_behaviors: [] as string[],
    personal_disease_history: [] as string[],
    mental_screenings: {} as Record<string, boolean>,
    uric_acid: '',
    cholesterol: '',
    eye_test: '',
    ear_test: '',
    contraceptive: '',
    is_smoking: null as boolean | null,
    high_sugar_intake: null as boolean | null,
    high_salt_intake: null as boolean | null,
    high_fat_intake: null as boolean | null,
    puma_score: null as number | null,
    puma_screenings: {} as Record<string, boolean>,
    adl_score: null as number | null,
    independence_level: '',
    adl_screenings: {} as Record<string, number>,
});

useAutoClearErrors(form);

// Mendapatkan objek peserta terpilih
const activeParticipant = computed(() => {
    if (!form.participant_id) {
        return null;
    }

    return (
        props.participants.find(
            (p) => String(p.id) === String(form.participant_id),
        ) || null
    );
});

// Set otomatis field saat peserta terpilih terdeteksi
watch(
    () => form.participant_id,
    (newId) => {
        const participant = props.participants.find(
            (p) => String(p.id) === String(newId),
        );

        if (participant) {
            if (
                participant.category === 'pregnant_mother' &&
                participant.latest_pregnancy
            ) {
                form.pregnancy_id = String(participant.latest_pregnancy.id);
            }
        }
    },
    { immediate: true },
);

// Auto-kalkulasi IMT (Hanya aktif untuk kategori: Remaja, Usia Produktif, dan Lansia)
watch(
    [
        () => form.weight,
        () => form.height,
        () => activeParticipant.value?.category,
    ],
    ([newWeight, newHeight, category]) => {
        // Balita & Ibu Hamil tidak menggunakan kalkulasi IMT dewasa
        if (!['teenager', 'productive', 'adult'].includes(category ?? '')) {
            form.bmi_category = '';

            return;
        }

        const w = parseFloat(newWeight);
        const h = parseFloat(newHeight) / 100;

        if (w > 0 && h > 0) {
            const bmi = w / (h * h);

            if (bmi < 17) {
                form.bmi_category = 'severely_underweight';
            } else if (bmi < 18.5) {
                form.bmi_category = 'underweight';
            } else if (bmi <= 25) {
                form.bmi_category = 'normal';
            } else if (bmi <= 27) {
                form.bmi_category = 'overweight';
            } else {
                form.bmi_category = 'obese';
            }
        } else {
            form.bmi_category = '';
        }
    },
);

const submit = () => {
    form.post(store().url, {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Catat Pemeriksaan Baru" />

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6 sm:pb-6"
    >
        <header class="flex items-center justify-between gap-4">
            <Heading
                title="Catat Pemeriksaan Baru"
                description="Formulir pencatatan hasil pengukuran dan pemeriksaan kesehatan posyandu"
                class="mb-0 sm:mb-0"
            />
            <Button variant="outline" size="sm" as-child>
                <Link :href="index()">
                    <ArrowLeft class="mr-1.5 h-4 w-4" />
                    <span>Kembali</span>
                </Link>
            </Button>
        </header>

        <form @submit.prevent="submit" class="flex flex-1 flex-col gap-6">
            <!-- SECTION 01: Waktu & Lokasi -->
            <FormSection
                number="01"
                title="Waktu dan Lokasi Pelayanan"
                description="Sesi pelaksanaan posyandu atau kunjungan rumah"
                :completed="Boolean(form.examination_date && form.location)"
            >
                <GeneralFields
                    v-model:form="form"
                    :locations="locations"
                    section="session"
                />
            </FormSection>

            <!-- SECTION 02: Pemeriksaan Kesehatan & Skrining Sasaran (3 Section Konsisten) -->
            <FormSection
                v-if="activeParticipant"
                number="02"
                title="Pemeriksaan Kesehatan & Skrining"
                description="Pencatatan hasil pengukuran fisik, klinis, dan instrumen skrining spesifik sasaran"
            >
                <!-- Form Kategori Balita -->
                <ToddlerFields
                    v-if="activeParticipant.category === 'toddler'"
                    v-model:form="form"
                    :weight-statuses="weightStatuses"
                    :interventions="toddlerInterventions"
                />

                <!-- Form Kategori Ibu Hamil -->
                <PregnantFields
                    v-else-if="activeParticipant.category === 'pregnant_mother'"
                    v-model:form="form"
                />

                <!-- Form Kategori Remaja -->
                <TeenFields
                    v-else-if="activeParticipant.category === 'teenager'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :disease-histories="diseaseHistories"
                    :risk-behaviors="riskBehaviors"
                    :gender="activeParticipant.gender"
                />

                <!-- Form Kategori Usia Produktif -->
                <ProductiveFields
                    v-else-if="activeParticipant.category === 'productive'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                />

                <!-- Form Kategori Lansia -->
                <ElderlyFields
                    v-else-if="activeParticipant.category === 'adult'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    :independence-levels="independenceLevels"
                />
            </FormSection>

            <!-- SECTION 03: Edukasi, Skrining TBC & Rujukan (Umum untuk Semua) -->
            <FormSection
                number="03"
                title="Edukasi, Skrining TBC & Rujukan"
                description="Skrining gejala batuk TBC, penyuluhan KIE, dan evaluasi rujukan fasilitas kesehatan"
            >
                <GeneralFields
                    v-model:form="form"
                    :locations="locations"
                    :tbc-symptoms="tbcSymptoms"
                    :education-topics="educationTopics"
                    :category="activeParticipant?.category"
                    section="evaluation"
                />
            </FormSection>

            <ActionBar>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    class="shadow-none"
                    as-child
                >
                    <Link :href="index()">
                        <span>Batal</span>
                    </Link>
                </Button>

                <Button
                    type="submit"
                    size="lg"
                    :disabled="form.processing || !form.participant_id"
                    class="cursor-pointer gap-2 font-medium"
                >
                    <Save v-if="!form.processing" class="h-4 w-4" />
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Pemeriksaan</span>
                </Button>
            </ActionBar>
        </form>
    </div>
</template>
