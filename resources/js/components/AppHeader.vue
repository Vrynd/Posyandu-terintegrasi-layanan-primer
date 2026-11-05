<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    ClipboardList,
    Database,
    KeyRound,
    MessageSquare,
    Users,
} from '@lucide/vue';
import {
    BellIcon,
    ClockCircleIcon,
    FileSpreadsheetIcon,
    HealthIcon,
    MagnifierIcon,
    WidgetIcon,
} from '@solar-icons/vue/linear';
import { useWindowScroll } from '@vueuse/core';
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
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { getInitials } from '@/composables/useInitials';
import { dashboard } from '@/routes';
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

// Menu navigasi untuk Kader (Dashboard, Pelayanan, Pencarian, Import Data)
// Catatan: Menu Pemeriksaan dan Buat Laporan dipindahkan ke dalam halaman Pelayanan
const kaderNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: WidgetIcon,
        active: () => isCurrentUrl(dashboard()),
        isLocked: false,
    },
    {
        title: 'Pelayanan',
        href: '/pelayanan',
        icon: HealthIcon,
        active: () =>
            isCurrentOrParentUrl('/pelayanan') ||
            isCurrentOrParentUrl('/participants') ||
            isCurrentOrParentUrl('/examinations') ||
            isCurrentOrParentUrl('/reports'),
        isLocked: false,
    },
    {
        title: 'Pencarian',
        href: '/pencarian',
        icon: MagnifierIcon,
        active: () => isCurrentOrParentUrl('/pencarian'),
        isLocked: false,
    },
    {
        title: 'Import Data',
        href: '/impor',
        icon: FileSpreadsheetIcon,
        active: () => isCurrentOrParentUrl('/impor'),
        isLocked: false,
    },
];

// Menu navigasi untuk Administrator (IT & Pengaturan Sistem)
const adminNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: WidgetIcon,
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

const { y } = useWindowScroll();
const isScrolled = computed(() => y.value > 15);
</script>

<template>
    <header
        class="sticky top-0 z-30 w-full transition-all duration-300 ease-out"
        :class="[
            isScrolled
                ? 'max-lg:border-b max-lg:border-border/60 max-lg:bg-white/95 max-lg:shadow-xs max-lg:backdrop-blur-md lg:pointer-events-none lg:border-b-0 lg:border-none lg:bg-transparent lg:pt-3 lg:shadow-none dark:max-lg:bg-neutral-900/95'
                : 'bg-background/90 backdrop-blur-md',
        ]"
    >
        <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div
                class="flex h-16 w-full items-center justify-between transition-all duration-300 ease-out lg:justify-normal"
                :class="[
                    isScrolled
                        ? 'lg:pointer-events-auto lg:h-14 lg:rounded-full lg:bg-white lg:pr-2.5 lg:pl-3.5 lg:shadow-xl lg:shadow-black/8 dark:lg:bg-neutral-900 dark:lg:shadow-black/50'
                        : '',
                ]"
            >
                <!-- 1. Kiri: Logo Posyandu -->
                <div class="flex shrink-0 items-center justify-start">
                    <Link :href="dashboard()" class="flex items-center gap-x-2">
                        <AppLogo />
                    </Link>
                </div>

                <!-- 2. Tengah: Desktop Navigation Menu (Visual Center: Jarak Kiri == Jarak Kanan) -->
                <div
                    class="hidden h-full flex-1 items-center justify-center lg:flex"
                >
                    <NavigationMenu class="flex h-full items-stretch">
                        <NavigationMenuList
                            class="flex h-full items-stretch space-x-1"
                        >
                            <!-- Nav Items Utama Langsung Sejajar -->
                            <NavigationMenuItem
                                v-for="item in activeNavItems"
                                :key="item.title"
                                class="relative flex h-full items-center"
                            >
                                <Link
                                    :href="item.isLocked ? '#' : item.href"
                                    class="group inline-flex h-9 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition-all duration-200 ease-in-out focus-visible:outline-none xl:px-3.5 xl:text-sm"
                                    :class="[
                                        item.isLocked
                                            ? 'cursor-not-allowed opacity-60'
                                            : '',
                                        item.active()
                                            ? 'bg-neutral-900 font-semibold text-white shadow-xs dark:bg-white dark:text-neutral-900'
                                            : 'text-muted-foreground hover:bg-primary/8 hover:text-primary',
                                    ]"
                                >
                                    <component
                                        :is="item.icon"
                                        class="mr-2 size-4.5 shrink-0 transition-colors duration-200"
                                        :class="
                                            item.active()
                                                ? 'text-white dark:text-neutral-900'
                                                : 'text-muted-foreground/80 group-hover:text-primary'
                                        "
                                    />
                                    <span class="whitespace-nowrap">{{
                                        item.title
                                    }}</span>
                                    <ClockCircleIcon
                                        v-if="item.isLocked"
                                        class="ml-1.5 size-3.5 text-muted-foreground/60 transition-colors duration-200 group-hover:text-primary/70"
                                    />
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <!-- 3. Kanan: Segmented Control (Notifikasi & User Profile) -->
                <div class="flex shrink-0 items-center justify-end">
                    <div
                        class="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-transparent p-0.5 transition-colors dark:border-border/60"
                    >
                        <!-- Circle Button Notifikasi -->
                        <DropdownMenu>
                            <DropdownMenuTrigger :as-child="true">
                                <Button
                                    variant="secondary"
                                    size="icon-sm"
                                    class="relative rounded-full"
                                >
                                    <BellIcon
                                        class="size-4 transition-colors duration-200"
                                    />
                                    <!-- Indikator Dot Notifikasi -->
                                    <span
                                        class="absolute top-1 right-1 flex size-1.5"
                                    >
                                        <span
                                            class="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75"
                                        ></span>
                                        <span
                                            class="relative inline-flex size-1.5 rounded-full bg-rose-500"
                                        ></span>
                                    </span>
                                    <span class="sr-only">Notifikasi</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                class="w-72 p-0 shadow-lg"
                            >
                                <div
                                    class="flex items-center justify-between border-b border-border/80 px-4 py-3"
                                >
                                    <span
                                        class="text-xs font-semibold text-foreground"
                                        >Notifikasi</span
                                    >
                                    <span
                                        class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                                        >0 Baru</span
                                    >
                                </div>
                                <div class="p-5 text-center">
                                    <div
                                        class="mx-auto flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
                                    >
                                        <BellIcon class="size-5" />
                                    </div>
                                    <p
                                        class="mt-2.5 text-xs font-medium text-foreground"
                                    >
                                        Belum ada notifikasi baru
                                    </p>
                                    <p
                                        class="mt-1 text-[11px] leading-relaxed text-muted-foreground"
                                    >
                                        Pengumuman jadwal dan aktivitas posyandu
                                        akan ditampilkan di sini.
                                    </p>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <!-- Circle Button Avatar Profile -->
                        <DropdownMenu>
                            <DropdownMenuTrigger :as-child="true">
                                <Button
                                    variant="secondary"
                                    size="icon-sm"
                                    class="rounded-full p-0"
                                >
                                    <Avatar
                                        class="size-full overflow-hidden rounded-full"
                                    >
                                        <AvatarImage
                                            v-if="auth?.user?.avatar"
                                            :src="auth.user.avatar"
                                            :alt="auth.user.name"
                                        />
                                        <AvatarFallback
                                            class="size-full rounded-full bg-transparent text-xs font-semibold transition-colors duration-200"
                                        >
                                            {{ getInitials(auth?.user?.name) }}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-56">
                                <UserMenuContent
                                    v-if="auth?.user"
                                    :user="auth.user"
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>

        <!-- Breadcrumbs Row (Jika breadcrumbs > 1) -->
        <div
            v-if="
                props.breadcrumbs && props.breadcrumbs.length > 1 && !isScrolled
            "
            class="pointer-events-auto border-t border-border/60 bg-muted/20"
        >
            <div
                class="mx-auto flex h-10 w-full max-w-6xl items-center px-4 text-xs text-muted-foreground sm:px-6"
            >
                <Breadcrumbs :breadcrumbs="props.breadcrumbs" />
            </div>
        </div>
    </header>
</template>
