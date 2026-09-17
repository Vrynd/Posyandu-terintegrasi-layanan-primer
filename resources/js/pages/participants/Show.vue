<script setup lang="ts">
import { Head, Link, router, setLayoutProps } from '@inertiajs/vue3';
import {
    Activity,
    CalendarCheck,
    HeartPulse,
    Pencil,
    Trash2,
    User,
} from '@lucide/vue';
import { ref } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

        <Tabs default-value="profile" class="flex flex-col gap-4">
            <TabsList class="grid w-full grid-cols-3">
                <TabsTrigger value="profile" class="px-2 sm:px-3">
                    <User class="size-3.5 shrink-0" />
                    <span>Data Diri</span>
                </TabsTrigger>
                <TabsTrigger value="health" class="px-2 sm:px-3">
                    <Activity class="size-3.5 shrink-0" />
                    <span>
                        <span class="hidden sm:inline">Data </span>Kesehatan
                    </span>
                </TabsTrigger>
                <TabsTrigger value="attendance" class="px-2 sm:px-3">
                    <CalendarCheck class="size-3.5 shrink-0" />
                    <span>Kehadiran</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" class="mt-0">
                <Card
                    class="rounded-2xl border-card py-4 shadow-none sm:py-5 dark:border-border"
                >
                    <CardContent class="px-4 sm:px-5">
                        <ProfileParticipant
                            :participant="props.participant"
                            :categories="props.categories"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="health" class="mt-0">
                <Card
                    class="rounded-2xl border-card py-4 shadow-none sm:py-5 dark:border-border"
                >
                    <CardContent class="px-4 sm:px-5">
                        <LastHealth :participant="props.participant" />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="attendance" class="mt-0">
                <Card
                    class="rounded-2xl border-card shadow-none dark:border-border"
                >
                    <CardContent
                        class="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
                    >
                        <CalendarCheck
                            class="mb-3 size-10 stroke-[1.5] text-muted-foreground/50"
                        />
                        <h4 class="text-sm font-semibold text-foreground">
                            Pelacak Kehadiran Posyandu
                        </h4>
                        <p class="mt-1 max-w-sm text-xs">
                            Fitur pemantauan keikutsertaan bulanan peserta akan
                            segera diintegrasikan di sini.
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

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
