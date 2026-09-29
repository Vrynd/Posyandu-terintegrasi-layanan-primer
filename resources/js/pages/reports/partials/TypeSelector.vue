<script setup lang="ts">
import {
    Activity,
    ChevronRight,
    UserCheck2,
    ShieldAlert,
    Users,
} from '@lucide/vue';
import type { Component } from 'vue';
import { TileGroup, TileItem } from '@/components/ui/tile';
import type { ReportType } from '@/types';

const modelValue = defineModel<ReportType | null>({
    default: null,
});

const toggleSelection = (id: ReportType) => {
    modelValue.value = modelValue.value === id ? null : id;
};

interface ReportTypeOption {
    id: ReportType;
    title: string;
    icon: Component;
    iconClass: string;
}

const reportTypes: ReportTypeOption[] = [
    {
        id: 'examination',
        title: 'Pemeriksaan & Layanan',
        icon: Activity,
        iconClass: 'text-purple-600 dark:text-purple-400',
    },
    {
        id: 'target',
        title: 'Data Sasaran Peserta',
        icon: Users,
        iconClass: 'text-sky-600 dark:text-sky-400',
    },
    {
        id: 'risk',
        title: 'Kasus Risiko & Rujukan',
        icon: ShieldAlert,
        iconClass: 'text-rose-600 dark:text-rose-400',
    },
    {
        id: 'attendance',
        title: 'Laporan Kehadiran',
        icon: UserCheck2,
        iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
];
</script>

<template>
    <div>
        <!-- 1. Mobile (1 Grup Utuh) -->
        <TileGroup
            class="divide-border/40 border-border/40 bg-card/80 shadow-none sm:hidden"
        >
            <TileItem
                v-for="item in reportTypes"
                :key="item.id"
                :icon="item.icon"
                :icon-class="item.iconClass"
                :label="item.title"
                role="button"
                tabindex="0"
                class="hover:none cursor-pointer py-3 select-none [&>span]:font-normal [&>span]:text-foreground"
                @click="toggleSelection(item.id)"
                @keydown.enter="toggleSelection(item.id)"
                @keydown.space.prevent="toggleSelection(item.id)"
            >
                <ChevronRight
                    class="size-4 shrink-0 text-muted-foreground/60"
                />
            </TileItem>
        </TileGroup>

        <!-- 2. Desktop -->
        <div class="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            <TileGroup
                v-for="item in reportTypes"
                :key="item.id"
                class="bg-card/80 shadow-none"
            >
                <TileItem
                    :icon="item.icon"
                    :icon-class="item.iconClass"
                    :label="item.title"
                    role="button"
                    tabindex="0"
                    class="cursor-pointer py-3 select-none [&>span]:text-foreground"
                    @click="toggleSelection(item.id)"
                    @keydown.enter="toggleSelection(item.id)"
                    @keydown.space.prevent="toggleSelection(item.id)"
                >
                    <ChevronRight
                        class="size-4 shrink-0 text-muted-foreground/60"
                    />
                </TileItem>
            </TileGroup>
        </div>
    </div>
</template>
