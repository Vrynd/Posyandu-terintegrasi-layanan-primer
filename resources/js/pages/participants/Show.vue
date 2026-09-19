<script setup lang="ts">
import { Head, Link, router, setLayoutProps } from '@inertiajs/vue3';
import { HeartPulse, Pencil, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import * as examinations from '@/routes/examinations';
import * as participants from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';
import LastHealth from './partials/LastHealth.vue';
import ProfileParticipant from './partials/ProfileParticipant.vue';

interface Props {
    participant: ParticipantItem;
    categories?: FilterOption[];
}

const props = withDefaults(defineProps<Props>(), {
    categories: () => [],
});

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pendaftaran Peserta', href: participants.index.url() },
        { title: props.participant.name },
    ],
});

const showDelete = ref(false);
const isDeleting = ref(false);
const openDelete = () => {
    showDelete.value = true;
};
const confirmDelete = () => {
    router.delete(
        participants.destroy({ participant: props.participant.ulid }).url,
        {
            onStart: () => {
                isDeleting.value = true;
            },
            onFinish: () => {
                isDeleting.value = false;
                showDelete.value = false;
            },
        },
    );
};
</script>

<template>
    <Head :title="`Profil - ${props.participant.name}`" />

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-20 sm:gap-6 sm:p-6"
    >
        <!-- Header Halaman & Aksi Cepat -->
        <header class="flex items-center justify-between gap-4">
            <Heading
                title="Profil Peserta"
                description="Informasi lengkap data diri sasaran posyandu dan riwayat pemeriksaan kesehatan."
                class="mb-0 sm:mb-0"
            />
            <div class="hidden shrink-0 gap-2 pt-0.5 sm:inline-flex">
                <Button
                    variant="outline"
                    size="icon-lg"
                    as-child
                    class="shadow-none"
                >
                    <Link
                        :href="
                            participants.edit({
                                participant: props.participant.ulid,
                            }).url
                        "
                    >
                        <Pencil class="size-4" />
                    </Link>
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="icon-lg"
                    class="shadow-none"
                    @click="openDelete"
                >
                    <Trash2 class="size-4" />
                </Button>
                <Button size="lg" as-child>
                    <Link
                        :href="
                            examinations.create({
                                query: {
                                    participant: props.participant.ulid,
                                },
                            }).url
                        "
                    >
                        <HeartPulse class="size-4" />
                        <span>Input Pemeriksaan</span>
                    </Link>
                </Button>
            </div>
        </header>

        <!-- Data Diri -->
        <Card
            class="rounded-2xl border-card py-4 shadow-none sm:py-5 dark:border-border"
        >
            <CardContent class="px-4 sm:px-5">
                <div class="flex flex-col gap-4">
                    <h3
                        class="flex items-center gap-2.5 font-display text-base font-semibold text-foreground"
                    >
                        <span class="h-4 w-0.5 rounded-full bg-primary"></span>
                        Data Diri
                    </h3>
                    <ProfileParticipant
                        :participant="props.participant"
                        :categories="props.categories"
                    />
                </div>
            </CardContent>
        </Card>

        <!-- Data Kesehatan Terakhir -->
        <Card
            class="rounded-2xl border-card py-4 shadow-none sm:py-5 dark:border-border"
        >
            <CardContent class="px-4 sm:px-5">
                <div class="flex flex-col gap-4">
                    <h3
                        class="flex items-center gap-2.5 font-display text-base font-semibold text-foreground"
                    >
                        <span class="h-4 w-0.5 rounded-full bg-primary"></span>
                        Pemeriksaan Kesehatan Terakhir
                    </h3>
                    <LastHealth :participant="props.participant" />
                </div>
            </CardContent>
        </Card>

        <ActionBar class="sm:hidden">
            <Button variant="outline" size="lg" class="shadow-none" as-child>
                <Link
                    :href="
                        participants.edit({
                            participant: props.participant.ulid,
                        }).url
                    "
                >
                    <Pencil class="size-4" />
                    <span>Edit Profile</span>
                </Link>
            </Button>
            <Button size="lg" class="flex-1" as-child>
                <Link
                    :href="
                        examinations.create({
                            query: {
                                participant: props.participant.ulid,
                            },
                        }).url
                    "
                >
                    <HeartPulse class="size-4" />
                    <span>Input Pemeriksaan</span>
                </Link>
            </Button>
        </ActionBar>

        <ConfirmDialog
            v-model:open="showDelete"
            title="Hapus Data Peserta"
            :description="`Apakah Anda yakin ingin menghapus data peserta ${props.participant.name}? Seluruh data profil dan riwayat pemeriksaan peserta ini akan dihapus secara permanen.`"
            confirm-text="Ya, Hapus"
            cancel-text="Batal"
            variant="destructive"
            :processing="isDeleting"
            @confirm="confirmDelete"
            @cancel="showDelete = false"
        />
    </div>
</template>
