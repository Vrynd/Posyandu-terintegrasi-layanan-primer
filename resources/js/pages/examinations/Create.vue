<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft } from '@lucide/vue';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index } from '@/routes/examinations';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pemeriksaan', href: index() },
            { title: 'Catat Pemeriksaan Baru' },
        ],
    },
});
</script>

<template>
    <Head title="Catat Pemeriksaan Baru" />

    <main class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Header & Tombol Kembali -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Catat Pemeriksaan Baru"
                description="Isi formulir hasil pengukuran dan pemeriksaan kesehatan peserta posyandu"
            />
            <Button variant="outline" size="sm" as-child>
                <Link :href="index()">
                    <ArrowLeft class="mr-1.5 h-4 w-4" />
                    <span>Kembali</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Kontainer Placeholder Pattern Formulir -->
        <section
            class="relative min-h-125 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
        >
            <PlaceholderPattern />
            <div
                class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
                <p class="text-sm font-medium text-muted-foreground">
                    Area formulir dinamis pemeriksaan (Akan diimplementasikan
                    pada tahap berikutnya)
                </p>
            </div>
        </section>
    </main>
</template>
