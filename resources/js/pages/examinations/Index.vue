<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import ActionBar from '@/components/ActionBar.vue';
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

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6"
    >
        <!-- 1. Judul Halaman -->
        <header class="flex items-center justify-between gap-4">
            <Heading
                title="Pemeriksaan Kesehatan"
                description="Kelola dan pantau hasil pemeriksaan kesehatan peserta posyandu"
                class="mb-0 sm:mb-0"
            />
            <div class="shrink-0 pt-0.5">
                <Button class="hidden sm:inline-flex" size="lg" as-child>
                    <Link :href="create()">
                        <Plus class="h-4 w-4" />
                        <span>Catat Pemeriksaan</span>
                    </Link>
                </Button>
            </div>
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

        <ActionBar class="sm:hidden">
            <Button as-child size="lg">
                <Link :href="create()">
                    <Plus class="size-4" />
                    <span>Catat </span>
                </Link>
            </Button>
        </ActionBar>
    </div>
</template>
