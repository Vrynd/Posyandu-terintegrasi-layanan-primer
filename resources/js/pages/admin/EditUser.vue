<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Calendar,
    Clock,
    ShieldCheck,
    User,
    UserCheck,
    UserX,
} from '@lucide/vue';
import Heading from '@/components/Heading.vue';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TileGroup,
    TileItem,
    TileLabel,
    TileValue,
} from '@/components/ui/tile';
import UserAvatar from '@/components/UserAvatar.vue';
import { dashboard } from '@/routes';
import type { UserItem } from '@/types';

interface Props {
    user?: UserItem;
}

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Manajemen Pengguna', href: '/users' },
            { title: 'Edit Profil Kader', href: '#' },
        ],
    },
});
</script>

<template>
    <Head :title="`Edit Profil - ${props.user?.name ?? 'Kader'}`" />

    <div class="flex h-full flex-1 flex-col p-4 sm:p-5">
        <div class="mb-6 flex items-center justify-between">
            <Heading
                :title="`Edit Profil: ${props.user?.name ?? 'Kader'}`"
                description="Kelola informasi pribadi, kata sandi, dan status akun kader Posyandu"
                variant="small"
            />
            <Button variant="outline" size="sm" as-child>
                <Link href="/users">
                    <ArrowLeft class="mr-1.5 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
        </div>

        <div class="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
            <div class="lg:col-span-1">
                <Card class="gap-0 border-border/80 bg-card py-0 shadow-xs">
                    <CardHeader
                        class="gap-0 border-b border-border px-4 py-4 sm:px-5 [.border-b]:pb-4"
                    >
                        <CardTitle class="text-sm font-medium">
                            Ringkasan Profil
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="space-y-3.5 p-4 sm:p-5">
                        <div
                            class="flex items-center gap-3.5 rounded-xl border border-border/80 bg-muted/20 p-3.5 sm:p-4"
                        >
                            <UserAvatar
                                :name="props.user?.name ?? 'Kader'"
                                size="lg"
                                class="h-14 w-14 shrink-0 text-base font-bold ring-2 ring-indigo-500/20"
                            />
                            <div class="min-w-0 flex-1 space-y-0.5 text-left">
                                <h3
                                    class="truncate text-base font-semibold tracking-tight text-foreground"
                                    :title="props.user?.name"
                                >
                                    {{ props.user?.name }}
                                </h3>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                    :title="props.user?.email"
                                >
                                    {{ props.user?.email }}
                                </p>
                            </div>
                        </div>

                        <TileGroup>
                            <TileItem>
                                <TileLabel>
                                    <User class="h-4 w-4 text-indigo-500" />
                                    Peran
                                </TileLabel>
                                <TileValue>
                                    <Badge
                                        variant="secondary"
                                        class="px-2 py-0.5 text-[11px] font-normal"
                                    >
                                        Kader Posyandu
                                    </Badge>
                                </TileValue>
                            </TileItem>
                            <TileItem>
                                <TileLabel>
                                    <UserCheck
                                        v-if="props.user?.is_active"
                                        class="h-4 w-4 text-emerald-500"
                                    />
                                    <UserX
                                        v-else
                                        class="h-4 w-4 text-rose-500"
                                    />
                                    Status Akun
                                </TileLabel>
                                <TileValue>
                                    <StatusBadge
                                        :color="
                                            props.user?.is_active
                                                ? 'emerald'
                                                : 'rose'
                                        "
                                        :text="
                                            props.user?.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'
                                        "
                                    />
                                </TileValue>
                            </TileItem>
                            <TileItem>
                                <TileLabel>
                                    <ShieldCheck
                                        class="h-4 w-4 text-amber-500"
                                    />
                                    Status NIK
                                </TileLabel>
                                <TileValue>
                                    <StatusBadge
                                        :color="
                                            props.user?.nik
                                                ? 'emerald'
                                                : 'amber'
                                        "
                                        :text="
                                            props.user?.nik
                                                ? 'Lengkap'
                                                : 'Belum Ada'
                                        "
                                    />
                                </TileValue>
                            </TileItem>
                            <TileItem>
                                <TileLabel>
                                    <Calendar
                                        class="h-4 w-4 text-muted-foreground"
                                    />
                                    Terdaftar
                                </TileLabel>
                                <TileValue>
                                    {{ props.user?.created_at }}
                                </TileValue>
                            </TileItem>
                        </TileGroup>

                        <div
                            class="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5 text-xs sm:p-4"
                        >
                            <span
                                class="flex items-center gap-2 text-muted-foreground"
                            >
                                <Clock class="h-4 w-4 text-indigo-400" />
                                Terakhir Login
                            </span>
                            <span class="text-xs font-medium text-foreground">
                                {{
                                    props.user?.last_login_at ?? 'Belum Pernah'
                                }}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="lg:col-span-2">
                <div
                    class="relative flex h-full min-h-87.5 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
                >
                    <PlaceholderPattern />
                    <p class="relative z-10 text-sm text-muted-foreground">
                        Area Form Edit & Keamanan (Akan dibuat di langkah
                        berikutnya)
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
