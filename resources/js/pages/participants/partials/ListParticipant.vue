<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { MoreHorizontal, Plus, Trash2, User, Users } from '@lucide/vue';
import { computed } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { calculateAge, formatDate } from '@/lib/date';
import { badgeColor, formatCategory, genderMap } from '@/lib/participant';
import { create, edit } from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';

const props = defineProps<{
    participants: ParticipantItem[];
    categories?: FilterOption[];
    hasSearch?: boolean;
}>();

const emit = defineEmits<{
    (e: 'delete', participant: ParticipantItem): void;
}>();

const emptyDescription = computed(() => {
    if (props.hasSearch) {
        return 'Tidak ada peserta yang sesuai dengan pencarian.';
    }

    return 'Mulai dengan mendaftarkan peserta posyandu pertama.';
});

const getNikMasked = (participant: ParticipantItem) => {
    return participant.nik_masked || '—';
};

const getGenderLabel = (gender: string) => {
    return genderMap[gender] || gender;
};

const getBpjsText = (hasBpjs: boolean) => {
    return hasBpjs ? 'Peserta' : 'Bukan Peserta';
};

const getBpjsBadgeColor = (hasBpjs: boolean) => {
    return hasBpjs ? 'emerald' : 'rose';
};
</script>

<template>
    <div>
        <!-- 1. Empty State jika data kosong -->
        <EmptyState
            v-if="participants.length === 0"
            :icon="Users"
            title="Belum ada peserta"
            :description="emptyDescription"
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

        <template v-else>
            <!-- 2. Mobile View: Card List (< md) -->
            <div class="flex flex-col gap-3 md:hidden">
                <Card
                    v-for="participant in participants"
                    :key="participant.ulid"
                    class="gap-0 overflow-hidden rounded-xl border border-card bg-card/80 py-0 shadow-none backdrop-blur-xs dark:border-border"
                >
                    <!-- Header: Flexbox sejajar tanpa baris kosong berlebih -->
                    <CardHeader
                        class="flex flex-row items-center justify-between gap-2 border-b border-dashed border-border/60 bg-card px-4 py-3 sm:px-5 [.border-b]:pb-2.5"
                    >
                        <CardTitle
                            class="min-w-0 flex-1 font-display text-xs font-normal uppercase"
                        >
                            <div class="flex items-center gap-1.5 truncate">
                                <Link
                                    :href="
                                        edit({
                                            participant: participant.ulid,
                                        })
                                    "
                                    class="truncate text-foreground transition-colors hover:text-primary"
                                >
                                    {{ participant.name }}
                                </Link>
                                <span class="text-muted-foreground/40">|</span>
                                <span
                                    class="shrink-0 text-[11px] font-normal text-muted-foreground normal-case"
                                >
                                    {{
                                        calculateAge(
                                            participant.birth_date,
                                            participant.category,
                                        )
                                    }}
                                </span>
                            </div>
                        </CardTitle>

                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    class="size-6 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                >
                                    <MoreHorizontal class="h-4 w-4" />
                                    <span class="sr-only">
                                        Menu aksi {{ participant.name }}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-36">
                                <DropdownMenuItem as-child>
                                    <Link
                                        :href="
                                            edit({
                                                participant: participant.ulid,
                                            })
                                        "
                                        class="flex w-full cursor-pointer items-center gap-2"
                                    >
                                        <User
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                        <span>Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    class="flex cursor-pointer items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    @select="emit('delete', participant)"
                                >
                                    <Trash2 class="h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>

                    <CardContent class="grid grid-cols-2 gap-3 p-4 sm:p-5">
                        <div>
                            <span
                                class="block text-[10px] font-medium text-muted-foreground"
                            >
                                Kategori
                            </span>
                            <span class="text-xs font-medium text-foreground">
                                {{
                                    formatCategory(
                                        participant.category,
                                        categories,
                                    )
                                }}
                            </span>
                        </div>
                        <div>
                            <span
                                class="block text-[10px] font-medium text-muted-foreground"
                            >
                                Tanggal Lahir
                            </span>
                            <span class="text-xs font-medium text-foreground">
                                {{ formatDate(participant.birth_date) }}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="hidden md:block">
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
                            v-for="participant in participants"
                            :key="participant.ulid"
                        >
                            <TableCell class="font-medium">
                                <Link
                                    :href="
                                        edit({ participant: participant.ulid })
                                    "
                                    class="text-foreground transition-colors hover:text-primary"
                                >
                                    {{ participant.name }}
                                </Link>
                            </TableCell>
                            <TableCell class="font-mono tracking-wide">
                                {{ getNikMasked(participant) }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :text="
                                        formatCategory(
                                            participant.category,
                                            categories,
                                        )
                                    "
                                    :color="badgeColor(participant.category)"
                                />
                            </TableCell>
                            <TableCell>
                                {{ getGenderLabel(participant.gender) }}
                            </TableCell>
                            <TableCell>
                                {{ formatDate(participant.birth_date) }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :text="getBpjsText(participant.has_bpjs)"
                                    :color="
                                        getBpjsBadgeColor(participant.has_bpjs)
                                    "
                                />
                            </TableCell>
                            <TableCell class="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    class="h-7 px-2.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    as-child
                                >
                                    <Link
                                        :href="
                                            edit({
                                                participant: participant.ulid,
                                            })
                                        "
                                    >
                                        Detail
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </template>
    </div>
</template>
