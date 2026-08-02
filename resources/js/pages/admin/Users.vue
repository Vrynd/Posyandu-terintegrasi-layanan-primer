<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';
import {
    Pencil,
    BadgeCheck,
    UserCheck,
    Users,
    UserX,
    Ticket,
} from '@lucide/vue';
import { computed } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import Metric from '@/components/Metric.vue';
import Pagination from '@/components/Pagination.vue';
import StatusBadge from '@/components/StatusBadge.vue';
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
import UserAvatar from '@/components/UserAvatar.vue';
import { useTableSort } from '@/composables/useTableSort';
import { useToggleStatus } from '@/composables/useToggleStatus';
import { dashboard } from '@/routes';
import type { UserItem, UserMetrics } from '@/types';

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
    metrics?: UserMetrics;
    users?: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}
const props = defineProps<Props>();

const rawUsers = computed(() => props.users?.data ?? []);
const metricList = computed(() => [
    {
        title: 'Total Pengguna',
        description: 'Keseluruhan akun terdaftar',
        value: props.metrics?.totalCount ?? 0,
        icon: Users,
        variant: 'emerald' as const,
    },
    {
        title: 'Undangan Belum Diklaim',
        description: 'Kode undangan belum dipakai',
        value: props.metrics?.pendingInvitationCount ?? 0,
        icon: Ticket,
        variant: 'indigo' as const,
    },
    {
        title: 'Akun Nonaktif',
        description: 'Akun kader yang dinonaktifkan',
        value: props.metrics?.suspendedCount ?? 0,
        icon: UserX,
        variant: 'rose' as const,
    },
    {
        title: 'Profil Belum Lengkap',
        description: 'Kader dengan NIK terverifikasi',
        value: props.metrics?.verifiedProfileCount ?? 0,
        icon: BadgeCheck,
        variant: 'amber' as const,
    },
]);

const {
    sortField,
    sortDirection,
    handleSort,
    sortedData: sortedUsers,
} = useTableSort<UserItem>(rawUsers);

const {
    isConfirmOpen,
    isProcessing,
    selectedUser,
    openConfirmModal,
    confirmToggle,
} = useToggleStatus();

const goToDetail = (userId: string, event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.closest('button') || target.closest('a')) {
        return;
    }

    router.visit(`/users/${userId}/edit`);
};
</script>

<template>
    <Head title="Manajemen Pengguna" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <Heading
            title="Manajemen Pengguna"
            description="Kelola akun, peran, dan status akun pengguna"
            variant="small"
            class="mb-6 sm:mb-8"
        />

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
                v-for="metric in metricList"
                :key="metric.title"
                :title="metric.title"
                :value="metric.value"
                :icon="metric.icon"
                :variant="metric.variant"
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
                                    sortField === 'name' ? sortDirection : null
                                "
                                @sort="handleSort('name')"
                            >
                                Nama Kader
                            </TableHead>
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'nik' ? sortDirection : null
                                "
                                @sort="handleSort('nik')"
                            >
                                NIK
                            </TableHead>
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'email' ? sortDirection : null
                                "
                                @sort="handleSort('email')"
                            >
                                Alamat Email
                            </TableHead>
                            <TableHead>Status Profil</TableHead>
                            <TableHead>Status Akun</TableHead>
                            <TableHead
                                sortable
                                :sort-direction="
                                    sortField === 'created_at'
                                        ? sortDirection
                                        : null
                                "
                                @sort="handleSort('created_at')"
                            >
                                Tanggal Terdaftar
                            </TableHead>
                            <TableHead class="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="user in sortedUsers"
                            :key="user.id"
                            class="transition-colors hover:bg-muted/50"
                            @click="goToDetail(user.id, $event)"
                        >
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <UserAvatar :name="user.name" size="md" />
                                    <span>{{ user.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span v-if="user.nik" class="font-mono">
                                    {{ user.nik }}
                                </span>
                                <span v-else>-</span>
                            </TableCell>
                            <TableCell>
                                {{ user.email }}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :color="
                                        user.is_profile_complete
                                            ? 'emerald'
                                            : 'amber'
                                    "
                                    :text="
                                        user.is_profile_complete
                                            ? 'Lengkap'
                                            : 'Belum Lengkap'
                                    "
                                />
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    :color="user.is_active ? 'emerald' : 'rose'"
                                    :text="
                                        user.is_active ? 'Aktif' : 'Nonaktif'
                                    "
                                />
                            </TableCell>
                            <TableCell>
                                {{ user.created_at }}
                            </TableCell>
                            <TableCell class="text-right">
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                                        title="Edit Profil"
                                        as-child
                                    >
                                        <Link :href="`/users/${user.id}/edit`">
                                            <Pencil class="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                        :title="
                                            user.is_active
                                                ? 'Nonaktifkan Akun'
                                                : 'Aktifkan Akun'
                                        "
                                        @click="openConfirmModal(user)"
                                    >
                                        <UserCheck
                                            v-if="!user.is_active"
                                            class="h-4 w-4 text-emerald-500"
                                        />
                                        <UserX v-else class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow v-if="sortedUsers.length === 0">
                            <TableCell
                                colspan="7"
                                class="h-32 text-center text-muted-foreground"
                            >
                                Belum ada data kader terdaftar.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Pagination
            v-if="props.users"
            :links="props.users.links"
            :current-count="sortedUsers.length"
            :total="props.users.total"
            :last-page="props.users.last_page"
            class="mt-6"
        />
    </div>

    <ConfirmDialog
        v-model:open="isConfirmOpen"
        :processing="isProcessing"
        :title="
            selectedUser?.is_active
                ? 'Nonaktifkan Akun Kader'
                : 'Aktifkan Kembali Akun Kader'
        "
        :description="
            selectedUser?.is_active
                ? `Apakah Anda yakin ingin menonaktifkan akun ${selectedUser?.name}? Akun\nyang dinonaktifkan tidak akan dapat login ke sistem.`
                : `Apakah Anda yakin ingin mengaktifkan kembali akun ${selectedUser?.name}? Akun dapat kembali mengakses seluruh fitur.`
        "
        :confirm-text="
            selectedUser?.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'
        "
        :variant="selectedUser?.is_active ? 'destructive' : 'default'"
        @confirm="confirmToggle"
    />
</template>
