<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Kode Undangan', href: '/invitations' },
            { title: 'Buat Kode Baru', href: '/invitations/create' },
        ],
    },
});
</script>

<template>
    <Head title="Buat Kode Undangan Baru" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <div class="mb-8 flex items-center justify-between gap-4">
            <Heading
                title="Buat Kode Undangan Baru"
                description="Manajemen dan pembuatan kode registrasi akun"
                variant="small"
            />
        </div>

        <div
            class="relative flex min-h-100 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8"
        >
            <PlaceholderPattern class="absolute inset-0 h-full w-full" />
            <div class="relative z-10 text-center">
                <h2 class="text-lg font-semibold">
                    Fitur ini sedang dalam pengembangan
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Mohon bersabar, fitur pembuatan kode undangan baru akan
                    segera hadir.
                </p>
            </div>
        </div>
    </div>
</template>
