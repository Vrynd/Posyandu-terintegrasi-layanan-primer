<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Pencil, Save, Trash, X } from '@lucide/vue';
import { ref, watch } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    FormInput,
    FormSection,
    FormSelect,
    FormTextarea,
} from '@/components/ui/form';
import { dashboard } from '@/routes';
import { index as participantsIndex, update } from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta', href: participantsIndex() },
            { title: 'Detail & Edit Peserta' },
        ],
    },
});

const props = defineProps<{
    participant: ParticipantItem;
    category?: FilterOption[];
    gender?: FilterOption[];
    membershipBpjs?: FilterOption[];
    employment?: FilterOption[];
    maritalStatus?: FilterOption[];
}>();

const form = useForm({
    category: props.participant.category ?? '',
    name: props.participant.name ?? '',
    nik: props.participant.nik ?? props.participant.nik_masked ?? '',
    birth_date: props.participant.birth_date
        ? props.participant.birth_date.split('T')[0]
        : '',
    gender: props.participant.gender ?? '',
    address: props.participant.address ?? '',
    rt: props.participant.rt ?? '',
    rw: props.participant.rw ?? '',
    phone: props.participant.phone ?? '',
    has_bpjs: props.participant.has_bpjs ? '1' : '0',
    bpjs_number: props.participant.bpjs_number ?? '',
    parent_name:
        props.participant.toddler?.parent_name ??
        props.participant.teen?.parent_name ??
        '',
    husband_name: props.participant.latest_pregnancy?.husband_name ?? '',
    employment: props.participant.adult?.employment ?? '',
    employment_other: props.participant.adult?.employment_other ?? '',
    marital_status: props.participant.adult?.marital_status ?? '',
});

// Auto-clear error saat field yang bermasalah diedit
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

const isEditing = ref(false);
// 2. Fungsi toggle mode edit
const toggleEdit = () => {
    isEditing.value = !isEditing.value;

    if (!isEditing.value) {
        form.reset(); // Kembalikan data form ke data awal jika user klik batal
        form.clearErrors();
    }
};

const submit = () => {
    form.put(update({ participant: props.participant.ulid }).url, {
        preserveScroll: true,
        onSuccess: () => {
            isEditing.value = false;
        },
    });
};
</script>

<template>
    <Head :title="`Data Peserta - ${props.participant.name}`" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                :title="`${props.participant.name}`"
                description="Pantau dan perbarui informasi peserta."
                variant="small"
            />
            <div class="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    class="cursor-pointer"
                    @click="toggleEdit"
                >
                    <Pencil v-if="!isEditing" class="h-4 w-4" />
                    <X v-else class="h-4 w-4" />
                    <span class="hidden sm:inline">{{
                        isEditing ? 'Batal' : 'Edit Profil'
                    }}</span>
                </Button>
                <Button variant="destructive" as-child>
                    <Link>
                        <Trash class="h-4 w-4" />
                        <span class="hidden sm:inline">Hapus</span>
                    </Link>
                </Button>
            </div>
        </header>

        <!-- Formulir Data Peserta -->
        <form @submit.prevent="submit" class="flex flex-1 flex-col gap-6">
            <fieldset
                :disabled="!isEditing"
                class="group flex flex-col gap-6 transition-opacity duration-200"
                :class="{ 'cursor-not-allowed opacity-65': !isEditing }"
            >
                <!-- 01. Data Diri Peserta -->
                <FormSection
                    number="01"
                    title="Data Diri Peserta"
                    :locked="!isEditing"
                >
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        :class="{ '**:cursor-not-allowed': !isEditing }"
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
                            :options="props.gender ?? []"
                            :disabled="form.category === 'pregnant_mother'"
                            :error="form.errors.gender"
                        />
                        <FormSelect
                            id="has_bpjs"
                            v-model="form.has_bpjs"
                            label="Kepesertaan BPJS"
                            placeholder="Pilih status BPJS"
                            :options="props.membershipBpjs ?? []"
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
                            :options="props.maritalStatus ?? []"
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
                            :options="props.employment ?? []"
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

                <!-- 02. Kontak dan Alamat -->
                <FormSection
                    number="02"
                    title="Kontak dan Alamat"
                    :locked="!isEditing"
                >
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        :class="{ '**:cursor-not-allowed': !isEditing }"
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
            </fieldset>

            <div
                v-if="isEditing"
                class="flex items-center justify-end gap-3 pt-2"
            >
                <Button type="button" variant="outline" @click="toggleEdit">
                    Batal
                </Button>
                <Button
                    type="submit"
                    :disabled="form.processing"
                    class="min-w-35 cursor-pointer font-medium"
                >
                    <Save class="mr-1.5 h-4 w-4" />
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                </Button>
            </div>
        </form>
    </main>
</template>
