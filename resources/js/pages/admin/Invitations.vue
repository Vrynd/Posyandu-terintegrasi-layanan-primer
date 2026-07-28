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
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import MetricCard from '@/components/MetricCard.vue';
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
}

const props = defineProps<Props>();

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

const tapTogenerate = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menerbitkan ulang kode ini?')) {
        router.post(
            `/invitations/${id}/regenerate`,
            {},
            { preserveScroll: true },
        );
    }
};

const tapToDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kode undangan ini?')) {
        router.delete(`/invitations/${id}`, { preserveScroll: true });
    }
};
</script>

<template>
    <Head title="Kelola Kode Undangan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <div class="mb-8 flex items-center justify-between gap-4">
            <Heading
                title="Kelola Kode Undangan"
                description="Manajemen penerbitan dan pemantauan status kode undangan kader"
                variant="small"
            />

            <Link href="/invitations/create">
                <Button
                    type="button"
                    variant="default"
                    class="gap-2 font-semibold hover:bg-primary/85 hover:ring-2 hover:ring-primary/30"
                >
                    <Plus class="h-4 w-4" />
                    Buat Kode Undangan
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
                            <TableHead>Nama Kader</TableHead>
                            <TableHead>Alamat Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Terbit</TableHead>
                            <TableHead>Masa Berlaku</TableHead>
                            <TableHead class="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="item in props.invitations.data"
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
                                        variant="outline"
                                        size="sm"
                                        class="h-8 gap-1.5 text-xs font-medium"
                                        title="Terbitkan Ulang Kode"
                                        @click="tapTogenerate(item.id)"
                                    >
                                        <RefreshCw class="h-3.5 w-3.5" />
                                        Regenerate
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                        title="Hapus Kode"
                                        @click="tapToDelete(item.id)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Empty State -->
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

        <!-- Pagination Controls -->
        <div
            v-if="props.invitations.links && props.invitations.last_page > 1"
            class="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between"
        >
            <p class="text-xs text-muted-foreground">
                Menampilkan
                <span class="font-semibold text-foreground">{{
                    props.invitations.data.length
                }}</span>
                dari
                <span class="font-semibold text-foreground">{{
                    props.invitations.total
                }}</span>
                total data
            </p>

            <div class="flex items-center gap-1.5">
                <template
                    v-for="(link, index) in props.invitations.links"
                    :key="index"
                >
                    <Button
                        v-if="link.url"
                        as-child
                        :variant="link.active ? 'default' : 'outline'"
                        size="sm"
                        class="h-8 min-w-8 px-2.5 text-xs font-medium"
                    >
                        <Link :href="link.url" preserve-scroll>
                            <span v-html="link.label" />
                        </Link>
                    </Button>
                    <Button
                        v-else
                        disabled
                        variant="outline"
                        size="sm"
                        class="h-8 min-w-8 px-2.5 text-xs font-medium opacity-50"
                    >
                        <span v-html="link.label" />
                    </Button>
                </template>
            </div>
        </div>
    </div>
</template>
