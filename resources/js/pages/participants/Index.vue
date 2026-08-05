<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
    },
});
</script>

<template>
    <Head title="Pendaftaran Peserta" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <header>
            <Heading
                title="Pendaftaran Peserta"
                description="Kelola pendaftaran data peserta posyandu"
            />
        </header>

        <section
            class="mt-6 flex-1 rounded-xl border border-dashed border-border p-6"
        >
            <PlaceholderPattern class="h-64 w-full" />
        </section>
    </main>
</template>
