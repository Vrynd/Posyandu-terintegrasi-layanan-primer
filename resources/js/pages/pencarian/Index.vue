<script setup lang="ts">
import { Head, Link, router, setLayoutProps } from '@inertiajs/vue3';
import {
    ArrowRightUpIcon,
    MagnifierIcon,
    UserCheckRoundedIcon,
} from '@solar-icons/vue/linear';
import { ref } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import participants from '@/routes/participants';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pencarian' },
    ],
});

const searchQuery = ref('');

const handleSearch = () => {
    if (!searchQuery.value.trim()) {
        return;
    }

    router.visit(
        participants.index({ query: { search: searchQuery.value.trim() } }),
    );
};
</script>

<template>
    <Head title="Pencarian" />

    <div class="flex h-full flex-1 flex-col p-4 pt-6 pb-20 sm:p-6 sm:pt-8">
        <Heading
            title="Pencarian Data Posyandu"
            description="Temukan data kependudukan warga, riwayat pemeriksaan, dan rekam kesehatan sasaran"
        />

        <div class="mt-6 max-w-2xl">
            <!-- Search Form Box -->
            <form @submit.prevent="handleSearch" class="flex gap-2">
                <div class="relative flex-1">
                    <MagnifierIcon
                        class="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Ketik NIK 16 digit, Nama Peserta, atau Alamat..."
                        class="h-11 rounded-xl pr-4 pl-10 text-sm"
                        autofocus
                    />
                </div>
                <Button
                    type="submit"
                    class="h-11 rounded-xl px-5 text-sm font-medium"
                >
                    Cari Data
                </Button>
            </form>

            <!-- Petunjuk Pencarian Cepat -->
            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card class="rounded-xl border border-border/80 bg-card p-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        >
                            <MagnifierIcon class="size-4.5" />
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-foreground">
                                Cari Lewat NIK
                            </h4>
                            <p class="text-[11px] text-muted-foreground">
                                Ketik 16 digit NIK warga untuk pencarian akurat
                            </p>
                        </div>
                    </div>
                </Card>

                <Card class="rounded-xl border border-border/80 bg-card p-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"
                        >
                            <UserCheckRoundedIcon class="size-4.5" />
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold text-foreground">
                                Cari Nama / Alamat
                            </h4>
                            <p class="text-[11px] text-muted-foreground">
                                Ketik sebagian nama warga atau nama dusun/RT
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Akses Cepat ke Seluruh Daftar -->
            <div
                class="mt-6 flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-4 text-xs"
            >
                <span class="text-muted-foreground"
                    >Ingin melihat seluruh daftar peserta posyandu?</span
                >
                <Link
                    :href="participants.index()"
                    class="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                    <span>Buka Semua Data</span>
                    <ArrowRightUpIcon class="size-3.5" />
                </Link>
            </div>
        </div>
    </div>
</template>
