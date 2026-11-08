<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3';
import ActionCard from '@/components/ActionCard.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Heading from '@/components/Heading.vue';
import { posyanduServices } from '@/constants/posyanduServices';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

setLayoutProps({
    breadcrumbs: [],
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Layanan' },
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
        <div class="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
            <ActionCard
                v-for="service in posyanduServices"
                :key="service.id"
                v-bind="service"
            />
        </div>
    </div>
</template>
