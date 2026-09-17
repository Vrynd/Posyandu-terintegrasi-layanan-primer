<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { ChevronRight, Loader2, Plus, Users } from '@lucide/vue';
import { computed } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import * as participantRoutes from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';

const props = defineProps<{
    participants: ParticipantItem[];
    mobileParticipants?: ParticipantItem[];
    isLoadingMore?: boolean;
    categories?: FilterOption[];
    hasSearch?: boolean;
}>();

const goToProfile = (participant: ParticipantItem) => {
    router.visit(participantRoutes.show({ participant: participant.ulid }).url);
};

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
                <Link :href="participantRoutes.create()">
                    <Plus class="h-3.5 w-3.5" />
                    Tambah Peserta
                </Link>
            </Button>
        </EmptyState>

        <template v-else>
            <!-- 2. Mobile View: Card List (< md) -->
            <div class="flex flex-col gap-3 md:hidden">
                <Card
                    v-for="participant in props.mobileParticipants ||
                    props.participants"
                    :key="participant.ulid"
                    class="group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-card bg-card/80 py-0 shadow-none backdrop-blur-xs transition-all duration-150 hover:border-primary/50 hover:shadow-xs active:scale-[0.99] active:bg-muted/50 dark:border-border"
                    @click="goToProfile(participant)"
                >
                    <!-- Header: Flexbox sejajar tanpa baris kosong berlebih -->
                    <CardHeader
                        class="flex flex-row items-center justify-between gap-2 border-b border-dashed border-border/60 px-4 py-3 sm:px-5 [.border-b]:pb-2.5"
                    >
                        <CardTitle
                            class="min-w-0 flex-1 font-display text-sm font-semibold"
                        >
                            <div class="flex items-center gap-2 truncate">
                                <span
                                    class="truncate font-semibold text-foreground transition-colors group-hover:text-primary"
                                >
                                    {{ participant.name }}
                                </span>
                                <span
                                    class="h-3 w-px shrink-0 bg-border/80"
                                    aria-hidden="true"
                                />
                                <span
                                    class="shrink-0 text-xs font-normal text-muted-foreground normal-case"
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

                        <ChevronRight
                            class="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                    </CardHeader>

                    <CardContent class="grid grid-cols-2 gap-3 p-4 sm:p-5">
                        <div>
                            <span
                                class="block text-xs font-normal text-muted-foreground"
                            >
                                Kategori
                            </span>
                            <span
                                class="text-[13px] font-medium text-foreground"
                            >
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
                                class="block text-xs font-normal text-muted-foreground"
                            >
                                Terakhir Diperiksa
                            </span>
                            <span
                                class="text-[13px] font-medium"
                                :class="
                                    participant.latest_examination
                                        ?.examination_date
                                        ? 'text-foreground'
                                        : 'text-muted-foreground/70 italic'
                                "
                            >
                                {{
                                    participant.latest_examination
                                        ?.examination_date
                                        ? formatDate(
                                              participant.latest_examination
                                                  .examination_date,
                                          )
                                        : 'Belum pernah'
                                }}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <!-- Indikator Loading saat memuat data berikutnya di Mobile -->
                <div
                    v-if="props.isLoadingMore"
                    class="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"
                >
                    <Loader2 class="size-4 animate-spin text-primary" />
                    <span>Memuat data peserta lainnya...</span>
                </div>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="participant in participants"
                            :key="participant.ulid"
                            class="group cursor-pointer transition-colors hover:bg-card"
                            @click="goToProfile(participant)"
                        >
                            <TableCell
                                class="font-medium text-foreground transition-colors group-hover:text-primary"
                            >
                                {{ participant.name }}
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
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </template>
    </div>
</template>
