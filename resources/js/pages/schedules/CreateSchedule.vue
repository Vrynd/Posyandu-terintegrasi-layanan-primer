<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import { ref } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form';
import { dashboard } from '@/routes';
import {
    create as createSchedule,
    index as scheduleIndex,
} from '@/routes/schedules';
import GeneralFields from './partials/GeneralFields.vue';
import TimingFields from './partials/TimingFields.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Jadwal Kegiatan', href: scheduleIndex() },
            { title: 'Tambah Jadwal', href: createSchedule() },
        ],
    },
});

const props = withDefaults(
    defineProps<{
        defaultDate?: string;
        locations?: Array<{
            value: string;
            label: string;
            description: string;
            icon?: string;
        }>;
    }>(),
    {
        defaultDate: () => '',
        locations: () => [],
    },
);

// State Form Sesuai 5 Field Acuan Tetap
const form = ref({
    title: '',
    location: '',
    start_date: props.defaultDate,
    end_date: '',
    start_time: '',
    end_time: '',
    errors: {} as Record<string, string>,
});
</script>

<template>
    <Head title="Tambah Jadwal Kegiatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header Halaman -->
        <header class="mb-6 sm:mb-8">
            <Heading
                title="Tambah Jadwal Kegiatan"
                description="Isi formulir berikut untuk merencanakan agenda posyandu baru"
                variant="small"
            />
        </header>

        <!-- 2. Kontainer Formulir Terpadu (2 Seksi Inti) -->
        <div class="flex max-w-4xl flex-1 flex-col gap-6 pb-24 sm:pb-8">
            <!-- SEKSI 01: INFORMASI UTAMA KEGIATAN (Judul & Lokasi dari Enum) -->
            <FormSection
                number="01"
                title="Informasi Utama Kegiatan"
                :completed="Boolean(form.title && form.location)"
            >
                <GeneralFields
                    v-model:form="form"
                    :locations="props.locations"
                />
            </FormSection>

            <!-- SEKSI 02: WAKTU & TANGGAL PELAKSANAAN -->
            <FormSection
                number="02"
                title="Waktu & Tanggal Pelaksanaan"
                :completed="Boolean(form.start_date)"
            >
                <TimingFields v-model:form="form" />
            </FormSection>

            <!-- TOMBOL AKSI UNIVERSAL MENGGUNAKAN ACTIONBAR -->
            <ActionBar>
                <Button
                    type="button"
                    variant="outline"
                    class="h-10 cursor-pointer text-xs sm:h-9"
                    as-child
                >
                    <Link :href="scheduleIndex()">Batal</Link>
                </Button>
                <Button
                    type="button"
                    class="h-10 cursor-pointer gap-2 text-xs font-semibold sm:h-9"
                >
                    <Plus class="size-4" />
                    <span>Jadwalkan Kegiatan</span>
                </Button>
            </ActionBar>
        </div>
    </div>
</template>
