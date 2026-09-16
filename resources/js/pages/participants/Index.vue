<script setup lang="ts">
import { Head, Link, router, setLayoutProps } from '@inertiajs/vue3';
import { ArrowUpDown, Filter, HeartPulse, Pencil, Plus } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import ActionBar from '@/components/ActionBar.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import Pagination from '@/components/Pagination.vue';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Toolbar,
    ToolbarContent,
    ToolbarDropdown,
    ToolbarSearch,
} from '@/components/ui/toolbar';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import { useTableFilter } from '@/composables/useTableFilter';
import { useTableQuery } from '@/composables/useTableQuery';
import { dashboard } from '@/routes';
import { create as createExamination } from '@/routes/examinations';
import {
    create,
    destroy,
    edit as editParticipant,
    index as participantsIndex,
} from '@/routes/participants';
import type {
    FilterOption,
    PaginatedData,
    ParticipantFilters,
    ParticipantItem,
} from '@/types';
import ListParticipant from './partials/ListParticipant.vue';
import ProfileParticipant from './partials/ProfileParticipant.vue';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Pendaftaran Peserta' },
    ],
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
        per_page: 8,
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

const selectedParticipant = ref<ParticipantItem | null>(null);
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

const selectedDetailParticipant = ref<ParticipantItem | null>(null);
const showDetailSheet = ref(false);

const openDetailSheet = (participant: ParticipantItem) => {
    selectedDetailParticipant.value = participant;
    showDetailSheet.value = true;
};

const {
    items: mobileParticipants,
    isLoadingMore,
    sentinel,
    removeItem: removeMobileParticipant,
} = useInfiniteScroll<ParticipantItem>({
    paginatedData: () => props.participants,
    routeUrl: participantsIndex.url(),
    params: toQueryParams,
    only: ['participants'],
});

const deleteDescription = computed(() => {
    const name = selectedParticipant.value?.name ?? '';

    return `Apakah Anda yakin ingin menghapus data peserta ${name}? Seluruh data profil dan riwayat pemeriksaan peserta ini akan dihapus secara permanen.`;
});

const tapToDelete = (participant: ParticipantItem) => {
    selectedParticipant.value = participant;
    showDeleteDialog.value = true;
};

const confirmDelete = () => {
    if (!selectedParticipant.value) {
        return;
    }

    const deletedUlid = selectedParticipant.value.ulid;

    router.delete(destroy({ participant: deletedUlid }).url, {
        onStart: () => {
            isDeleting.value = true;
        },
        onFinish: () => {
            isDeleting.value = false;
            showDeleteDialog.value = false;
            removeMobileParticipant((p) => p.ulid === deletedUlid);
            selectedParticipant.value = null;
        },
    });
};

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

    <div
        class="flex flex-1 flex-col gap-4 bg-background p-4 pb-24 sm:gap-6 sm:p-6"
    >
        <!-- 1. Judul Halaman -->
        <header class="flex items-center justify-between gap-4">
            <Heading
                title="Pendaftaran Peserta"
                description="Kelola data sasaran peserta posyandu serta pantau status pendaftaran."
                class="mb-0 sm:mb-0"
            />
            <div class="shrink-0 pt-0.5">
                <Button class="hidden sm:inline-flex" size="lg" as-child>
                    <Link :href="create()">
                        <Plus class="h-4 w-4" />
                        <span>Tambah Peserta</span>
                    </Link>
                </Button>
            </div>
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

        <!-- 3. Tabel Peserta dan Pagination -->
        <section
            class="flex flex-col transition-opacity"
            :class="{ 'pointer-events-none opacity-60': isLoading }"
        >
            <ListParticipant
                :participants="props.participants.data"
                :mobile-participants="mobileParticipants"
                :is-loading-more="isLoadingMore"
                :categories="props.categories"
                :has-search="hasSearch"
                @delete="tapToDelete"
                @select="openDetailSheet"
            />

            <!-- Sentinel sensor scroll untuk Mobile (< md) -->
            <div ref="sentinel" class="h-1 w-full md:hidden"></div>
            <Pagination
                class="mt-6 hidden sm:block"
                v-if="
                    props.participants.data.length > 0 &&
                    props.participants.links
                "
                :links="props.participants.links"
                :current-count="props.participants.data.length"
                :total="props.participants.total"
                :last-page="props.participants.last_page"
            />
        </section>

        <!-- 4. Mobile Sticky Bottom Action Bar-->
        <ActionBar class="sm:hidden">
            <Button as-child size="lg">
                <Link :href="create()">
                    <Plus class="size-4" />
                    <span>Tambah Peserta</span>
                </Link>
            </Button>
        </ActionBar>

        <!-- 5. Dialog Konfirmasi Hapus Data Peserta -->
        <ConfirmDialog
            :open="showDeleteDialog"
            title="Hapus Data Peserta"
            :description="deleteDescription"
            confirm-text="Ya, Hapus"
            cancel-text="Batal"
            variant="destructive"
            :processing="isDeleting"
            @update:open="(val) => (showDeleteDialog = val)"
            @confirm="confirmDelete"
            @cancel="showDeleteDialog = false"
        />

        <!-- 6. Bottom Sheet Profil Lengkap Peserta -->
        <Sheet
            :open="showDetailSheet"
            @update:open="(val: boolean) => (showDetailSheet = val)"
        >
            <SheetContent
                side="bottom"
                @open-auto-focus.prevent
                class="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-card px-4 pt-0 pb-4 shadow-2xl **:data-[slot=sheet-close]:hidden sm:px-6 sm:py-6 sm:**:data-[slot=sheet-close]:inline-flex"
            >
                <template v-if="selectedDetailParticipant">
                    <div class="mx-auto flex w-full max-w-3xl flex-col">
                        <div
                            class="sticky top-0 z-20 -mx-4 flex justify-center rounded-t-3xl bg-card px-4 pt-3 pb-3.5 sm:static sm:z-auto sm:mx-0 sm:mb-4 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0"
                        >
                            <div
                                class="h-1 w-14 rounded-full bg-muted-foreground/25 sm:h-1.5 sm:w-16"
                            />
                        </div>

                        <SheetHeader
                            class="mb-4 gap-0 space-y-1.5 p-0 text-center sm:mb-8 sm:text-left"
                        >
                            <SheetTitle
                                class="font-display text-lg font-bold text-foreground sm:text-xl"
                            >
                                Profil Peserta
                            </SheetTitle>
                            <SheetDescription
                                class="text-sm text-muted-foreground"
                            >
                                Informasi lengkap data diri sasaran posyandu dan
                                riwayat kepesertaan.
                            </SheetDescription>
                        </SheetHeader>

                        <ProfileParticipant
                            :participant="selectedDetailParticipant"
                            :categories="props.categories"
                        />

                        <SheetFooter
                            class="mt-6 flex flex-col-reverse gap-2 p-0 sm:flex-row sm:justify-end sm:gap-4"
                        >
                            <Button
                                variant="outline"
                                as-child
                                class="shadow-none"
                                size="lg"
                            >
                                <Link
                                    :href="
                                        editParticipant({
                                            participant:
                                                selectedDetailParticipant.ulid,
                                        }).url
                                    "
                                >
                                    <Pencil class="size-4" />
                                    <span>Ubah Data Peserta</span>
                                </Link>
                            </Button>

                            <Button as-child class="shadow-none" size="lg">
                                <Link
                                    :href="
                                        createExamination({
                                            query: {
                                                participant:
                                                    selectedDetailParticipant.ulid,
                                            },
                                        }).url
                                    "
                                >
                                    <HeartPulse class="size-4" />
                                    <span>Input Pemeriksaan</span>
                                </Link>
                            </Button>
                        </SheetFooter>
                    </div>
                </template>
            </SheetContent>
        </Sheet>
    </div>
</template>
