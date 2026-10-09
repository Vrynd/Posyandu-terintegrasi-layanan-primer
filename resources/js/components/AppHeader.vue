<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    Bot,
    Bug,
    ChevronDown,
    ClipboardList,
    Clock,
    Database,
    FileText,
    History,
    KeyRound,
    LayoutGrid,
    Menu,
    MessageSquare,
    UserPlus,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { getInitials } from '@/composables/useInitials';
import { dashboard } from '@/routes';
import participants from '@/routes/participants';
import reports from '@/routes/reports';
import tokens from '@/routes/tokens';
import users from '@/routes/users';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth);
const userRole = computed(() => page.props.auth?.user?.role);
const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

// Menu navigasi untuk Kader (Langsung tampil sejajar tanpa dikelompokkan dalam dropdown)
const kaderNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        active: () => isCurrentUrl(dashboard()),
        isLocked: false,
    },
    {
        title: 'Peserta',
        href: participants.index(),
        icon: UserPlus,
        active: () =>
            isCurrentOrParentUrl('/participants') ||
            isCurrentOrParentUrl('/examinations'),
        isLocked: false,
    },
    {
        title: 'Laporan',
        href: reports.index(),
        icon: FileText,
        active: () => isCurrentOrParentUrl('/reports'),
        isLocked: false,
    },
    {
        title: 'Riwayat Aktivitas',
        href: '#',
        icon: History,
        active: () => false,
        isLocked: true,
    },
    {
        title: 'Tanya AI',
        href: '#',
        icon: Bot,
        active: () => false,
        isLocked: true,
    },
    {
        title: 'Pengaduan Bug',
        href: '#',
        icon: Bug,
        active: () => false,
        isLocked: true,
    },
];

// Menu navigasi untuk Administrator (IT & Pengaturan Sistem)
const adminNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        active: () => isCurrentUrl(dashboard()),
        isLocked: false,
    },
    {
        title: 'Pengguna',
        href: users.index(),
        icon: Users,
        active: () =>
            isCurrentOrParentUrl('/users') ||
            isCurrentOrParentUrl('/admin/users'),
        isLocked: false,
    },
    {
        title: 'Kelola Token',
        href: tokens.index(),
        icon: KeyRound,
        active: () => isCurrentOrParentUrl('/tokens'),
        isLocked: false,
    },
    {
        title: 'Formulir',
        href: '/myadmin/forms',
        icon: ClipboardList,
        active: () => isCurrentOrParentUrl('/myadmin/forms'),
        isLocked: false,
    },
    {
        title: 'Backup & Restore',
        href: '#',
        icon: Database,
        active: () => false,
        isLocked: true,
    },
    {
        title: 'Log Aktivitas',
        href: '#',
        icon: Activity,
        active: () => false,
        isLocked: true,
    },
    {
        title: 'Pusat Pengaduan',
        href: '#',
        icon: MessageSquare,
        active: () => false,
        isLocked: true,
    },
];

const activeNavItems = computed(() => {
    return userRole.value === 'administrator' ? adminNavItems : kaderNavItems;
});
</script>

<template>
    <header
        class="sticky top-0 z-30 w-full border-b border-border/80 bg-card/90 backdrop-blur-md"
    >
        <div
            class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr]"
        >
            <!-- 1. Kiri: Mobile Drawer Trigger & Logo Posyandu -->
            <div class="flex shrink-0 items-center justify-start gap-2">
                <!-- Mobile Drawer Trigger (Layar < lg) -->
                <div class="lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="size-9 cursor-pointer"
                            >
                                <Menu class="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-80 p-0">
                            <SheetTitle class="sr-only"
                                >Navigasi Utama</SheetTitle
                            >
                            <div class="flex h-full flex-col">
                                <!-- Mobile Logo Header -->
                                <div
                                    class="flex items-center gap-2 border-b border-border/70 p-4"
                                >
                                    <AppLogo />
                                </div>

                                <!-- Mobile Nav Links -->
                                <div class="flex-1 overflow-y-auto px-3 py-3">
                                    <div class="space-y-1">
                                        <Link
                                            v-for="item in activeNavItems"
                                            :key="item.title"
                                            :href="
                                                item.isLocked ? '#' : item.href
                                            "
                                            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                            :class="[
                                                item.isLocked
                                                    ? 'cursor-not-allowed opacity-70'
                                                    : '',
                                                item.active()
                                                    ? 'bg-primary/10 font-semibold text-primary'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            ]"
                                        >
                                            <div
                                                class="flex items-center gap-3"
                                            >
                                                <component
                                                    :is="item.icon"
                                                    class="size-4.5"
                                                    :class="
                                                        item.active()
                                                            ? 'text-primary'
                                                            : ''
                                                    "
                                                />
                                                <span>{{ item.title }}</span>
                                            </div>
                                            <span
                                                v-if="item.isLocked"
                                                class="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500"
                                            >
                                                Segera
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <!-- Mobile Footer: Profil Singkat -->
                                <div class="border-t border-border/70 p-4">
                                    <div class="flex items-center gap-3">
                                        <Avatar class="size-9 rounded-full">
                                            <AvatarImage
                                                v-if="auth?.user?.avatar"
                                                :src="auth.user.avatar"
                                                :alt="auth.user.name"
                                            />
                                            <AvatarFallback
                                                class="rounded-full bg-neutral-200 text-xs font-semibold text-black dark:bg-neutral-700 dark:text-white"
                                            >
                                                {{
                                                    getInitials(
                                                        auth?.user?.name,
                                                    )
                                                }}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            class="flex min-w-0 flex-1 flex-col"
                                        >
                                            <span
                                                class="truncate text-sm font-medium text-foreground"
                                            >
                                                {{ auth?.user?.name }}
                                            </span>
                                            <span
                                                class="truncate text-xs text-muted-foreground capitalize"
                                            >
                                                {{
                                                    auth?.user?.role ?? 'Kader'
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <!-- Logo Brand -->
                <Link :href="dashboard()" class="flex items-center gap-x-2">
                    <AppLogo />
                </Link>
            </div>

            <!-- 2. Tengah: Desktop Navigation Menu (Persis di tengah-tengah antara Logo dan Profil) -->
            <div class="hidden h-full items-center justify-center lg:flex">
                <NavigationMenu class="flex h-full items-stretch">
                    <NavigationMenuList
                        class="flex h-full items-stretch space-x-0.5 xl:space-x-1"
                    >
                        <!-- Nav Items Utama Langsung Sejajar -->
                        <NavigationMenuItem
                            v-for="item in activeNavItems"
                            :key="item.title"
                            class="relative flex h-full items-center"
                        >
                            <Link
                                :href="item.isLocked ? '#' : item.href"
                                class="inline-flex h-9 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none xl:px-3 xl:text-sm"
                                :class="[
                                    item.isLocked
                                        ? 'cursor-not-allowed opacity-70 hover:opacity-100'
                                        : '',
                                    item.active()
                                        ? 'font-semibold text-foreground'
                                        : 'text-muted-foreground',
                                ]"
                                :title="
                                    item.isLocked
                                        ? `${item.title} (Segera Hadir)`
                                        : item.title
                                "
                            >
                                <component
                                    :is="item.icon"
                                    class="mr-1.5 size-4 shrink-0"
                                    :class="item.active() ? 'text-primary' : ''"
                                />
                                <span class="whitespace-nowrap">{{
                                    item.title
                                }}</span>
                                <Clock
                                    v-if="item.isLocked"
                                    class="ml-1 size-3 text-muted-foreground/60"
                                />
                            </Link>
                            <!-- Garis aktif di bagian bawah -->
                            <div
                                v-if="item.active()"
                                class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-primary"
                            />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <!-- 3. Kanan: User Profile Dropdown -->
            <div class="flex shrink-0 items-center justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger :as-child="true">
                        <Button
                            variant="ghost"
                            class="flex cursor-pointer items-center gap-2.5 rounded-full p-1 pr-3 transition-colors focus-within:ring-2 focus-within:ring-primary hover:bg-muted"
                        >
                            <Avatar class="size-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    v-if="auth?.user?.avatar"
                                    :src="auth.user.avatar"
                                    :alt="auth.user.name"
                                />
                                <AvatarFallback
                                    class="rounded-full bg-neutral-200 text-xs font-semibold text-black dark:bg-neutral-700 dark:text-white"
                                >
                                    {{ getInitials(auth?.user?.name) }}
                                </AvatarFallback>
                            </Avatar>
                            <div class="hidden flex-col text-left sm:flex">
                                <span
                                    class="max-w-36 truncate text-xs font-medium text-foreground"
                                >
                                    {{ auth?.user?.name }}
                                </span>
                                <span
                                    class="text-[10px] leading-tight text-muted-foreground capitalize"
                                >
                                    {{ auth?.user?.role ?? 'Kader' }}
                                </span>
                            </div>
                            <ChevronDown
                                class="size-3.5 text-muted-foreground"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <UserMenuContent v-if="auth?.user" :user="auth.user" />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <!-- Breadcrumbs Row (Jika breadcrumbs > 1) -->
        <div
            v-if="props.breadcrumbs && props.breadcrumbs.length > 1"
            class="border-t border-border/60 bg-muted/20"
        >
            <div
                class="mx-auto flex h-10 w-full max-w-6xl items-center px-4 text-xs text-muted-foreground sm:px-6"
            >
                <Breadcrumbs :breadcrumbs="props.breadcrumbs" />
            </div>
        </div>
    </header>
</template>
