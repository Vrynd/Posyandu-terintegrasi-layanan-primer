<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    Activity,
    BookOpen,
    Bug,
    Calendar,
    Database,
    FileText,
    KeyRound,
    LayoutGrid,
    Ruler,
    Stethoscope,
    TrendingUp,
    UserPlus,
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
import type { NavGroup } from '@/types';

const page = usePage();
const userRole = computed(() => page.props.auth?.user?.role);

const navGroups = computed<NavGroup[]>(() => {
    const groups: NavGroup[] = [
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
                },
            ],
        },
        {
            title: 'Pelayanan',
            items: [
                {
                    title: 'Pendaftaran',
                    href: '#',
                    icon: UserPlus,
                },
                {
                    title: 'Pemeriksaan',
                    href: '#',
                    icon: Stethoscope,
                },
                {
                    title: 'Monitoring Stunting',
                    href: '#',
                    icon: Ruler,
                    isLocked: true,
                },
                {
                    title: 'Jadwal Kegiatan',
                    href: '#',
                    icon: Calendar,
                },
                {
                    title: 'Laporan',
                    href: '#',
                    icon: FileText,
                },
            ],
        },
    ];

    if (userRole.value === 'administrator') {
        groups.push({
            title: 'Manajemen Sistem',
            items: [
                {
                    title: 'Kode Undangan',
                    href: '#',
                    icon: KeyRound,
                },
                {
                    title: 'Log Aktivitas',
                    href: '#',
                    icon: Activity,
                },
                {
                    title: 'Backup Data',
                    href: '#',
                    icon: Database,
                },
            ],
        });
    }

    groups.push({
        title: 'Dukungan',
        items: [
            {
                title: 'Pengaduan Bug',
                href: '#',
                icon: Bug,
            },
            {
                title: 'Panduan & Bantuan',
                href: '#',
                icon: BookOpen,
                isLocked: true,
            },
        ],
    });

    return groups;
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
