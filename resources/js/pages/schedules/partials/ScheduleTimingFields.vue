<script setup lang="ts">
import { FormInput } from '@/components/ui/form';

const form = defineModel<any>('form', { required: true });
</script>

<template>
    <!-- Grid 1 Kolom di Mobile (Satu per Satu), 2 Kolom di Tablet, 4 Kolom di Desktop -->
    <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- 1. Tanggal Mulai (Wajib) -->
        <div>
            <FormInput
                id="start_date"
                v-model="form.start_date"
                type="date"
                label="Tanggal Mulai"
                :error="form.errors?.start_date"
            />
        </div>

        <!-- 2. Tanggal Selesai (Opsional - Kosongkan jika 1 hari) -->
        <div>
            <FormInput
                id="end_date"
                v-model="form.end_date"
                type="date"
                label="Tanggal Selesai (Opsional)"
                :error="form.errors?.end_date"
            />
        </div>

        <!-- 3. Jam Mulai -->
        <div>
            <FormInput
                id="start_time"
                v-model="form.start_time"
                type="time"
                label="Waktu Mulai (WIB)"
                :error="form.errors?.start_time"
            />
        </div>

        <!-- 4. Jam Selesai -->
        <div>
            <FormInput
                id="end_time"
                v-model="form.end_time"
                type="time"
                label="Waktu Selesai (WIB)"
                :error="form.errors?.end_time"
            />
        </div>
    </div>
</template>
