<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create } from '@/routes/participants';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
    },
});
</script>

<template>
    <Head title="Pendaftaran Peserta" />

    <main class="flex h-full flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-5">
        <header class="flex items-center justify-between gap-4">
            <Heading title="Pendaftaran Peserta" />
            <Button variant="metalic" class="h-9 gap-2 sm:h-9.5" as-child>
                <Link :href="create()">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Peserta</span>
                </Link>
            </Button>
        </header>

        <section
            class="flex-1 rounded-xl border border-dashed border-border p-6"
        ></section>
    </main>
</template>
