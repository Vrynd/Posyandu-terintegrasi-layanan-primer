<script setup lang="ts">
import { FormInput, FormTextarea } from '@/components/ui/form';

const form = defineModel<Record<string, any>>('form', { required: true });
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Nomor WhatsApp / HP -->
        <FormInput
            id="phone"
            v-model="form.phone"
            label="Nomor Telepon / WhatsApp"
            placeholder="Contoh: 081234567890"
            maxlength="15"
            inputmode="tel"
            :error="form.errors.phone"
        />

        <!-- RT -->
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

        <!-- RW -->
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

        <!-- Alamat Lengkap -->
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
</template>
