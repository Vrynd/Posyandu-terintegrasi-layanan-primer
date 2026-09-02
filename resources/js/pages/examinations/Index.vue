<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create } from '@/routes/examinations';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pemeriksaan' },
        ],
    },
});
</script>

<template>
    <Head title="Pemeriksaan Kesehatan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header & Tombol Tambah Pemeriksaan -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Pemeriksaan Kesehatan"
                description="Kelola dan pantau hasil pemeriksaan kesehatan peserta posyandu"
                variant="small"
            />
            <Button variant="default" class="h-9 bg-linear-to-br" as-child>
                <Link :href="create()">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Catat Pemeriksaan</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Kontainer Placeholder Pattern -->
        <section
            class="relative min-h-100 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
        >
            <PlaceholderPattern />
            <div
                class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
                <p class="text-sm font-medium text-muted-foreground">
                    Area tabel data pemeriksaan (Akan diimplementasikan pada
                    tahap berikutnya)
                </p>
            </div>
        </section>
    </div>
</template>
