<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    ArrowRightUpIcon,
    BotIcon,
    DocumentTextIcon,
    HistoryIcon,
    LockKeyholeIcon,
    UserCheckRoundedIcon,
} from '@solar-icons/vue/linear';
import { Card } from '@/components/ui/card';
import participants from '@/routes/participants';
import reports from '@/routes/reports';

// Data 4 Menu Aksi Cepat Dashboard Mobile (Grid 2x2 Format 2 Baris)
const quickActions = [
    {
        line1: 'Catat',
        line2: 'Pemeriksaan',
        href: participants.index(),
        icon: UserCheckRoundedIcon,
        rightIcon: ArrowRightUpIcon,
        isLocked: false,
        gradient:
            'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25',
    },
    {
        line1: 'Buat',
        line2: 'Laporan',
        href: reports.index(),
        icon: DocumentTextIcon,
        rightIcon: ArrowRightUpIcon,
        isLocked: false,
        gradient:
            'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25',
    },
    {
        line1: 'AI',
        line2: 'Asisten',
        href: '#',
        icon: BotIcon,
        rightIcon: LockKeyholeIcon,
        isLocked: true,
        gradient:
            'bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/25',
    },
    {
        line1: 'Riwayat',
        line2: 'Aktivitas',
        href: '#',
        icon: HistoryIcon,
        rightIcon: LockKeyholeIcon,
        isLocked: true,
        gradient:
            'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25',
    },
];
</script>

<template>
    <div class="grid grid-cols-2 gap-3 lg:hidden">
        <component
            :is="item.isLocked ? 'div' : Link"
            v-for="item in quickActions"
            :key="item.line1 + item.line2"
            :href="item.isLocked ? undefined : item.href"
            class="block select-none focus-visible:outline-none"
            :class="item.isLocked ? 'cursor-not-allowed' : 'group'"
        >
            <Card
                class="flex flex-col justify-between gap-4 rounded-2xl border-0 bg-card p-4 transition-all duration-200"
                :class="
                    item.isLocked
                        ? 'opacity-85'
                        : 'hover:bg-card/90 active:scale-[0.98]'
                "
            >
                <div class="flex items-center justify-between">
                    <div
                        class="relative flex size-7 shrink-0 items-center justify-center rounded-full p-[1.5px] shadow-sm transition-transform duration-200 group-hover:scale-105"
                        :class="item.gradient"
                    >
                        <div
                            class="flex size-full items-center justify-center rounded-full bg-white/20 backdrop-blur-xs"
                        >
                            <component
                                :is="item.icon"
                                class="size-3.5 text-accent-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                            />
                        </div>
                    </div>
                    <div class="flex items-center justify-center">
                        <component
                            :is="item.rightIcon"
                            class="size-3.5 text-muted-foreground/40 transition-all duration-200"
                            :class="[
                                !item.isLocked &&
                                    'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary',
                            ]"
                        />
                    </div>
                </div>

                <!-- Nama Menu dan Badge Segera -->
                <div class="flex flex-col leading-tight">
                    <span
                        class="text-[13px] font-medium tracking-tight text-foreground transition-colors group-hover:text-primary"
                    >
                        {{ item.line1 }}
                    </span>
                    <div class="flex items-center gap-1.5">
                        <span
                            class="text-[13px] font-medium tracking-tight text-foreground transition-colors group-hover:text-primary"
                        >
                            {{ item.line2 }}
                        </span>
                        <span
                            v-if="item.isLocked"
                            class="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                        >
                            Segera
                        </span>
                    </div>
                </div>
            </Card>
        </component>
    </div>
</template>
