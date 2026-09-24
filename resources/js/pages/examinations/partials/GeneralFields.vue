<script setup lang="ts">
import { computed } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput, FormMultiSelect, FormSelect } from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

const props = withDefaults(
    defineProps<{
        locations?: FilterOption[];
        tbcSymptoms?: FilterOption[];
        educationTopics?: FilterOption[];
        section?: 'session' | 'evaluation';
        category?: string;
    }>(),
    {
        section: 'session',
        locations: () => [],
        tbcSymptoms: () => [],
        educationTopics: () => [],
    },
);

// Filter materi edukasi sesuai kategori sasaran (khusus balita atau umum)
const filteredEducationOptions = computed(() => {
    if (props.category === 'toddler') {
        return props.educationTopics.filter((opt) =>
            ['mp_asi_animal_protein', 'phbs'].includes(opt.value),
        );
    }

    return props.educationTopics.filter(
        (opt) => opt.value !== 'mp_asi_animal_protein',
    );
});
</script>

<template>
    <div>
        <div
            v-if="section === 'session'"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 [&_[data-slot=select-trigger]]:bg-muted/40 [&_[role=combobox]]:bg-muted/40 [&_input]:bg-muted/40"
        >
            <!-- Tanggal Pemeriksaan -->
            <FormInput
                id="examination_date"
                v-model="form.examination_date"
                label="Tanggal Pemeriksaan"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                :error="form.errors.examination_date"
            />

            <!-- Lokasi Pemeriksaan -->
            <FormSelect
                id="location"
                v-model="form.location"
                label="Lokasi Pelayanan"
                placeholder="Pilih lokasi pelayanan..."
                :options="locations"
                :error="form.errors.location"
            />
        </div>
        <div v-if="section === 'evaluation'" class="space-y-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- 1. Skrining Gejala TBC -->
                <FormMultiSelect
                    id="skrining_tbc"
                    v-model="form.skrining_tbc"
                    label="Skrining Gejala TBC"
                    placeholder="Pilih gejala TBC jika ada..."
                    :options="tbcSymptoms"
                    none-option="Tidak Ada Gejala"
                    :error="form.errors.skrining_tbc"
                />

                <!-- 2. Edukasi & Penyuluhan KIE -->
                <FormMultiSelect
                    id="edukasi"
                    v-model="form.edukasi"
                    label="Edukasi & Penyuluhan"
                    placeholder="Pilih materi edukasi yang disampaikan..."
                    :options="filteredEducationOptions"
                    :error="form.errors.edukasi"
                />
            </div>

            <!-- Status Rujukan ke Puskesmas / Faskes -->
            <div
                class="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5"
            >
                <Checkbox
                    id="is_referred"
                    v-model="form.is_referred"
                    class="mt-1"
                />
                <div class="grid gap-1 leading-none">
                    <label
                        for="is_referred"
                        class="cursor-pointer text-sm font-bold text-foreground select-none"
                    >
                        Perlu Dirujuk ke Puskesmas / Fasilitas Pelayanan
                        Kesehatan
                    </label>
                    <p class="text-xs text-muted-foreground">
                        Centang jika hasil pengukuran, skrining, atau kondisi
                        peserta membutuhkan penanganan medis rujukan lebih
                        lanjut ke Puskesmas.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
