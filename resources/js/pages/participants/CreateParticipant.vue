<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { watch } from 'vue';
import CategorySelector from '@/components/CategorySelector.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    FormInput,
    FormSection,
    FormSelect,
    FormTextarea,
} from '@/components/ui/form';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta', href: '/participants' },
            { title: 'Tambah Peserta', href: '/participants/create' },
        ],
    },
});

defineProps<{
    category: Array<{ label: string; value: string }>;
    gender: Array<{ label: string; value: string }>;
    membershipBpjs: Array<{ label: string; value: string }>;
    employment: Array<{ label: string; value: string }>;
    martialStatus: Array<{ label: string; value: string }>;
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
watch(
    () => ({ ...form }),
    (newVal, oldVal) => {
        for (const key in form.errors) {
            const field = key as keyof typeof form.errors;

            if (
                form.errors[field] &&
                (newVal as Record<string, any>)[field] !==
                    (oldVal as Record<string, any>)[field]
            ) {
                form.clearErrors(field);
            }
        }
    },
);

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
    form.post('/participants', {
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
                <div
                    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <FormInput
                        id="name"
                        v-model="form.name"
                        label="Nama Lengkap"
                        placeholder="Nama lengkap peserta"
                        :error="form.errors.name"
                    />
                    <FormInput
                        id="nik"
                        v-model="form.nik"
                        label="Nomor Induk Kependudukan (NIK)"
                        placeholder="16 digit nomor induk kependudukan"
                        inputmode="numeric"
                        maxlength="16"
                        :only-numeric="true"
                        :error="form.errors.nik"
                    />
                    <FormInput
                        id="birth_date"
                        v-model="form.birth_date"
                        label="Tanggal Lahir"
                        type="date"
                        :max="new Date().toISOString().split('T')[0]"
                        :error="form.errors.birth_date"
                    />
                    <FormSelect
                        id="gender"
                        v-model="form.gender"
                        label="Jenis Kelamin"
                        placeholder="Pilih jenis kelamin"
                        :options="gender"
                        :disabled="form.category === 'pregnant_mother'"
                        :error="form.errors.gender"
                    />
                    <FormSelect
                        id="has_bpjs"
                        v-model="form.has_bpjs"
                        label="Kepersertaan BPJS"
                        placeholder="Pilih status BPJS"
                        :options="membershipBpjs"
                        :error="form.errors.has_bpjs"
                    />
                    <FormInput
                        v-if="form.has_bpjs === '1'"
                        id="bpjs_number"
                        v-model="form.bpjs_number"
                        label="Nomor BPJS Kesehatan"
                        placeholder="13 digit nomor kartu BPJS"
                        inputmode="numeric"
                        maxlength="13"
                        :only-numeric="true"
                        :error="form.errors.bpjs_number"
                    />
                    <FormInput
                        v-if="
                            form.category === 'toddler' ||
                            form.category === 'teenager'
                        "
                        id="parent_name"
                        v-model="form.parent_name"
                        label="Nama Orang Tua / Wali"
                        placeholder="Nama ayah / ibu / wali"
                        :error="form.errors.parent_name"
                    />
                    <FormInput
                        v-if="form.category === 'pregnant_mother'"
                        id="husband_name"
                        v-model="form.husband_name"
                        label="Nama Suami"
                        placeholder="Nama suami"
                        :error="form.errors.husband_name"
                    />
                    <FormSelect
                        v-if="
                            form.category === 'productive' ||
                            form.category === 'adult'
                        "
                        id="marital_status"
                        v-model="form.marital_status"
                        label="Status Perkawinan"
                        placeholder="Pilih status perkawinan"
                        :options="martialStatus"
                        :error="form.errors.marital_status"
                    />
                    <FormSelect
                        v-if="
                            form.category === 'productive' ||
                            form.category === 'adult'
                        "
                        id="employment"
                        v-model="form.employment"
                        label="Pekerjaan"
                        placeholder="Pilih jenis pekerjaan"
                        :options="employment"
                        :error="form.errors.employment"
                    />
                    <FormInput
                        v-if="
                            (form.category === 'productive' ||
                                form.category === 'adult') &&
                            form.employment === 'other'
                        "
                        id="employment_other"
                        v-model="form.employment_other"
                        label="Sebutkan Pekerjaan"
                        placeholder="Contoh: Seniman, Penjahit, dll."
                        :error="form.errors.employment_other"
                    />
                </div>
            </FormSection>

            <FormSection
                number="03"
                title="Kontak dan Alamat"
                :disabled="!form.category"
            >
                <div
                    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <FormInput
                        id="phone"
                        v-model="form.phone"
                        label="Nomor HP / WhatsApp"
                        type="tel"
                        inputmode="tel"
                        maxlength="15"
                        placeholder="Contoh: 081234567890"
                        :error="form.errors.phone"
                    />
                    <FormInput
                        id="rt"
                        v-model="form.rt"
                        label="RT"
                        placeholder="Contoh: 01"
                        maxlength="5"
                        inputmode="numeric"
                        :only-numeric="true"
                        :error="form.errors.rt"
                    />
                    <FormInput
                        id="rw"
                        v-model="form.rw"
                        label="RW"
                        placeholder="Contoh: 02"
                        maxlength="5"
                        inputmode="numeric"
                        :only-numeric="true"
                        :error="form.errors.rw"
                    />
                    <div class="sm:col-span-2 lg:col-span-3">
                        <FormTextarea
                            id="address"
                            v-model="form.address"
                            label="Alamat Lengkap"
                            placeholder="Nama jalan, nomor rumah, dusun, atau patokan tempat tinggal"
                            :error="form.errors.address"
                        />
                    </div>
                </div>
            </FormSection>

            <div class="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" as-child>
                    <Link href="/participants">Batal</Link>
                </Button>
                <Button
                    type="submit"
                    :disabled="form.processing || !form.category"
                    class="min-w-[140px] cursor-pointer font-medium"
                >
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Peserta</span>
                </Button>
            </div>
        </form>
    </main>
</template>
