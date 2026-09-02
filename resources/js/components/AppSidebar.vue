<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    BookOpen,
    Bug,
    ClipboardList,
    Database,
    FileText,
    KeyRound,
    LayoutGrid,
    MessageSquare,
    Ruler,
    Stethoscope,
    TrendingUp,
    UserPlus,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import examinations from '@/routes/examinations';
import participants from '@/routes/participants';
import tokens from '@/routes/tokens';
import users from '@/routes/users';
import type { NavGroup } from '@/types';

const page = usePage();
const userRole = computed(() => page.props.auth?.user?.role);

const navGroups = computed<NavGroup[]>(() => {
    // 1. Menu Khusus Administrator (IT & Pemeliharaan Sistem)
    if (userRole.value === 'administrator') {
        return [
            {
                title: 'Utama',
                items: [
                    {
                        title: 'Dashboard Sistem',
                        href: dashboard(),
                        icon: LayoutGrid,
                    },
                ],
            },
            {
                title: 'Operasional Sistem',
                items: [
                    {
                        title: 'Manajemen Pengguna',
                        href: users.index(),
                        icon: Users,
                    },
                    {
                        title: 'Kelola Token',
                        href: tokens.index(),
                        icon: KeyRound,
                    },
                    {
                        title: 'Kelola Formulir',
                        href: '/myadmin/forms',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Backup & Restore',
                        href: '#',
                        icon: Database,
                        isLocked: true,
                    },
                    {
                        title: 'Log Aktivitas',
                        href: '#',
                        icon: Activity,
                        isLocked: true,
                    },
                    {
                        title: 'Pusat Pengaduan',
                        href: '#',
                        icon: MessageSquare,
                        isLocked: true,
                    },
                ],
            },
        ];
    }

    // 2. Menu Khusus Kader (Pelayanan & Data Kesehatan Posyandu)
    return [
        {
            title: 'Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
                {
                    title: 'Statistik Posyandu',
                    href: '#',
                    icon: TrendingUp,
                    isLocked: true,
                },
            ],
        },
        {
            title: 'Pelayanan',
            items: [
                {
                    title: 'Pendaftaran',
                    href: participants.index(),
                    icon: UserPlus,
                },
                {
                    title: 'Pemeriksaan',
                    href: examinations.index(),
                    icon: Stethoscope,
                    items: [
                        {
                            title: 'Ibu Hamil',
                            href: '/examinations/pregnant-mothers',
                        },
                        {
                            title: 'Balita',
                            href: '/examinations/toddlers',
                        },
                        {
                            title: 'Usia Remaja',
                            href: '/examinations/teens',
                        },
                        {
                            title: 'Usia Produktif',
                            href: '/examinations/productive',
                        },
                        {
                            title: 'Lansia',
                            href: '/examinations/elderly',
                        },
                    ],
                },
                {
                    title: 'Monitoring Stunting',
                    href: '#',
                    icon: Ruler,
                    isLocked: true,
                },
                {
                    title: 'Laporan',
                    href: '#',
                    icon: FileText,
                    isLocked: true,
                },
            ],
        },
        {
            title: 'Dukungan',
            items: [
                {
                    title: 'Lapor Kendala / Bug',
                    href: '#',
                    icon: Bug,
                    isLocked: true,
                },
                {
                    title: 'Panduan & Bantuan',
                    href: '#',
                    icon: BookOpen,
                    isLocked: true,
                },
            ],
        },
    ];
});
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :groups="navGroups" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
