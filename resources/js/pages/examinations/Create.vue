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
    mental_screenings: {} as Record<string, string>,
    uric_acid: '',
    cholesterol: '',
    eye_test: '',
    ear_test: '',
    contraceptive: '',
    is_smoking: null as boolean | null,
    high_sugar_intake: null as boolean | null,
    high_salt_intake: null as boolean | null,
    high_fat_intake: null as boolean | null,
    puma_score: 0,
    puma_screenings: {} as Record<string, string>,
    adl_score: 0,
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

// Kategori sasaran yang menggunakan 4 section (karena memiliki instrumen kuesioner terpisah)
const isFourSections = computed(() => {
    return ['teenager', 'productive', 'adult'].includes(
        activeParticipant.value?.category ?? '',
    );
});

// Judul & deskripsi dinamis untuk Section 02
const sectionTwoMeta = computed(() => {
    if (isFourSections.value) {
        return {
            title: 'Pemeriksaan Fisik & Klinis',
            description:
                'Pencatatan antropometri, tanda vital, dan riwayat kesehatan',
        };
    }

    return {
        title: 'Pemeriksaan Kesehatan',
        description:
            'Pencatatan hasil pengukuran fisik, klinis, dan skrining spesifik sasaran',
    };
});

// Judul & deskripsi dinamis untuk Section 03 skrining khusus sasaran
const screeningMeta = computed(() => {
    switch (activeParticipant.value?.category) {
        case 'teenager':
            return {
                title: 'Skrining Kesehatan Mental & Emosional Remaja',
                description:
                    'Instrumen 7 pertanyaan evaluasi kesehatan mental, beban psikologis, dan perilaku remaja',
            };
        case 'productive':
            return {
                title: 'Skrining Risiko Paru (PUMA)',
                description:
                    'Kuesioner deteksi dini gangguan pernapasan dan risiko Penyakit Paru Obstruktif Kronis (PPOK)',
            };
        case 'adult':
            return {
                title: 'Pengkajian Fungsional Lansia (ADL)',
                description:
                    'Instrumen evaluasi kemandirian aktivitas sehari-hari menggunakan Indeks Barthel',
            };
        default:
            return {
                title: 'Skrining Khusus Sasaran',
                description: 'Instrumen evaluasi kesehatan spesifik kategori',
            };
    }
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

// Auto-kalkulasi IMT jika BB dan TB terisi
watch([() => form.weight, () => form.height], ([newWeight, newHeight]) => {
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
    }
});

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

            <FormSection
                v-if="activeParticipant"
                number="02"
                :title="sectionTwoMeta.title"
                :description="sectionTwoMeta.description"
            >
                <!-- Form Kategori Balita -->
                <ToddlerFields
                    v-if="activeParticipant.category === 'toddler'"
                    v-model:form="form"
                    :weight-statuses="weightStatuses"
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
                    section="physical"
                />

                <!-- Form Kategori Usia Produktif -->
                <ProductiveFields
                    v-else-if="activeParticipant.category === 'productive'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    section="physical"
                />

                <!-- Form Kategori Lansia (Pemeriksaan Fisik & Klinis) -->
                <ElderlyFields
                    v-else-if="activeParticipant.category === 'adult'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    :independence-levels="independenceLevels"
                    section="physical"
                />
            </FormSection>

            <!-- Section 03 Khusus Remaja, Produktif & Lansia (Instrumen Skrining Khusus) -->
            <FormSection
                v-if="isFourSections && activeParticipant"
                number="03"
                :title="screeningMeta.title"
                :description="screeningMeta.description"
            >
                <TeenFields
                    v-if="activeParticipant.category === 'teenager'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    section="mental"
                />

                <ProductiveFields
                    v-else-if="activeParticipant.category === 'productive'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    section="screening"
                />

                <ElderlyFields
                    v-else-if="activeParticipant.category === 'adult'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    :independence-levels="independenceLevels"
                    section="screening"
                />
            </FormSection>

            <FormSection
                :number="isFourSections ? '04' : '03'"
                title="Edukasi, Skrining TBC & Rujukan"
                description="Skrining gejala batuk TBC, penyuluhan KIE, dan evaluasi rujukan fasilitas kesehatan"
            >
                <GeneralFields
                    v-model:form="form"
                    :locations="locations"
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
