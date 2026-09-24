<script setup lang="ts">
import { computed } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput, FormSelect } from '@/components/ui/form';
import type { FilterOption } from '@/types';

const form = defineModel<Record<string, any>>('form', { required: true });

const props = withDefaults(
    defineProps<{
        locations: FilterOption[];
        section?: 'session' | 'evaluation';
        category?: string;
    }>(),
    {
        section: 'session',
    },
);

const tbcOptions = [
    'Demam Lebih dari 2 minggu',
    'Batuk Terus Menerus',
    'Keringat Malam Tanpa Aktivitas',
    'Berat Badan Tidak Naik',
    'Kontak Erat Penderita TBC',
    'Tidak Ada Gejala',
];

const edukasiOptions = computed(() => {
    if (props.category === 'toddler') {
        return [
            'MP-ASI Kaya Protein Hewani',
            'Kebersihan Diri & Lingkungan (PHBS)',
        ];
    }

    return [
        'Germas (Gerakan Masyarakat Hidup Sehat)',
        'Isi Piringku & Gizi Seimbang',
        'Pencegahan Anemia',
        'Aktivitas Fisik Rutin',
        'Bahaya Rokok & Asap Rokok',
        'Kebersihan Diri & Lingkungan (PHBS)',
    ];
});

const toggleArrayItem = (field: 'skrining_tbc' | 'edukasi', item: string) => {
    if (!form.value[field]) {
        form.value[field] = [];
    }

    const index = form.value[field].indexOf(item);

    if (index > -1) {
        form.value[field].splice(index, 1);
    } else {
        form.value[field].push(item);
    }
};
</script>

<template>
    <div>
        <!-- SECTION 01: WAKTU DAN LOKASI PELAYANAN -->
        <div
            v-if="section === 'session'"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2"
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

            <!-- Lokasi Pemeriksaan (Default Kosong agar kader memilih secara sadar) -->
            <FormSelect
                id="location"
                v-model="form.location"
                label="Lokasi Pelayanan"
                placeholder="Pilih lokasi pelayanan..."
                :options="locations"
                :error="form.errors.location"
            />
        </div>

        <!-- SECTION 03: EDUKASI, SKRINING TBC & RUJUKAN -->
        <div v-if="section === 'evaluation'" class="space-y-6">
            <!-- Skrining Gejala TBC -->
            <div class="space-y-3">
                <div>
                    <h4 class="text-sm font-bold text-foreground">
                        Skrining Gejala TBC
                    </h4>
                    <p class="text-xs text-muted-foreground">
                        Pilih gejala batuk dan kondisi yang dialami sasaran
                        untuk deteksi dini TBC.
                    </p>
                </div>
                <div
                    class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <label
                        v-for="item in tbcOptions"
                        :key="item"
                        class="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 p-3 text-xs transition-colors hover:bg-muted/40 sm:text-sm"
                        :class="{
                            'border-primary/60 bg-primary/5':
                                form.skrining_tbc?.includes(item),
                        }"
                    >
                        <input
                            type="checkbox"
                            :checked="form.skrining_tbc?.includes(item)"
                            @change="toggleArrayItem('skrining_tbc', item)"
                            class="rounded border-border text-primary focus:ring-primary"
                        />
                        <span class="font-medium text-foreground">{{
                            item
                        }}</span>
                    </label>
                </div>
            </div>

            <!-- Materi Edukasi & Konseling KIE -->
            <div class="space-y-3">
                <div>
                    <h4 class="text-sm font-bold text-foreground">
                        Edukasi & Penyuluhan
                    </h4>
                    <p class="text-xs text-muted-foreground">
                        Centang topik komunikasi, informasi, dan edukasi (KIE)
                        yang telah disampaikan kepada sasaran.
                    </p>
                </div>
                <div
                    class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <label
                        v-for="item in edukasiOptions"
                        :key="item"
                        class="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 p-3 text-xs transition-colors hover:bg-muted/40 sm:text-sm"
                        :class="{
                            'border-primary/60 bg-primary/5':
                                form.edukasi?.includes(item),
                        }"
                    >
                        <input
                            type="checkbox"
                            :checked="form.edukasi?.includes(item)"
                            @change="toggleArrayItem('edukasi', item)"
                            class="rounded border-border text-primary focus:ring-primary"
                        />
                        <span class="font-medium text-foreground">{{
                            item
                        }}</span>
                    </label>
                </div>
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
