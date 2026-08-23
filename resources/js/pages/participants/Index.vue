<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowUpDown, Filter, Plus, Users } from '@lucide/vue';
import { computed, watch } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import Heading from '@/components/Heading.vue';
import Pagination from '@/components/Pagination.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Toolbar,
    ToolbarContent,
    ToolbarDropdown,
    ToolbarSearch,
} from '@/components/ui/toolbar';
import { useTableFilter } from '@/composables/useTableFilter';
import { useTableQuery } from '@/composables/useTableQuery';
import {
    GENDER_LABELS,
    formatDate,
    getCategoryColor,
    getCategoryLabel,
} from '@/lib/formatters';
import { dashboard } from '@/routes';
import { create, index as participantsIndex } from '@/routes/participants';
import type {
    FilterOption,
    PaginatedData,
    ParticipantFilters,
    ParticipantItem,
} from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta' },
        ],
    },
});

interface Props {
    participants?: PaginatedData<ParticipantItem>;
    categories?: FilterOption[];
    filters?: ParticipantFilters;
}

const props = withDefaults(defineProps<Props>(), {
    participants: () => ({
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 6,
        from: null,
        to: null,
    }),
    categories: () => [],
});

const CATEGORY_ALL = 'all';
const SORT_DEFAULT = 'latest';

const defaultFilters = {
    category: CATEGORY_ALL,
    sort: SORT_DEFAULT,
};

const sortOptions: FilterOption[] = [
    { label: 'Terbaru', value: 'latest' },
    { label: 'Terlama', value: 'oldest' },
    { label: 'Nama (A-Z)', value: 'name_asc' },
    { label: 'Nama (Z-A)', value: 'name_desc' },
];

const categoryOptions = computed<FilterOption[]>(() => [
    { label: 'Semua Kategori', value: CATEGORY_ALL },
    ...props.categories,
]);

const { search, filters, hasSearch, toQueryParams, resetSearch } =
    useTableFilter({
        initialSearch: props.filters?.search,
        initialFilters: {
            category: props.filters?.category ?? CATEGORY_ALL,
            sort: props.filters?.sort ?? SORT_DEFAULT,
        },
        defaultFilters,
    });

const { navigate, debouncedNavigate, isLoading } = useTableQuery({
    routeUrl: participantsIndex.url(),
    only: ['participants', 'filters'],
});

watch(search, () => {
    debouncedNavigate(toQueryParams());
});

watch(
    filters,
    () => {
        navigate(toQueryParams());
    },
    { deep: true },
);
</script>

<template>
    <Head title="Pendaftaran Peserta" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- 1. Judul Halaman -->
        <header class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Pendaftaran Peserta"
                description="Kelola data sasaran peserta posyandu"
                variant="small"
            />
            <Button variant="default" class="h-9 bg-linear-to-br" as-child>
                <Link :href="create()">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Peserta</span>
                </Link>
            </Button>
        </header>

        <!-- 2. Toolbar Pencarian & Filter -->
        <Toolbar>
            <div
                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5"
            >
                <ToolbarSearch
                    v-model="search"
                    placeholder="Cari nama, alamat, atau nomor telepon..."
                    class="w-full sm:min-w-0 sm:flex-1"
                />
                <div class="flex items-center gap-2 sm:shrink-0 sm:gap-2.5">
                    <ToolbarDropdown
                        v-model="filters.category"
                        :options="categoryOptions"
                        :icon="Filter"
                        title="Pilih Kategori"
                        :default-value="CATEGORY_ALL"
                        class="flex-1 sm:w-48 sm:flex-none"
                    />
                    <ToolbarDropdown
                        v-model="filters.sort"
                        :options="sortOptions"
                        :icon="ArrowUpDown"
                        title="Urutkan Data"
                        :default-value="SORT_DEFAULT"
                        class="flex-1 sm:w-36 sm:flex-none"
                    />
                </div>
            </div>
            <ToolbarContent
                :open="hasSearch"
                :total-count="props.participants.total"
                :search="search"
                @clear-search="resetSearch"
            />
        </Toolbar>

        <!-- 3. Tabel Peserta -->
        <section
            class="mt-4 flex-1 transition-opacity"
            :class="{ 'pointer-events-none opacity-60': isLoading }"
        >
            <!-- Empty State -->
            <EmptyState
                v-if="props.participants.data.length === 0"
                :icon="Users"
                title="Belum ada peserta"
                :description="
                    hasSearch
                        ? 'Tidak ada peserta yang sesuai dengan pencarian.'
                        : 'Mulai dengan mendaftarkan peserta posyandu pertama.'
                "
            >
                <Button
                    v-if="!hasSearch"
                    variant="outline"
                    size="sm"
                    class="h-8 text-xs"
                    as-child
                >
                    <Link :href="create()">
                        <Plus class="h-3.5 w-3.5" />
                        Tambah Peserta
                    </Link>
                </Button>
            </EmptyState>

            <!-- Tabel Data -->
            <template v-else>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIK</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Tanggal Lahir</TableHead>
                            <TableHead>Kepesertaan BPJS</TableHead>
                            <TableHead class="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="participant in props.participants.data"
                            :key="participant.ulid"
                        >
                            <TableCell class="font-medium text-foreground">
                                {{ participant.name }}
                            </TableCell>
                            <TableCell class="font-mono tracking-wide">
                                {{ participant.nik_masked ?? '—' }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :text="
                                        getCategoryLabel(
                                            participant.category,
                                            props.categories,
                                        )
                                    "
                                    :color="
                                        getCategoryColor(participant.category)
                                    "
                                />
                            </TableCell>
                            <TableCell>
                                {{
                                    GENDER_LABELS[participant.gender] ??
                                    participant.gender
                                }}
                            </TableCell>
                            <TableCell>
                                {{ formatDate(participant.birth_date) }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :text="
                                        participant.has_bpjs
                                            ? 'Peserta'
                                            : 'Bukan Peserta'
                                    "
                                    :color="
                                        participant.has_bpjs
                                            ? 'emerald'
                                            : 'rose'
                                    "
                                />
                            </TableCell>
                            <TableCell class="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    class="h-7 px-2 text-xs"
                                    as-child
                                >
                                    <Link :href="participant.ulid">
                                        Detail
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div class="mt-4">
                    <Pagination
                        v-if="props.participants.links"
                        :links="props.participants.links"
                        :current-count="props.participants.data.length"
                        :total="props.participants.total"
                        :last-page="props.participants.last_page"
                    />
                </div>
            </template>
        </section>
    </div>
</template>
