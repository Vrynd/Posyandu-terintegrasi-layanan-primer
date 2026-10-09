<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    Bot,
    Bug,
    ClipboardList,
    Database,
    FileText,
    History,
    KeyRound,
    LayoutGrid,
    MessageSquare,
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
import participants from '@/routes/participants';
import tokens from '@/routes/tokens';
import users from '@/routes/users';
import type { NavItem } from '@/types';

const page = usePage();
const userRole = computed(() => page.props.auth?.user?.role);

const navItems = computed<NavItem[]>(() => {
    // 1. Menu Khusus Administrator (IT & Pemeliharaan Sistem)
    if (userRole.value === 'administrator') {
        return [
            {
                title: 'Dashboard Sistem',
                href: dashboard(),
                icon: LayoutGrid,
            },
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
        ];
    }

    // 2. Menu Khusus Kader (Pelayanan & Data Kesehatan Posyandu)
    return [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Peserta',
            href: participants.index(),
            icon: UserPlus,
        },
        {
            title: 'Laporan',
            href: '/reports',
            icon: FileText,
        },
        {
            title: 'Riwayat Aktivitas',
            href: '#',
            icon: History,
            isLocked: true,
        },
        {
            title: 'Tanya AI',
            href: '#',
            icon: Bot,
            isLocked: true,
        },
        {
            title: 'Pengaduan Bug',
            href: '#',
            icon: Bug,
            isLocked: true,
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
            <NavMain :items="navItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
