<!-- resources/js/pages/participants/Create.vue -->
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta', href: '/participants' },
            { title: 'Tambah Peserta', href: '/participants/create' },
        ],
    },
});
</script>

<template>
    <Head title="Tambah Peserta Baru" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header>
            <Heading
                title="Tambah Peserta Baru"
                description="Isi formulir berikut untuk mendaftarkan sasaran posyandu baru"
            />
        </header>

        <section
            class="flex-1 rounded-xl border border-border bg-card/80 p-6 shadow-xs"
        >
            <!-- Form Pendaftaran Peserta akan ada di sini -->
        </section>
    </main>
</template>
