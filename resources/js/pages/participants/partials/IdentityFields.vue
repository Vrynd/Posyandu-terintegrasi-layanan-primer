<script setup lang="ts">
import { FormInput, FormSelect } from '@/components/ui/form';
import {
    isChildOrTeen,
    isPregnantMother,
    isProductiveOrAdult,
} from '@/lib/formatters';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

defineProps<{
    gender?: FilterOption[];
    membershipBpjs?: FilterOption[];
    employment?: FilterOption[];
    maritalStatus?: FilterOption[];
}>();
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Nama Lengkap -->
        <FormInput
            id="name"
            v-model="form.name"
            label="Nama Lengkap"
            placeholder="Nama lengkap peserta"
            required
            :error="form.errors.name"
        />

        <!-- NIK -->
        <FormInput
            id="nik"
            v-model="form.nik"
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="16 digit nomor NIK"
            inputmode="numeric"
            maxlength="16"
            :only-numeric="true"
            :error="form.errors.nik"
        />

        <!-- Tanggal Lahir -->
        <FormInput
            id="birth_date"
            v-model="form.birth_date"
            label="Tanggal Lahir"
            type="date"
            required
            :max="new Date().toISOString().split('T')[0]"
            :error="form.errors.birth_date"
        />

        <!-- Jenis Kelamin -->
        <FormSelect
            id="gender"
            v-model="form.gender"
            label="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            required
            :options="gender ?? []"
            :disabled="isPregnantMother(form.category)"
            :error="form.errors.gender"
        />

        <!-- Kepesertaan BPJS -->
        <FormSelect
            id="has_bpjs"
            v-model="form.has_bpjs"
            label="Kepesertaan BPJS"
            placeholder="Pilih status BPJS"
            :options="membershipBpjs ?? []"
            :error="form.errors.has_bpjs"
        />

        <!-- Nomor Kartu BPJS (Tampil jika memiliki BPJS) -->
        <FormInput
            v-if="
                form.has_bpjs === '1' ||
                form.has_bpjs === true ||
                form.has_bpjs === 'true'
            "
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
            v-if="isChildOrTeen(form.category)"
            id="parent_name"
            v-model="form.parent_name"
            label="Nama Orang Tua / Wali"
            placeholder="Nama ayah / ibu / wali"
            :error="form.errors.parent_name"
        />

        <FormInput
            v-if="isPregnantMother(form.category)"
            id="husband_name"
            v-model="form.husband_name"
            label="Nama Suami"
            placeholder="Nama suami"
            :error="form.errors.husband_name"
        />
        <FormSelect
            v-if="isProductiveOrAdult(form.category)"
            id="marital_status"
            v-model="form.marital_status"
            label="Status Perkawinan"
            placeholder="Pilih status perkawinan"
            :options="maritalStatus ?? []"
            :error="form.errors.marital_status"
        />
        <FormSelect
            v-if="isProductiveOrAdult(form.category)"
            id="employment"
            v-model="form.employment"
            label="Pekerjaan"
            placeholder="Pilih jenis pekerjaan"
            :options="employment ?? []"
            :error="form.errors.employment"
        />
        <FormInput
            v-if="
                isProductiveOrAdult(form.category) &&
                form.employment === 'other'
            "
            id="employment_other"
            v-model="form.employment_other"
            label="Sebutkan Pekerjaan"
            placeholder="Contoh: Seniman, Penjahit, dll."
            :error="form.errors.employment_other"
        />
    </div>
</template>
