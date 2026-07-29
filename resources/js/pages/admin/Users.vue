<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    KeyRound,
    Pencil,
    ShieldCheck,
    UserCheck,
    Users,
    UserX,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { status } from '@/actions/App/Http/Controllers/Admin/UserController';
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

const isConfirmOpen = ref(false);
const selectedUser = ref<UserItem | null>(null);

const rawUsers = computed(() => props.users?.data ?? []);
const metricList = computed(() => [
    {
        title: 'Total Kader',
        value: props.metrics?.totalCount ?? 0,
        badgeText: 'Terdaftar',
        icon: Users,
        variant: 'emerald' as const,
    },
    {
        title: 'Akun Aktif',
        value: props.metrics?.activeCount ?? 0,
        badgeText: 'Siap Bertugas',
        icon: UserCheck,
        variant: 'indigo' as const,
    },
    {
        title: 'Nonaktif',
        value: props.metrics?.suspendedCount ?? 0,
        badgeText: 'Perlu Review',
        icon: UserX,
        variant: 'rose' as const,
    },
    {
        title: 'Profil Lengkap',
        value: props.metrics?.verifiedProfileCount ?? 0,
        badgeText: 'Terverifikasi NIK',
        icon: ShieldCheck,
        variant: 'amber' as const,
    },
]);

const {
    sortField,
    sortDirection,
    handleSort,
    sortedData: sortedUsers,
} = useTableSort<UserItem>(rawUsers);

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

const openConfirmModal = (user: UserItem) => {
    selectedUser.value = user;
    isConfirmOpen.value = true;
};

const tapToConfirm = () => {
    if (selectedUser.value) {
        router.patch(
            status.url(selectedUser.value.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    isConfirmOpen.value = false;
                    selectedUser.value = null;
                },
            },
        );
    }
};
</script>

<template>
    <Head title="Manajemen Pengguna" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <Heading
            title="Manajemen Pengguna"
            description="Kelola akun, peran, dan status keaktifan kader Posyandu"
            variant="small"
            class="mb-8"
        />

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
                        >
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted text-xs font-semibold text-muted-foreground"
                                    >
                                        {{ getInitials(user.name) }}
                                    </div>
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
                                <Badge
                                    v-if="user.is_profile_complete"
                                    variant="outline"
                                    class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                >
                                    Lengkap
                                </Badge>
                                <Badge
                                    v-else
                                    variant="outline"
                                    class="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                >
                                    Belum Lengkap
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    v-if="user.is_active"
                                    variant="outline"
                                    class="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                >
                                    Aktif
                                </Badge>
                                <Badge
                                    v-else
                                    variant="outline"
                                    class="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                >
                                    Nonaktif
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {{ user.created_at }}
                            </TableCell>
                            <TableCell class="text-right">
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                                        title="Edit Profil"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        class="w-8 text-amber-500 hover:text-amber-600 dark:hover:bg-amber-500/10"
                                        title="Reset Password"
                                    >
                                        <KeyRound class="h-4 w-4" />
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
        :title="
            selectedUser?.is_active
                ? 'Nonaktifkan Akun Kader'
                : 'Aktifkan Kembali Akun Kader'
        "
        :description="
            selectedUser?.is_active
                ? `Apakah Anda yakin ingin menonaktifkan akun kader ${selectedUser?.name}? Akun ini tidak akan dapat login ke sistem sampai diaktifkan kembali.`
                : `Apakah Anda yakin ingin mengaktifkan kembali akun kader ${selectedUser?.name}?`
        "
        :confirm-text="
            selectedUser?.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'
        "
        :variant="selectedUser?.is_active ? 'destructive' : 'default'"
        @confirm="tapToConfirm"
    />
</template>
