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
import { dashboard } from '@/routes';
import type { InvitationItem, InvitationMetrics } from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Kelola Kode Undangan',
                href: '/invitations',
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

const handleRegenerate = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menerbitkan ulang kode ini?')) {
        router.post(
            `/invitations/${id}/regenerate`,
            {},
            { preserveScroll: true },
        );
    }
};

const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kode undangan ini?')) {
        router.delete(`/invitations/${id}`, { preserveScroll: true });
    }
};
</script>

<template>
    <Head title="Kelola Kode Undangan" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <!-- Page Header -->
        <div class="mb-6 flex items-center justify-between gap-4">
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

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                v-for="metric in metricList"
                :key="metric.title"
                v-bind="metric"
            />
        </div>

        <!-- Card Tabel Data -->
        <Card
            class="mt-6 gap-0 overflow-hidden border-border/60 bg-card py-0 shadow-xs"
        >
            <CardContent class="p-0">
                <div class="relative w-full overflow-x-auto">
                    <table
                        class="w-full text-left text-sm [&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-3.5"
                    >
                        <thead
                            class="border-b border-dashed border-border/60 text-xs text-muted-foreground"
                        >
                            <tr>
                                <th class="font-medium tracking-wide uppercase">
                                    Nama Kader
                                </th>
                                <th class="font-medium tracking-wide uppercase">
                                    Alamat Email
                                </th>
                                <th class="font-medium tracking-wide uppercase">
                                    Status
                                </th>
                                <th class="font-medium tracking-wide uppercase">
                                    Tanggal Terbit
                                </th>
                                <th class="font-medium tracking-wide uppercase">
                                    Masa Berlaku
                                </th>
                                <th
                                    class="text-right font-medium tracking-wide uppercase"
                                >
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/60">
                            <tr
                                v-for="item in props.invitations.data"
                                :key="item.id"
                                class="group transition-colors duration-150 hover:bg-muted/20"
                            >
                                <!-- Nama Kader -->
                                <td>
                                    <span
                                        class="text-sm font-semibold text-foreground"
                                    >
                                        {{ item.recipient_name }}
                                    </span>
                                </td>

                                <!-- Alamat Email -->
                                <td>
                                    <span class="text-sm text-muted-foreground">
                                        {{ item.recipient_email }}
                                    </span>
                                </td>

                                <!-- Status Badge -->
                                <td>
                                    <Badge
                                        v-if="item.is_used"
                                        variant="outline"
                                        class="rounded-full border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500"
                                    >
                                        ● Terpakai
                                    </Badge>
                                    <Badge
                                        v-else-if="item.is_expired"
                                        variant="outline"
                                        class="rounded-full border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500"
                                    >
                                        ● Kadaluarsa
                                    </Badge>
                                    <Badge
                                        v-else
                                        variant="outline"
                                        class="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500"
                                    >
                                        ● Aktif
                                    </Badge>
                                </td>

                                <!-- Tanggal Terbit -->
                                <td>
                                    <span
                                        class="text-xs text-muted-foreground tabular-nums"
                                    >
                                        {{ item.created_at }}
                                    </span>
                                </td>

                                <!-- Masa Berlaku -->
                                <td>
                                    <span
                                        class="text-xs tabular-nums"
                                        :class="
                                            item.is_expired
                                                ? 'font-medium text-rose-500'
                                                : 'text-muted-foreground'
                                        "
                                    >
                                        {{ item.expires_at }}
                                    </span>
                                </td>

                                <!-- Aksi -->
                                <td class="text-right">
                                    <div
                                        class="flex items-center justify-end gap-2"
                                    >
                                        <!-- Tombol Regenerate (jika belum dipakai) -->
                                        <Button
                                            v-if="!item.is_used"
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            class="h-8 gap-1.5 text-xs font-medium"
                                            title="Terbitkan Ulang Kode"
                                            @click="handleRegenerate(item.id)"
                                        >
                                            <RefreshCw class="h-3.5 w-3.5" />
                                            Regenerate
                                        </Button>

                                        <!-- Tombol Hapus -->
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            class="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                                            title="Hapus Kode"
                                            @click="handleDelete(item.id)"
                                        >
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-if="props.invitations.data.length === 0">
                                <td
                                    colspan="6"
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
