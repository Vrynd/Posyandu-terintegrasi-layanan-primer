<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    CheckCircle2,
    KeyRound,
    Plus,
    RefreshCw,
    Trash2,
    UserCheck,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import MetricCard from '@/components/MetricCard.vue';
import Pagination from '@/components/Pagination.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTableSort } from '@/composables/useTableSort';
import { dashboard } from '@/routes';
import type { InvitationItem, InvitationMetrics } from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});

interface Props {
    metrics: InvitationMetrics;
    invitations: {
        data: InvitationItem[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters?: {
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

const props = defineProps<Props>();

const {
    sortField,
    sortDirection,
    handleSort,
    sortedData: sortedInvitations,
} = useTableSort<InvitationItem>(() => props.invitations?.data ?? []);

const metricList = computed(() => [
    {
        title: 'Kode Aktif',
        value: props.metrics?.activeCount ?? 0,
        badgeText: 'Siap Pakai',
        icon: CheckCircle2,
        variant: 'emerald' as const,
    },
    {
        title: 'Kode Terpakai',
        value: props.metrics?.usedCount ?? 0,
        badgeText: 'Terverifikasi',
        icon: UserCheck,
        variant: 'indigo' as const,
    },
    {
        title: 'Kode Kadaluarsa',
        value: props.metrics?.expiredCount ?? 0,
        badgeText: 'Perlu Review',
        icon: AlertTriangle,
        variant: 'amber' as const,
    },
    {
        title: 'Total Terbit',
        value: props.metrics?.totalCount ?? 0,
        badgeText: 'Keseluruhan',
        icon: KeyRound,
        variant: 'rose' as const,
    },
]);

const isRegenerateOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedInvitationId = ref<number | null>(null);
const isProcessing = ref(false);

const openRegenerateModal = (id: number) => {
    selectedInvitationId.value = id;
    isRegenerateOpen.value = true;
};

const openDeleteModal = (id: number) => {
    selectedInvitationId.value = id;
    isDeleteOpen.value = true;
};

const executeRegenerate = () => {
    if (!selectedInvitationId.value) {
        return;
    }

    isProcessing.value = true;
    router.post(
        `/invitations/${selectedInvitationId.value}/regenerate`,
        {},
        {
            preserveScroll: true,
            onFinish: () => {
                isProcessing.value = false;
                isRegenerateOpen.value = false;
                selectedInvitationId.value = null;
            },
        },
    );
};

const executeDelete = () => {
    if (!selectedInvitationId.value) {
        return;
    }

    isProcessing.value = true;
    router.delete(`/invitations/${selectedInvitationId.value}`, {
        preserveScroll: true,
        onFinish: () => {
            isProcessing.value = false;
            isDeleteOpen.value = false;
            selectedInvitationId.value = null;
        },
    });
};
</script>

<template>
    <Head title="Kelola Kode Undangan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <div class="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <Heading
                title="Kelola Kode Undangan"
                description="Manajemen penerbitan dan pemantauan status kode undangan kader"
                variant="small"
                class="max-w-40 sm:max-w-none"
            />

            <Link href="/invitations/create">
                <Button
                    type="button"
                    variant="default"
                    class="gap-2 font-semibold hover:bg-primary/85 hover:ring-2 hover:ring-primary/30"
                >
                    <Plus class="h-4 w-4 shrink-0" />
                    <span class="hidden sm:inline">Buat Kode Undangan</span>
                    <span class="inline sm:hidden">Buat Kode</span>
                </Button>
            </Link>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                v-for="metric in metricList"
                :key="metric.title"
                v-bind="metric"
            />
        </div>

        <Card
            class="mt-6 gap-0 overflow-hidden border-border/60 bg-card/80 py-0 shadow-xs"
        >
            <CardContent class="p-5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'recipient_name'
                                        ? sortDirection
                                        : null
                                "
                                @sort="handleSort('recipient_name')"
                                >Nama Kader</TableHead
                            >
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'recipient_email'
                                        ? sortDirection
                                        : null
                                "
                                @sort="handleSort('recipient_email')"
                                >Alamat Email</TableHead
                            >
                            <TableHead>Status</TableHead>
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'created_at'
                                        ? sortDirection
                                        : null
                                "
                                @sort="handleSort('created_at')"
                                >Tanggal Terbit</TableHead
                            >
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'expires_at'
                                        ? sortDirection
                                        : null
                                "
                                @sort="handleSort('expires_at')"
                                >Masa Berlaku</TableHead
                            >
                            <TableHead class="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="item in sortedInvitations"
                            :key="item.id"
                        >
                            <TableCell>
                                {{ item.recipient_name }}
                            </TableCell>
                            <TableCell>
                                {{ item.recipient_email }}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    v-if="item.is_used"
                                    variant="outline"
                                    class="rounded-full border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500"
                                >
                                    Terpakai
                                </Badge>
                                <Badge
                                    v-else-if="item.is_expired"
                                    variant="outline"
                                    class="rounded-full border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500"
                                >
                                    Kadaluarsa
                                </Badge>
                                <Badge
                                    v-else
                                    variant="outline"
                                    class="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500"
                                >
                                    Aktif
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {{ item.created_at }}
                            </TableCell>
                            <TableCell
                                :class="{
                                    'font-medium text-rose-500':
                                        item.is_expired,
                                }"
                            >
                                {{ item.expires_at }}
                            </TableCell>
                            <TableCell class="text-right">
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <Button
                                        v-if="!item.is_used"
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 border-amber-500/30 p-0 text-amber-500 hover:text-amber-600 dark:hover:bg-amber-500/10"
                                        title="Terbitkan Ulang Kode"
                                        @click="openRegenerateModal(item.id)"
                                    >
                                        <RefreshCw class="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 border-rose-500/30 p-0 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                        title="Hapus Kode"
                                        @click="openDeleteModal(item.id)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow v-if="props.invitations.data.length === 0">
                            <TableCell
                                :colspan="6"
                                class="p-8 text-center text-muted-foreground"
                            >
                                <div
                                    class="flex flex-col items-center justify-center gap-2"
                                >
                                    <KeyRound class="h-8 w-8 opacity-30" />
                                    <p class="text-sm font-medium">
                                        Tidak ada data kode undangan.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Pagination
            :links="props.invitations.links"
            :current-count="props.invitations.data.length"
            :total="props.invitations.total"
            :last-page="props.invitations.last_page"
        />

        <ConfirmDialog
            v-model:open="isRegenerateOpen"
            title="Terbitkan Ulang Kode Undangan?"
            description="Kode undangan saat ini akan dibatalkan dan kode undangan baru dengan masa berlaku 7 hari akan diterbitkan untuk kader ini."
            confirm-text="Terbitkan Ulang"
            cancel-text="Batal"
            variant="default"
            :processing="isProcessing"
            @confirm="executeRegenerate"
        />

        <ConfirmDialog
            v-model:open="isDeleteOpen"
            title="Hapus Kode Undangan?"
            description="Apakah Anda yakin ingin menghapus kode undangan ini? Data yang dihapus tidak dapat dikembalikan."
            confirm-text="Hapus Kode"
            cancel-text="Batal"
            variant="destructive"
            :processing="isProcessing"
            @confirm="executeDelete"
        />
    </div>
</template>
