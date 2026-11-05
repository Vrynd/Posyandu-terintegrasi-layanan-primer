<script setup lang="ts">
import { Head, Link, setLayoutProps } from '@inertiajs/vue3';
import {
    ArrowRightUpIcon,
    DocumentTextIcon,
    HealthIcon,
    UserCheckRoundedIcon,
    UserPlusRoundedIcon,
} from '@solar-icons/vue/linear';
import Heading from '@/components/Heading.vue';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';
import participants from '@/routes/participants';
import reports from '@/routes/reports';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pelayanan' },
    ],
});

const serviceMenus = [
    {
        title: 'Pemeriksaan Kesehatan',
        subtitle: 'Pencatatan & Skrining Sasaran',
        description:
            'Layanan pencatatan pemeriksaan rutin balita, anak/remaja, usia produktif, hingga lansia.',
        href: participants.index(),
        icon: UserCheckRoundedIcon,
        gradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
        badge: 'Aktif Melayani',
        badgeColor:
            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
        title: 'Buat & Kelola Laporan',
        subtitle: 'Rekapitulasi & Berkas Posyandu',
        description:
            'Pembuatan laporan bulanan posyandu, pemantauan status gizi (SKDN), dan ekspor data format resmi.',
        href: reports.index(),
        icon: DocumentTextIcon,
        gradient: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
        badge: 'Siap Cetak',
        badgeColor:
            'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    {
        title: 'Registrasi Warga Baru',
        subtitle: 'Pendaftaran Sasaran',
        description:
            'Pendaftaran data kependudukan warga atau peserta baru yang belum terdaftar di Posyandu.',
        href: participants.create(),
        icon: UserPlusRoundedIcon,
        gradient: 'from-violet-500 to-purple-600 shadow-violet-500/20',
        badge: 'Pendaftaran',
        badgeColor:
            'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    },
];
</script>

<template>
    <Head title="Pelayanan" />

    <div class="flex h-full flex-1 flex-col p-4 pt-6 pb-20 sm:p-6 sm:pt-8">
        <div
            class="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
            <Heading
                title="Pusat Pelayanan Posyandu"
                description="Pilih modul operasional pelayanan kesehatan primer hari ini"
            />
            <div
                class="hidden items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:flex"
            >
                <HealthIcon class="size-4" />
                <span>Integrasi Layanan Primer (ILP)</span>
            </div>
        </div>

        <!-- Menu Cards Pelayanan -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
                v-for="menu in serviceMenus"
                :key="menu.title"
                :href="menu.href"
                class="group block select-none focus-visible:outline-none"
            >
                <Card
                    class="flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:translate-y-0"
                >
                    <div>
                        <!-- Header Kartu: Ikon & Badge -->
                        <div class="flex items-center justify-between">
                            <div
                                class="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm"
                                :class="menu.gradient"
                            >
                                <component :is="menu.icon" class="size-5" />
                            </div>
                            <span
                                class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                :class="menu.badgeColor"
                            >
                                {{ menu.badge }}
                            </span>
                        </div>

                        <!-- Konten Teks -->
                        <div class="mt-4">
                            <h3
                                class="text-base font-semibold text-foreground transition-colors group-hover:text-primary"
                            >
                                {{ menu.title }}
                            </h3>
                            <p
                                class="mt-0.5 text-xs font-medium text-muted-foreground"
                            >
                                {{ menu.subtitle }}
                            </p>
                            <p
                                class="mt-2 text-xs leading-relaxed text-muted-foreground/90"
                            >
                                {{ menu.description }}
                            </p>
                        </div>
                    </div>

                    <!-- Footer Kartu: Action CTA -->
                    <div
                        class="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground group-hover:text-primary"
                    >
                        <span>Akses Modul</span>
                        <ArrowRightUpIcon
                            class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </div>
                </Card>
            </Link>
        </div>
    </div>
</template>
