<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Save, X } from '@lucide/vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form';
import { useAutoClearErrors } from '@/composables/useAutoClear';
import { dashboard } from '@/routes';
import { index as participantsIndex, update } from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';
import ContactFields from './partials/ContactFields.vue';
import IdentityFields from './partials/IdentityFields.vue';

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

useAutoClearErrors(form);

const submit = () => {
    form.put(update({ participant: props.participant.ulid }).url, {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head :title="`Data Peserta - ${props.participant.name}`" />

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6 sm:pb-6"
    >
        <!-- 1. Judul Halaman Bersih -->
        <header>
            <Heading
                title="Edit Data Peserta"
                :description="`Perbarui data diri, kontak, dan informasi peserta ${props.participant.name}.`"
                class="mb-0 sm:mb-0"
            />
        </header>

        <form @submit.prevent="submit" class="flex flex-1 flex-col gap-6">
            <!-- 01. Data Diri Peserta -->
            <FormSection number="01" title="Data Diri Peserta">
                <IdentityFields
                    v-model:form="form"
                    :gender="props.gender"
                    :membership-bpjs="props.membershipBpjs"
                    :employment="props.employment"
                    :marital-status="props.maritalStatus"
                />
            </FormSection>

            <!-- 02. Kontak dan Alamat -->
            <FormSection number="02" title="Kontak dan Alamat">
                <ContactFields v-model:form="form" />
            </FormSection>

            <ActionBar>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    class="shadow-none"
                    as-child
                >
                    <Link :href="participantsIndex()">
                        <X class="h-4 w-4" />
                        <span>Kembali</span>
                    </Link>
                </Button>
                <Button
                    type="submit"
                    size="lg"
                    :disabled="form.processing"
                    class="cursor-pointer font-medium"
                >
                    <Save class="h-4 w-4" />
                    <span v-if="form.processing">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                </Button>
            </ActionBar>
        </form>
    </div>
</template>
