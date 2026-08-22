<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarToggle,
} from '@/components/ui/toolbar';
import { useTableSearch } from '@/composables/useTableSearch';
import { dashboard } from '@/routes';
import { create, index as participantsIndex } from '@/routes/participants';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
    },
});

interface Props {
    participants?: {
        data: any[];
        total: number;
    };
    filters?: {
        search?: string;
    };
}

const props = defineProps<Props>();

// Logika reaktif, debounce, cancelation, dan Inertia diserahkan ke Composable
const { search, isExpanded, reset } = useTableSearch({
    routeUrl: participantsIndex.url(),
    initialSearch: props.filters?.search,
    only: ['participants', 'filters'],
});
</script>

<template>
    <Head title="Pendaftaran Peserta" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Judul Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Pendaftaran Peserta"
                description="Kelola dan pantau data sasaran peserta posyandu"
                variant="small"
            />
            <Button variant="default" class="h-9 gap-2" as-child>
                <Link :href="create()">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Peserta</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Pencarian dan Filter -->
        <Toolbar>
            <div class="flex items-center gap-2.5 sm:gap-3">
                <ToolbarSearch
                    v-model="search"
                    placeholder="Cari nama, alamat, atau nomor telepon..."
                />
                <ToolbarToggle
                    :open="isExpanded"
                    @click="isExpanded = !isExpanded"
                />
            </div>
            <ToolbarContent
                :open="isExpanded"
                :total-count="props.participants?.total ?? 0"
                :search="search"
                @reset="reset"
            />
        </Toolbar>

        <!-- 3. Tabel Peserta -->
        <section
            class="mt-4 flex-1 rounded-xl border border-dashed border-border p-6"
        ></section>
    </div>
</template>
