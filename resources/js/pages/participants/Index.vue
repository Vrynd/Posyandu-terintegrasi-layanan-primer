<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowUpDown, Filter, Plus } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import {
    Toolbar,
    ToolbarContent,
    ToolbarDropdown,
    ToolbarSearch,
    ToolbarToggle,
} from '@/components/ui/toolbar';
import type { ActiveFilterItem } from '@/components/ui/toolbar/ToolbarContent.vue';
import { useTableFilter } from '@/composables/useTableFilter';
import { useTableQuery } from '@/composables/useTableQuery';
import { dashboard } from '@/routes';
import { create, index as participantsIndex } from '@/routes/participants';
import type {
    FilterOption,
    PaginatedData,
    ParticipantFilters,
    ParticipantItem,
} from '@/types';

// 1. Layout & breadcrumbs
defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Pendaftaran Peserta' },
        ],
    },
});

// 2. Component props
interface Props {
    participants?: PaginatedData<ParticipantItem>;
    categories?: FilterOption[];
    filters?: ParticipantFilters;
}

const props = defineProps<Props>();

// 3. Opsi filter & pengurutan
const sortOptions: FilterOption[] = [
    { label: 'Terbaru', value: 'latest' },
    { label: 'Terlama', value: 'oldest' },
    { label: 'Nama (A-Z)', value: 'name_asc' },
    { label: 'Nama (Z-A)', value: 'name_desc' },
];

const categoryOptions = computed<FilterOption[]>(() => [
    { label: 'Semua Kategori', value: 'all' },
    ...(props.categories ?? []),
]);

// 4. State pencarian & filter tabel
const {
    search,
    filters,
    hasActiveFilters,
    toQueryParams,
    resetSearch,
    resetAll,
} = useTableFilter({
    initialSearch: props.filters?.search,
    initialFilters: {
        category: props.filters?.category ?? 'all',
        sort: props.filters?.sort ?? 'latest',
    },
    defaultFilters: {
        category: 'all',
        sort: 'latest',
    },
});

// 5. Sinkronisasi data ke server via Inertia
const { navigate, debouncedNavigate } = useTableQuery({
    routeUrl: participantsIndex.url(),
    only: ['participants', 'filters'],
});

watch(search, () => {
    debouncedNavigate(toQueryParams());
});

watch(filters, () => {
    navigate(toQueryParams());
});

// 6. State panel filter (accordion)
const isExpanded = ref(hasActiveFilters.value);

watch(hasActiveFilters, (active, wasActive) => {
    if (active && !wasActive) {
        isExpanded.value = true;
    } else if (!active && wasActive) {
        isExpanded.value = false;
    }
});

// 7. Badge & label filter aktif
const selectedCategoryLabel = computed(() => {
    if (!filters.category || filters.category === 'all') {
        return null;
    }

    return (
        props.categories?.find((c) => c.value === filters.category)?.label ??
        filters.category
    );
});

const activeFilters = computed<ActiveFilterItem[]>(() => {
    const items: ActiveFilterItem[] = [];

    if (
        filters.category &&
        filters.category !== 'all' &&
        selectedCategoryLabel.value
    ) {
        items.push({
            id: 'category',
            type: 'Kategori',
            label: selectedCategoryLabel.value,
        });
    }

    if (filters.sort && filters.sort !== 'latest') {
        const sortLabel = sortOptions.find(
            (o) => o.value === filters.sort,
        )?.label;

        items.push({
            id: 'sort',
            type: 'Urutan',
            label: sortLabel ?? filters.sort,
        });
    }

    return items;
});

// 8. Handler aksi
function removeFilter(filterId: string): void {
    if (filterId === 'category') {
        filters.category = 'all';
    } else if (filterId === 'sort') {
        filters.sort = 'latest';
    }
}
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
                        default-value="all"
                        class="flex-1 sm:w-auto"
                    />
                    <ToolbarDropdown
                        v-model="filters.sort"
                        :options="sortOptions"
                        :icon="ArrowUpDown"
                        title="Urutkan Data"
                        default-value="latest"
                        class="flex-1 sm:w-auto"
                    />
                    <ToolbarToggle
                        :open="isExpanded"
                        class="shrink-0"
                        @click="isExpanded = !isExpanded"
                    />
                </div>
            </div>
            <ToolbarContent
                :open="isExpanded"
                :total-count="props.participants?.total ?? 0"
                :search="search"
                :filters="activeFilters"
                :has-active-filters="hasActiveFilters"
                @reset="resetAll"
                @clear-search="resetSearch"
                @remove-filter="removeFilter"
            />
        </Toolbar>

        <!-- 3. Tabel Peserta -->
        <section
            class="mt-4 flex-1 rounded-xl border border-dashed border-border p-6"
        ></section>
    </div>
</template>
