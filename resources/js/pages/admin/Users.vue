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
    UserPlus,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Heading from '@/components/Heading.vue';
import Metric from '@/components/Metric.vue';
import Pagination from '@/components/Pagination.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription,
} from '@/components/ui/card';
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
import { create } from '@/routes/users';
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
        title: 'Total Kader Terdaftar',
        description: 'Keseluruhan akun terdaftar',
        value: props.metrics?.totalCount ?? 0,
        icon: Users,
        variant: 'emerald' as const,
        targetId: null,
    },
    {
        title: 'Menunggu Verifikasi',
        description: 'Kader belum verifikasi token',
        value: props.metrics?.pendingVerificationCount ?? 0,
        icon: Ticket,
        variant: 'indigo' as const,
        targetId: 'kolom-verifikasi',
    },
    {
        title: 'Akun Nonaktif',
        description: 'Akun kader yang dinonaktifkan',
        value: props.metrics?.suspendedCount ?? 0,
        icon: UserX,
        variant: 'rose' as const,
        targetId: 'kolom-nonaktif',
    },
    {
        title: 'Profil Belum Lengkap',
        description: 'Kader dengan NIK terverifikasi',
        value: props.metrics?.verifiedProfileCount ?? 0,
        icon: BadgeCheck,
        variant: 'amber' as const,
        targetId: 'kolom-profil',
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

const highlightedSection = ref<string | null>(null);
const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        highlightedSection.value = id;
        setTimeout(() => {
            highlightedSection.value = null;
        }, 1500);
    }
};
</script>

<template>
    <Head title="Manajemen Kader" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <Heading
            title="Manajemen Kader"
            description="Kelola akun, peran, dan status akun pengguna"
        />

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
                v-for="metric in metricList"
                :key="metric.title"
                :title="metric.title"
                :value="metric.value"
                :icon="metric.icon"
                :variant="metric.variant"
                :class="[
                    metric.targetId
                        ? 'cursor-pointer transition-transform duration-200 hover:-translate-y-1'
                        : '',
                ]"
                @click="metric.targetId && scrollToSection(metric.targetId)"
            />
        </div>

        <Card
            class="mt-6 flex flex-col gap-5 overflow-hidden border-border/60 bg-card p-4 shadow-xs sm:gap-6 sm:p-5"
        >
            <CardHeader class="flex flex-row items-center justify-between p-0">
                <div class="space-y-0.5 sm:space-y-0">
                    <CardTitle
                        class="font-display text-sm font-medium tracking-tight text-foreground/90 sm:text-base"
                    >
                        Daftar Kader Posyandu
                    </CardTitle>
                    <CardDescription>
                        Kelola akun, peran, dan status akses kader
                    </CardDescription>
                </div>
                <Button
                    variant="metalic"
                    class="h-9 gap-2"
                    @click="router.visit(create())"
                >
                    <UserPlus class="h-4 w-4" />
                    <span class="hidden sm:inline">Tambah Kader</span>
                </Button>
            </CardHeader>
            <CardContent class="p-0">
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
                            class="transition-colors hover:bg-muted/30"
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
            <CardFooter v-if="props.users" class="p-0">
                <Pagination
                    :links="props.users.links"
                    :current-count="sortedUsers.length"
                    :total="props.users.total"
                    :last-page="props.users.last_page"
                    class="w-full"
                />
            </CardFooter>
        </Card>
        <div class="mt-6 space-y-4 sm:mt-8">
            <Heading
                title="Perlu Tindakan"
                description="Daftar akun dan undangan yang memerlukan perhatian khusus dari admin."
                variant="small"
            />
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    id="kolom-verifikasi"
                    :class="[
                        'flex flex-col gap-2 rounded-xl transition-all duration-300',
                        highlightedSection === 'kolom-verifikasi'
                            ? 'scale-[1.02] ring-2 ring-indigo-500/80'
                            : '',
                    ]"
                >
                    <div
                        class="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 shadow-xs"
                    >
                        <div class="flex items-center gap-2.5">
                            <Ticket class="h-4 w-4 text-indigo-500" />
                            <span class="text-sm font-medium text-foreground/90"
                                >Menunggu Verifikasi</span
                            >
                        </div>
                        <Badge
                            variant="outline"
                            class="rounded-full border-border/60 bg-secondary/50 text-xs font-semibold"
                        >
                            {{ props.metrics?.pendingVerificationCount ?? 0 }}
                        </Badge>
                    </div>
                    <Card
                        class="border-border/60 bg-card/80 p-4 shadow-xs sm:p-5"
                    >
                        <CardContent class="p-0">
                            <div
                                class="flex h-36 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground"
                            >
                                Placeholder List Undangan
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div class="flex flex-col gap-2">
                    <div
                        class="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 shadow-xs"
                    >
                        <div class="flex items-center gap-2.5">
                            <BadgeCheck class="h-4 w-4 text-amber-500" />
                            <span class="text-sm font-medium text-foreground/90"
                                >Profil Belum Lengkap</span
                            >
                        </div>
                        <Badge
                            variant="outline"
                            class="rounded-full border-border/60 bg-secondary/50 text-xs font-semibold"
                        >
                            {{ props.metrics?.verifiedProfileCount ?? 0 }}
                        </Badge>
                    </div>
                    <!-- Body Content Card -->
                    <Card
                        class="border-border/60 bg-card/80 p-4 shadow-xs sm:p-5"
                    >
                        <CardContent class="p-0">
                            <div
                                class="flex h-36 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground"
                            >
                                Placeholder List Profil Pending
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div class="flex flex-col gap-2">
                    <div
                        class="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 shadow-xs"
                    >
                        <div class="flex items-center gap-2.5">
                            <UserX class="h-4 w-4 text-rose-500" />
                            <span class="text-sm font-medium text-foreground/90"
                                >Akun Nonaktif</span
                            >
                        </div>
                        <Badge
                            variant="outline"
                            class="rounded-full border-border/60 bg-secondary/50 text-xs font-semibold"
                        >
                            {{ props.metrics?.suspendedCount ?? 0 }}
                        </Badge>
                    </div>
                    <Card
                        class="border-border/60 bg-card/80 p-4 shadow-xs sm:p-5"
                    >
                        <CardContent class="p-0">
                            <div
                                class="flex h-36 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground"
                            >
                                Placeholder List Akun Nonaktif
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
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
