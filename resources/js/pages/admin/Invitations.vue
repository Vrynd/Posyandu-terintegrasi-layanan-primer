<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Kode Undangan',
                href: '/invitations',
            },
        ],
    },
});
</script>

<template>
    <Head title="Kelola Kode Undangan" />

    <div class="flex flex-1 flex-col space-y-6 p-5">
        <!-- Header Halaman -->
        <Heading
            variant="small"
            title="Kelola Kode Undangan"
            description="Manajemen kode registrasi akun kader Posyandu"
        />

        <!-- Placeholder Content -->
        <div
            class="flex min-h-75 flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center"
        >
            <div class="flex max-w-sm flex-col items-center gap-2">
                <div
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                    <KeyRound class="h-6 w-6" />
                </div>
                <h3 class="text-sm font-semibold text-foreground">
                    Fitur Manajemen Kode Undangan
                </h3>
                <p class="text-xs text-muted-foreground">
                    Halaman ini digunakan oleh Administrator untuk mengelola dan
                    memantau kode undangan pendaftaran kader.
                </p>
            </div>
        </div>
    </div>
</template>
