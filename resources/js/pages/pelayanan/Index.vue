<script setup lang="ts">
import { Head, Link, setLayoutProps } from '@inertiajs/vue3';
import type { InertiaLinkProps } from '@inertiajs/vue3';
import { ArrowUpRight } from '@lucide/vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Heading from '@/components/Heading.vue';
import { dashboard } from '@/routes';
import participants from '@/routes/participants';
import reports from '@/routes/reports';
import type { BreadcrumbItem } from '@/types';

setLayoutProps({
    breadcrumbs: [],
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Layanan' },
];

interface ServiceCard {
    id: string;
    title: string;
    description: string;
    image?: string;
    href: NonNullable<InertiaLinkProps['href']>;
    isLocked?: boolean;
    lockedTooltip?: string;
}

// Konfigurasi Soft Ambient Pastel Glow untuk masing-masing modul
const serviceAmbientClasses: Record<
    string,
    { gradient: string; glow: string }
> = {
    'pendaftaran-peserta': {
        gradient:
            'from-indigo-500/12 via-indigo-500/4 to-transparent dark:from-indigo-500/20 dark:via-indigo-500/5',
        glow: 'bg-indigo-400/25 dark:bg-indigo-500/15',
    },
    'catat-pemeriksaan': {
        gradient:
            'from-emerald-500/12 via-emerald-500/4 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/5',
        glow: 'bg-emerald-400/25 dark:bg-emerald-500/15',
    },
    'tindak-lanjut': {
        gradient:
            'from-rose-500/12 via-rose-500/4 to-transparent dark:from-rose-500/20 dark:via-rose-500/5',
        glow: 'bg-rose-400/25 dark:bg-rose-500/15',
    },
    'data-warga': {
        gradient:
            'from-blue-500/12 via-blue-500/4 to-transparent dark:from-blue-500/20 dark:via-blue-500/5',
        glow: 'bg-blue-400/25 dark:bg-blue-500/15',
    },
    'kelola-laporan': {
        gradient:
            'from-amber-500/12 via-amber-500/4 to-transparent dark:from-amber-500/20 dark:via-amber-500/5',
        glow: 'bg-amber-400/25 dark:bg-amber-500/15',
    },
    'laporkan-masalah': {
        gradient:
            'from-sky-500/12 via-sky-500/4 to-transparent dark:from-sky-500/20 dark:via-sky-500/5',
        glow: 'bg-sky-400/25 dark:bg-sky-500/15',
    },
};

// 6 Layanan Operasional Posyandu Terintegrasi ILP (Urutan Real-World Alur Pelayanan)
const services: ServiceCard[] = [
    {
        id: 'pendaftaran-peserta',
        title: 'Pendaftaran Peserta',
        description:
            'Registrasi sasaran baru dan verifikasi NIK seluruh siklus hidup.',
        image: '/images/pendaftaran-peserta.png',
        href: participants.create(),
    },
    {
        id: 'catat-pemeriksaan',
        title: 'Catat Pemeriksaan',
        description:
            'Input antropometri, tanda vital, dan skrining berkala sasaran.',
        image: '/images/catat-pemeriksaan.png',
        href: participants.index(),
    },
    {
        id: 'tindak-lanjut',
        title: 'Peserta Tindak Lanjut',
        description:
            'Pemantauan sasaran berisiko klinis dan status rujukan Puskesmas.',
        image: '/images/tindak-lanjut.png',
        href: participants.index(),
    },
    {
        id: 'data-warga',
        title: 'Data Warga',
        description:
            'Direktori kependudukan lengkap sasaran dan pencarian NIK keluarga.',
        image: '/images/data-warga.png',
        href: participants.index(),
    },
    {
        id: 'kelola-laporan',
        title: 'Kelola Laporan',
        description:
            'Rekapitulasi bulanan posyandu dan unduh laporan resmi format SKDN.',
        image: '/images/kelola-laporan.png',
        href: reports.index(),
    },
    {
        id: 'laporkan-masalah',
        title: 'Laporkan Masalah',
        description:
            'Kanal pengaduan kendala teknis dan anomali data sistem posyandu.',
        image: '/images/laporkan-masalah.png',
        href: '#',
        isLocked: true,
        lockedTooltip:
            'Kanal Laporkan Masalah sedang disiapkan untuk tahap operasional berikutnya.',
    },
];
</script>

<template>
    <Head title="Layanan Posyandu" />

    <div
        class="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col p-4 sm:p-6"
    >
        <!-- Judul Halaman -->
        <div class="mb-5 flex flex-col gap-1 sm:mb-6">
            <Breadcrumbs :breadcrumbs="breadcrumbs" />
            <Heading title="Layanan Posyandu" class="mb-0 sm:mb-0" />
            <p class="text-xs text-muted-foreground sm:text-sm">
                Pilih modul pelayanan dan workstation operasional posyandu.
            </p>
        </div>

        <!-- Layout Grid: 2 Kolom di Mobile, 4 Kolom di Desktop (Format Workstation 4x2) -->
        <div class="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            <component
                :is="service.isLocked ? 'div' : Link"
                v-for="service in services"
                :key="service.title"
                :href="service.isLocked ? undefined : service.href"
                class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-transparent bg-card p-2.5 pb-3 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:rounded-2xl sm:p-3.5 sm:pb-4.5 dark:border-border/40"
                :class="
                    service.isLocked
                        ? 'cursor-not-allowed opacity-85'
                        : 'cursor-pointer active:scale-[0.99]'
                "
                :title="service.isLocked ? service.lockedTooltip : undefined"
                :aria-disabled="service.isLocked ? true : undefined"
            >
                <!-- Area 1: Inner Graphic Stage (Aset Gambar 3D dengan Soft Ambient Glow di Belakang) -->
                <div
                    class="relative h-28 w-full overflow-hidden rounded-lg bg-gradient-to-b select-none sm:h-36 sm:rounded-xl lg:h-40"
                    :class="serviceAmbientClasses[service.id]?.gradient"
                >
                    <!-- Soft Glow Orb Melayang di Belakang Ilustrasi -->
                    <div
                        class="pointer-events-none absolute -top-8 left-1/2 size-32 -translate-x-1/2 rounded-full blur-2xl sm:size-36"
                        :class="serviceAmbientClasses[service.id]?.glow"
                    />

                    <!-- Gambar Aset 3D -->
                    <img
                        v-if="service.image"
                        :src="service.image"
                        alt=""
                        aria-hidden="true"
                        class="pointer-events-none relative z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        draggable="false"
                    />
                    <!-- Gradien Fade-Out Otomatis ke Warna Dasar Kartu -->
                    <div
                        class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-card via-card/60 to-transparent sm:h-14"
                    />
                </div>

                <!-- Area 2: Judul & Deskripsi Layanan (Clean Minimalist ala Referensi) -->
                <div
                    class="relative z-10 mt-2 flex flex-col px-0.5 text-left sm:mt-2.5 sm:px-1"
                >
                    <div
                        class="flex items-center justify-between gap-1.5 sm:gap-2"
                    >
                        <h3
                            class="font-display text-xs leading-tight font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm lg:text-base"
                        >
                            {{ service.title }}
                        </h3>
                        <!-- Icon Panah Indikator Halus saat Hover -->
                        <ArrowUpRight
                            v-if="!service.isLocked"
                            aria-hidden="true"
                            class="size-3.5 shrink-0 -translate-x-1 translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100 sm:size-4"
                        />
                    </div>
                    <p
                        class="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs sm:leading-relaxed"
                    >
                        {{ service.description }}
                    </p>
                </div>
            </component>
        </div>
    </div>
</template>
