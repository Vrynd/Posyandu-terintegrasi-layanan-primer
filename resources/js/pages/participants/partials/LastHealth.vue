<script setup lang="ts">
import { Activity, MapPin, Ruler, Scale } from '@lucide/vue';
import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
import { TileGroup, TileItem } from '@/components/ui/tile';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/date';
import type { ParticipantItem } from '@/types';

const props = defineProps<{
    participant: ParticipantItem | null;
}>();

const isMobile = useMediaQuery('(max-width: 639px)');

const exam = computed(() => props.participant?.latest_examination);
const examDateText = computed(() => {
    return exam.value?.examination_date
        ? formatDate(exam.value.examination_date)
        : 'Belum pernah periksa';
});

const latestHeight = computed(() => {
    if (!exam.value) {
        return null;
    }

    return (
        exam.value.toddler?.height ??
        exam.value.teen?.height ??
        exam.value.adult?.height ??
        null
    );
});
</script>

<template>
    <div v-if="props.participant" class="w-full">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <TileGroup>
                <TileItem
                    label="Tanggal Pemeriksaan"
                    :value="examDateText"
                    :icon="Activity"
                    icon-class="text-emerald-600 dark:text-emerald-400"
                >
                    <TooltipProvider>
                        <Tooltip :disabled="!isMobile">
                            <TooltipTrigger as-child>
                                <span
                                    class="block max-w-30 cursor-pointer truncate sm:max-w-none sm:cursor-default sm:whitespace-normal"
                                >
                                    {{ examDateText }}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent class="max-w-xs text-xs sm:hidden">
                                {{ examDateText }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TileItem>
                <TileItem
                    label="Lokasi Pelayanan"
                    :value="exam?.location_label || exam?.location || '—'"
                    :icon="MapPin"
                    icon-class="text-orange-600 dark:text-orange-400"
                />
            </TileGroup>

            <TileGroup>
                <TileItem
                    label="Berat Badan (BB)"
                    :value="exam?.weight ? `${exam.weight} kg` : '—'"
                    :icon="Scale"
                    icon-class="text-blue-600 dark:text-blue-400"
                    :is-mono="Boolean(exam?.weight)"
                />
                <TileItem
                    label="Tinggi / Panjang Badan (TB)"
                    :value="latestHeight ? `${latestHeight} cm` : '—'"
                    :icon="Ruler"
                    icon-class="text-indigo-600 dark:text-indigo-400"
                    :is-mono="Boolean(latestHeight)"
                />
            </TileGroup>
        </div>
    </div>
</template>
