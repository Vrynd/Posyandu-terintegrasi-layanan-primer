<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { watch } from 'vue';
import CategorySelector from '@/components/CategorySelector.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
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
    employment: '',
    employment_other: '',
    marital_status: '',
});

// Auto-clear error & border merah seketika saat field yang memiliki error diedit
useAutoClearErrors(form);

watch(
    () => form.category,
    (newCategory, oldCategory) => {
        form.parent_name = '';
        form.husband_name = '';
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

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header>
            <Heading
                title="Tambah Peserta Baru"
                description="Isi formulir berikut untuk mendaftarkan sasaran posyandu baru"
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

            <div class="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" as-child>
                    <Link :href="participantsIndex()">Batal</Link>
                </Button>
                <Button
                    type="submit"
                    :disabled="form.processing || !form.category"
                    class="min-w-35 cursor-pointer font-medium"
                >
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Peserta</span>
                </Button>
            </div>
        </form>
    </main>
</template>
