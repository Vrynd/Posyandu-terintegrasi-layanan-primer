<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { Pencil, Save, Trash, X } from '@lucide/vue';
import { ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form';
import { useAutoClearErrors } from '@/composables/useAutoClear';
import { dashboard } from '@/routes';
import {
    destroy,
    index as participantsIndex,
    update,
} from '@/routes/participants';
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

const isEditing = ref(false);
const toggleEdit = () => {
    isEditing.value = !isEditing.value;

    if (!isEditing.value) {
        form.reset();
        form.clearErrors();
    }
};

const showDeleteDialog = ref(false);
const isDeleting = ref(false);

const tapToDelete = () => {
    router.delete(destroy({ participant: props.participant.ulid }).url, {
        onStart: () => {
            isDeleting.value = true;
        },
        onFinish: () => {
            isDeleting.value = false;
            showDeleteDialog.value = false;
        },
    });
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
                <Button
                    type="button"
                    variant="destructive"
                    class="cursor-pointer"
                    @click="showDeleteDialog = true"
                >
                    <Trash class="h-4 w-4" />
                    <span class="hidden sm:inline">Hapus</span>
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
                    <IdentityFields
                        v-model:form="form"
                        :gender="props.gender"
                        :membership-bpjs="props.membershipBpjs"
                        :employment="props.employment"
                        :marital-status="props.maritalStatus"
                    />
                </FormSection>

                <!-- 02. Kontak dan Alamat -->
                <FormSection
                    number="02"
                    title="Kontak dan Alamat"
                    :locked="!isEditing"
                >
                    <ContactFields v-model:form="form" />
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

        <!-- Dialog Konfirmasi Hapus Data Peserta -->
        <ConfirmDialog
            :open="showDeleteDialog"
            title="Hapus Data Peserta"
            :description="`Apakah Anda yakin ingin menghapus data peserta ${props.participant.name}? Seluruh data profil dan riwayat pemeriksaan peserta ini akan dihapus secara permanen.`"
            confirm-text="Hapus Data"
            cancel-text="Batal"
            variant="destructive"
            :processing="isDeleting"
            @update:open="(val) => (showDeleteDialog = val)"
            @confirm="tapToDelete"
            @cancel="showDeleteDialog = false"
        />
    </main>
</template>
