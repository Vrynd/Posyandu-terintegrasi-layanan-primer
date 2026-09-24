<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Save, X } from '@lucide/vue';
import { watch } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import CategorySelector from '@/components/CategorySelector.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSection } from '@/components/ui/form';
import { useAutoClearErrors } from '@/composables/useAutoClear';
import { dashboard } from '@/routes';
import {
    create,
    index as participantsIndex,
    store,
} from '@/routes/participants';
import ContactFields from './partials/ContactFields.vue';
import IdentityFields from './partials/IdentityFields.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta', href: participantsIndex() },
            { title: 'Tambah Peserta', href: create() },
        ],
    },
});

defineProps<{
    category: Array<{ label: string; value: string }>;
    gender: Array<{ label: string; value: string }>;
    membershipBpjs: Array<{ label: string; value: string }>;
    employment: Array<{ label: string; value: string }>;
    maritalStatus: Array<{ label: string; value: string }>;
}>();

const form = useForm({
    category: '',
    name: '',
    nik: '',
    birth_date: '',
    gender: '',
    address: '',
    rt: '',
    rw: '',
    phone: '',
    has_bpjs: '',
    bpjs_number: '',
    parent_name: '',
    husband_name: '',
    pregnancy_number: '',
    birth_spacing_years: '',
    weight_before_pregnancy: '',
    height: '',
    last_menstrual_period: '',
    employment: '',
    employment_other: '',
    marital_status: '',
    and_examine: false,
});

// Auto-clear error & border merah seketika saat field yang memiliki error diedit
useAutoClearErrors(form);

watch(
    () => form.category,
    (newCategory, oldCategory) => {
        form.parent_name = '';
        form.husband_name = '';
        form.pregnancy_number = '';
        form.birth_spacing_years = '';
        form.weight_before_pregnancy = '';
        form.height = '';
        form.last_menstrual_period = '';
        form.marital_status = '';
        form.employment = '';
        form.employment_other = '';

        if (newCategory === 'pregnant_mother') {
            form.gender = 'female';
        } else if (oldCategory === 'pregnant_mother') {
            form.gender = '';
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
    <Head title="Tambah Peserta Baru" />

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6 sm:pb-6"
    >
        <header>
            <Heading
                title="Tambah Peserta Baru"
                description="Isi formulir berikut untuk mendaftarkan sasaran posyandu baru"
                class="mb-0 sm:mb-0"
            />
        </header>

        <form @submit.prevent="submit" class="flex flex-1 flex-col gap-6">
            <FormSection
                number="01"
                title="Pilih Kategori Peserta"
                :completed="Boolean(form.category)"
            >
                <CategorySelector
                    v-model="form.category"
                    :options="category"
                    :error="form.errors.category"
                />
            </FormSection>

            <FormSection
                number="02"
                title="Data Diri Peserta"
                :disabled="!form.category"
            >
                <IdentityFields
                    v-model:form="form"
                    :gender="gender"
                    :membership-bpjs="membershipBpjs"
                    :employment="employment"
                    :marital-status="maritalStatus"
                />
            </FormSection>

            <FormSection
                number="03"
                title="Kontak dan Alamat"
                :disabled="!form.category"
            >
                <ContactFields v-model:form="form" />
            </FormSection>

            <!-- Opsi Lanjutan: Checkbox Lanjut Pemeriksaan -->
            <div
                class="flex items-start gap-4 rounded-2xl border border-card bg-card/80 px-4 py-4 sm:px-5 dark:border-border"
            >
                <Checkbox
                    id="and_examine"
                    v-model="form.and_examine"
                    :disabled="!form.category"
                    class="mt-0.5"
                />
                <div class="grid gap-1 leading-none">
                    <label
                        for="and_examine"
                        class="cursor-pointer text-sm font-medium text-foreground select-none"
                    >
                        Langsung catat pemeriksaan kesehatan
                    </label>
                    <p class="text-xs text-muted-foreground">
                        Setelah peserta berhasil didaftarkan, sistem akan
                        otomatis membuka formulir pemeriksaan.
                    </p>
                </div>
            </div>

            <!-- Aksi Form: Sticky Floating di Mobile, Flow Standar di Desktop -->
            <ActionBar>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    class="shadow-none"
                    as-child
                >
                    <Link :href="participantsIndex()">
                        <X class="h-4 w-4" />
                        <span>Kembali</span>
                    </Link>
                </Button>
                <Button
                    type="submit"
                    size="lg"
                    :disabled="form.processing || !form.category"
                    class="cursor-pointer font-medium"
                >
                    <Save v-if="!form.processing" class="h-4 w-4" />
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Peserta</span>
                </Button>
            </ActionBar>
        </form>
    </div>
</template>
