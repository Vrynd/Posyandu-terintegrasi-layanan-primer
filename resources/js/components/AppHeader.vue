<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    Bug,
    FileText,
    HeartPulse,
    HelpCircle,
    LayoutGrid,
    Menu,
    Ruler,
    Stethoscope,
    TrendingUp,
    UserPlus,
} from '@lucide/vue';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
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
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { getInitials } from '@/composables/useInitials';
import { dashboard } from '@/routes';
import examinations from '@/routes/examinations';
import participants from '@/routes/participants';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth);
const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

const pelayananItems = [
    {
        title: 'Pendaftaran',
        href: participants.index(),
        icon: UserPlus,
        description: 'Kelola data sasaran balita, remaja hingga lansia.',
    },
    {
        title: 'Pemeriksaan',
        href: examinations.index(),
        icon: Stethoscope,
        description: 'Catat hasil pemeriksaan kesehatan 5 klaster usia.',
    },
    {
        title: 'Monitoring Stunting',
        href: '#',
        icon: Ruler,
        description: 'Pantau kurva tumbuh kembang dan status gizi balita.',
    },
    {
        title: 'Laporan',
        href: '#',
        icon: FileText,
        description: 'Rekapitulasi bulanan dan pelaporan SIP posyandu.',
    },
];

const dukunganItems = [
    {
        title: 'Panduan & Bantuan',
        href: '#',
        icon: BookOpen,
        description: 'Buku saku dan panduan alur kerja kader posyandu.',
    },
    {
        title: 'Lapor Kendala / Bug',
        href: '#',
        icon: Bug,
        description: 'Laporkan masalah teknis atau saran pengembangan.',
    },
];

const isPelayananActive = computed(() => {
    return isCurrentUrl('/participants*') || isCurrentUrl('/examinations*');
});
</script>

<template>
    <header
        class="sticky top-0 z-30 w-full border-b border-border/80 bg-card/90 backdrop-blur-md"
    >
        <div
            class="mx-auto flex h-16 items-center justify-between px-4 md:max-w-6xl"
        >
            <!-- 1. Kiri: Logo Posyandu & Mobile Drawer Trigger -->
            <div class="flex shrink-0 items-center gap-2">
                <!-- Mobile Menu (Drawer Sheet) -->
                <div class="lg:hidden">
                    <Sheet>
                        <SheetTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="mr-1 h-9 w-9 cursor-pointer"
                            >
                                <Menu class="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" class="w-75 p-6">
                            <SheetTitle class="sr-only"
                                >Navigation menu</SheetTitle
                            >
                            <SheetHeader class="flex justify-start text-left">
                                <AppLogoIcon
                                    class="size-6 fill-current text-black dark:text-white"
                                />
                            </SheetHeader>
                            <div
                                class="flex h-full flex-1 flex-col justify-between space-y-4 py-6"
                            >
                                <nav class="-mx-3 space-y-1">
                                    <!-- Dashboard -->
                                    <Link
                                        :href="dashboard()"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                                        :class="
                                            whenCurrentUrl(
                                                dashboard(),
                                                'bg-muted font-semibold text-foreground',
                                                'text-muted-foreground',
                                            )
                                        "
                                    >
                                        <LayoutGrid
                                            class="h-5 w-5"
                                            :class="
                                                whenCurrentUrl(
                                                    dashboard(),
                                                    'text-primary',
                                                )
                                            "
                                        />
                                        <span>Dashboard</span>
                                    </Link>

                                    <!-- Statistik -->
                                    <Link
                                        href="#"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <TrendingUp class="h-5 w-5" />
                                        <span>Statistik</span>
                                    </Link>

                                    <!-- Pelayanan -->
                                    <div class="pt-3 pb-1">
                                        <span
                                            class="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                        >
                                            Pelayanan
                                        </span>
                                    </div>
                                    <Link
                                        v-for="sub in pelayananItems"
                                        :key="sub.title"
                                        :href="sub.href"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                                        :class="
                                            whenCurrentUrl(
                                                sub.href,
                                                'bg-muted font-semibold text-foreground',
                                                'text-muted-foreground',
                                            )
                                        "
                                    >
                                        <component
                                            :is="sub.icon"
                                            class="h-5 w-5"
                                            :class="
                                                whenCurrentUrl(
                                                    sub.href,
                                                    'text-primary',
                                                )
                                            "
                                        />
                                        <span>{{ sub.title }}</span>
                                    </Link>

                                    <!-- Dukungan -->
                                    <div class="pt-3 pb-1">
                                        <span
                                            class="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                        >
                                            Dukungan
                                        </span>
                                    </div>
                                    <Link
                                        v-for="duk in dukunganItems"
                                        :key="duk.title"
                                        :href="duk.href"
                                        class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <component
                                            :is="duk.icon"
                                            class="h-5 w-5"
                                        />
                                        <span>{{ duk.title }}</span>
                                    </Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link :href="dashboard()" class="flex items-center gap-x-2">
                    <AppLogo />
                </Link>
            </div>

            <!-- 2. Tengah: Desktop Navigation Menu Centering -->
            <div class="hidden h-full lg:flex lg:flex-1 lg:justify-center">
                <NavigationMenu class="flex h-full items-stretch">
                    <NavigationMenuList
                        class="flex h-full items-stretch space-x-1"
                    >
                        <!-- 1. Dashboard -->
                        <NavigationMenuItem
                            class="relative flex h-full items-center"
                        >
                            <Link
                                :class="[
                                    'inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                    isCurrentUrl(dashboard())
                                        ? 'font-semibold text-foreground'
                                        : 'text-muted-foreground',
                                ]"
                                :href="dashboard()"
                            >
                                <LayoutGrid class="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <div
                                v-if="isCurrentUrl(dashboard())"
                                class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-primary"
                            ></div>
                        </NavigationMenuItem>

                        <!-- 2. Statistik -->
                        <NavigationMenuItem
                            class="relative flex h-full items-center"
                        >
                            <Link
                                :class="[
                                    'inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                ]"
                                href="#"
                            >
                                <TrendingUp class="mr-2 h-4 w-4" />
                                <span>Statistik</span>
                            </Link>
                        </NavigationMenuItem>

                        <!-- 3. Pelayanan ▾ (Popover Group) -->
                        <NavigationMenuItem
                            class="relative flex h-full items-center"
                        >
                            <NavigationMenuTrigger
                                :class="[
                                    'h-9 cursor-pointer rounded-md px-3.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground data-[state=open]:bg-muted/80',
                                    isPelayananActive
                                        ? 'font-semibold text-foreground'
                                        : 'text-muted-foreground',
                                ]"
                            >
                                <HeartPulse class="mr-2 h-4 w-4" />
                                <span>Pelayanan</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div
                                    class="grid w-122.5 gap-2 p-2.5 sm:grid-cols-2"
                                >
                                    <Link
                                        v-for="sub in pelayananItems"
                                        :key="sub.title"
                                        :href="sub.href"
                                        class="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/70 dark:hover:bg-muted/50"
                                        :class="
                                            whenCurrentUrl(
                                                sub.href,
                                                'bg-muted/90 dark:bg-muted/80',
                                            )
                                        "
                                    >
                                        <!-- Ikon Kiri -->
                                        <div
                                            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
                                            :class="
                                                whenCurrentUrl(
                                                    sub.href,
                                                    'border-primary/40 bg-primary/10 text-primary',
                                                )
                                            "
                                        >
                                            <component
                                                :is="sub.icon"
                                                class="size-4.5"
                                            />
                                        </div>

                                        <!-- Judul & Deskripsi di Bawahnya -->
                                        <div
                                            class="flex min-w-0 flex-1 flex-col gap-0.5"
                                        >
                                            <span
                                                class="text-sm font-medium transition-colors group-hover:text-primary"
                                                :class="
                                                    whenCurrentUrl(
                                                        sub.href,
                                                        'font-semibold text-primary',
                                                        'text-foreground',
                                                    )
                                                "
                                            >
                                                {{ sub.title }}
                                            </span>
                                            <p
                                                class="line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                                            >
                                                {{ sub.description }}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </NavigationMenuContent>
                            <div
                                v-if="isPelayananActive"
                                class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-primary"
                            ></div>
                        </NavigationMenuItem>

                        <!-- 4. Dukungan ▾ (Popover Group) -->
                        <NavigationMenuItem
                            class="relative flex h-full items-center"
                        >
                            <NavigationMenuTrigger
                                class="h-9 cursor-pointer rounded-md px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground data-[state=open]:bg-muted/80"
                            >
                                <HelpCircle class="mr-2 h-4 w-4" />
                                <span>Dukungan</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div class="flex w-82.5 flex-col gap-1.5 p-2.5">
                                    <Link
                                        v-for="duk in dukunganItems"
                                        :key="duk.title"
                                        :href="duk.href"
                                        class="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/70 dark:hover:bg-muted/50"
                                        :class="
                                            whenCurrentUrl(
                                                duk.href,
                                                'bg-muted/90 dark:bg-muted/80',
                                            )
                                        "
                                    >
                                        <!-- Ikon Kiri -->
                                        <div
                                            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
                                            :class="
                                                whenCurrentUrl(
                                                    duk.href,
                                                    'border-primary/40 bg-primary/10 text-primary',
                                                )
                                            "
                                        >
                                            <component
                                                :is="duk.icon"
                                                class="size-4.5"
                                            />
                                        </div>

                                        <!-- Judul & Deskripsi -->
                                        <div
                                            class="flex min-w-0 flex-1 flex-col gap-0.5"
                                        >
                                            <span
                                                class="text-sm font-medium text-foreground transition-colors group-hover:text-primary"
                                                :class="
                                                    whenCurrentUrl(
                                                        duk.href,
                                                        'font-semibold text-primary',
                                                        'text-foreground',
                                                    )
                                                "
                                            >
                                                {{ duk.title }}
                                            </span>
                                            <p
                                                class="line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                                            >
                                                {{ duk.description }}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <!-- 3. Kanan: User Profile Avatar -->
            <div class="flex shrink-0 items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger :as-child="true">
                        <Button
                            variant="ghost"
                            size="icon"
                            class="relative size-10 w-auto rounded-full p-1 focus-within:ring-2 focus-within:ring-primary"
                        >
                            <Avatar class="size-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    v-if="auth.user.avatar"
                                    :src="auth.user.avatar"
                                    :alt="auth.user.name"
                                />
                                <AvatarFallback
                                    class="rounded-lg bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white"
                                >
                                    {{ getInitials(auth.user?.name) }}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <UserMenuContent :user="auth.user" />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <!-- Breadcrumbs Responsif (Hanya Desktop) -->
        <div
            v-if="props.breadcrumbs.length > 1"
            class="hidden w-full border-t border-sidebar-border/60 sm:flex"
        >
            <div
                class="mx-auto flex h-11 w-full items-center justify-start px-4 text-xs text-neutral-500 md:max-w-6xl"
            >
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </div>
        </div>
    </header>
</template>
