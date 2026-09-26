<script setup lang="ts">
import { Head, Link, setLayoutProps, useForm } from '@inertiajs/vue3';
import { Save } from '@lucide/vue';
import { computed, watch } from 'vue';
import { store } from '@/actions/App/Http/Controllers/Examinations/ExaminationController';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import ProfileSummary from '@/components/ProfileSummary.vue';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form';
import { useAutoClearErrors } from '@/composables/useAutoClear';
import { dashboard } from '@/routes';
import * as participants from '@/routes/participants';
import type { FilterOption, ParticipantItem, ScreeningItem } from '@/types';
import ElderlyFields from './partials/ElderlyFields.vue';
import GeneralFields from './partials/GeneralFields.vue';
import PregnantFields from './partials/PregnantFields.vue';
import ProductiveFields from './partials/ProductiveFields.vue';
import TeenFields from './partials/TeenFields.vue';
import ToddlerFields from './partials/ToddlerFields.vue';

const props = defineProps<{
    participant: ParticipantItem;
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
    contraceptiveMethods: FilterOption[];
    screenings?: Record<string, ScreeningItem[]>;
}>();

// Breadcrumb dinamis yang mencantumkan nama peserta secara aman
setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pendaftaran Peserta', href: participants.index.url() },
        {
            title: props.participant?.name ?? 'Peserta',
            href: props.participant?.ulid
                ? participants.show({ participant: props.participant.ulid }).url
                : '#',
        },
        { title: 'Catat Pemeriksaan' },
    ],
});

const form = useForm({
    participant_id: props.participant?.id ? String(props.participant.id) : '',
    examination_date: new Date().toISOString().split('T')[0],
    location: '',
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
    pregnancy_id: props.participant?.latest_pregnancy?.id
        ? String(props.participant.latest_pregnancy.id)
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

const activeParticipant = computed(() => props.participant);

// Auto-kalkulasi IMT (Hanya aktif untuk kategori: Remaja, Usia Produktif, dan Lansia)
watch(
    [
        () => form.weight,
        () => form.height,
        () => activeParticipant.value?.category,
    ],
    ([newWeight, newHeight, category]) => {
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
    if (!props.participant?.ulid) {
        return;
    }

    form.post(store({ participant: props.participant.ulid }).url, {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head :title="`Catat Pemeriksaan - ${props.participant?.name ?? ''}`" />

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6 sm:pb-6"
    >
        <!-- Header Halaman -->
        <header class="flex items-center justify-between gap-4">
            <Heading
                title="Catat Pemeriksaan Baru"
                :description="`Formulir pencatatan hasil pengukuran dan pemeriksaan kesehatan posyandu untuk ${props.participant?.name ?? ''}`"
                class="mb-0 sm:mb-0"
            />
        </header>

        <!-- Profile Summary Peserta Reusable (Tanpa Card Wrapper, Terpisah Gap) -->
        <ProfileSummary :participant="props.participant" />

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
                    :questions="screenings?.teenager ?? []"
                />

                <!-- Form Kategori Usia Produktif -->
                <ProductiveFields
                    v-else-if="activeParticipant.category === 'productive'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    :disease-histories="diseaseHistories"
                    :contraceptive-methods="contraceptiveMethods"
                    :questions="screenings?.productive ?? []"
                />

                <!-- Form Kategori Lansia -->
                <ElderlyFields
                    v-else-if="activeParticipant.category === 'adult'"
                    v-model:form="form"
                    :bmi-categories="bmiCategories"
                    :sensory-results="sensoryResults"
                    :independence-levels="independenceLevels"
                    :disease-histories="diseaseHistories"
                    :questions="screenings?.adult ?? []"
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
                <!-- Tombol Batal: Hanya tampil di Desktop (sm+) -->
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    class="hidden shadow-none sm:inline-flex"
                    as-child
                >
                    <Link
                        :href="
                            props.participant?.ulid
                                ? participants.show({
                                      participant: props.participant.ulid,
                                  }).url
                                : participants.index.url()
                        "
                    >
                        <span>Batal</span>
                    </Link>
                </Button>

                <!-- Tombol Simpan: Full-width di Mobile, Auto di Desktop -->
                <Button
                    type="submit"
                    size="lg"
                    :disabled="form.processing || !form.participant_id"
                    class="w-full cursor-pointer gap-2 font-medium sm:w-auto"
                >
                    <Save v-if="!form.processing" class="h-4 w-4" />
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Pemeriksaan</span>
                </Button>
            </ActionBar>
        </form>
    </div>
</template>
