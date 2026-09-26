<script setup lang="ts">
import { CalendarClock, Layers, UserCheck, VenusAndMars } from '@lucide/vue';
import { computed } from 'vue';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/date';
import type { ParticipantItem } from '@/types';

const props = defineProps<{
    participant: ParticipantItem | null;
}>();

const latestExamDateText = computed(() => {
    const examDate = props.participant?.latest_examination?.examination_date;

    return examDate ? formatDate(examDate) : 'Belum pernah periksa';
});

const profileItems = computed(() => [
    {
        label: 'Nama Peserta',
        value: props.participant?.name ?? '—',
        icon: UserCheck,
        iconBgClass:
            'bg-blue-600 text-white ring-3 ring-blue-100 dark:bg-blue-500 dark:ring-blue-900/40',
    },
    {
        label: 'Kategori Sasaran',
        value:
            props.participant?.category_label ??
            props.participant?.category ??
            '—',
        icon: Layers,
        iconBgClass:
            'bg-teal-600 text-white ring-3 ring-teal-100 dark:bg-teal-500 dark:ring-teal-900/40',
    },
    {
        label: 'Jenis Kelamin',
        value:
            props.participant?.gender_label ?? props.participant?.gender ?? '—',
        icon: VenusAndMars,
        iconBgClass:
            'bg-purple-600 text-white ring-3 ring-purple-100 dark:bg-purple-500 dark:ring-purple-900/40',
    },
    {
        label: 'Pemeriksaan Terakhir',
        value: latestExamDateText.value,
        icon: CalendarClock,
        iconBgClass:
            'bg-emerald-600 text-white ring-3 ring-emerald-100 dark:bg-emerald-500 dark:ring-emerald-900/40',
    },
]);
</script>

<template>
    <div v-if="props.participant" class="w-full">
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Card
                v-for="item in profileItems"
                :key="item.label"
                class="flex flex-row items-center gap-3 rounded-2xl border border-card bg-card p-3.5 shadow-none transition-colors sm:gap-3.5 sm:p-4 sm:py-3.5 dark:border-border"
            >
                <div
                    :class="[
                        'flex size-10 shrink-0 items-center justify-center rounded-full',
                        item.iconBgClass,
                    ]"
                >
                    <component :is="item.icon" class="size-5" />
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                    <p
                        class="truncate text-xs font-medium text-muted-foreground"
                    >
                        {{ item.label }}
                    </p>
                    <p
                        class="truncate text-xs font-semibold text-foreground sm:text-sm"
                        :title="item.value"
                    >
                        {{ item.value }}
                    </p>
                </div>
            </Card>
        </div>
    </div>
</template>
