<script setup lang="ts">
import { FormInput } from '@/components/ui/form';

const form = defineModel<any>('form', { required: true });
</script>

<template>
    <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <FormInput
            id="start_date"
            v-model="form.start_date"
            type="date"
            label="Tanggal Mulai"
            :error="form.errors?.start_date"
        />
        <FormInput
            id="end_date"
            v-model="form.end_date"
            type="date"
            label="Tanggal Selesai (Opsional)"
            :error="form.errors?.end_date"
        />
        <FormInput
            id="start_time"
            v-model="form.start_time"
            type="time"
            label="Waktu Mulai (WIB)"
            :error="form.errors?.start_time"
        />
        <FormInput
            id="end_time"
            v-model="form.end_time"
            type="time"
            label="Waktu Selesai (WIB)"
            :error="form.errors?.end_time"
        />
    </div>
</template>
