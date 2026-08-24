<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Plus, Users } from '@lucide/vue';
import EmptyState from '@/components/EmptyState.vue';
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
    GENDER_LABELS,
    formatDate,
    getCategoryColor,
    getCategoryLabel,
} from '@/lib/formatters';
import { create, edit } from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';

defineProps<{
    participants: ParticipantItem[];
    categories?: FilterOption[];
    hasSearch?: boolean;
}>();
</script>

<template>
    <!-- 1. Empty State jika data kosong -->
    <EmptyState
        v-if="participants.length === 0"
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

    <!-- 2. Tabel Data Peserta -->
    <Table v-else>
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
                v-for="participant in participants"
                :key="participant.ulid"
            >
                <TableCell class="font-medium">
                    <Link
                        :href="edit({ participant: participant.ulid })"
                        class="text-foreground transition-colors hover:text-accent"
                    >
                        {{ participant.name }}
                    </Link>
                </TableCell>
                <TableCell class="font-mono tracking-wide">
                    {{ participant.nik_masked ?? '—' }}
                </TableCell>
                <TableCell>
                    <StatusBadge
                        :text="
                            getCategoryLabel(participant.category, categories)
                        "
                        :color="getCategoryColor(participant.category)"
                    />
                </TableCell>
                <TableCell>
                    {{
                        GENDER_LABELS[participant.gender] ?? participant.gender
                    }}
                </TableCell>
                <TableCell>
                    {{ formatDate(participant.birth_date) }}
                </TableCell>
                <TableCell>
                    <StatusBadge
                        :text="
                            participant.has_bpjs ? 'Peserta' : 'Bukan Peserta'
                        "
                        :color="participant.has_bpjs ? 'emerald' : 'rose'"
                    />
                </TableCell>
                <TableCell class="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        class="h-7 px-2 text-xs"
                        as-child
                    >
                        <Link :href="edit({ participant: participant.ulid })">
                            Detail
                        </Link>
                    </Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
