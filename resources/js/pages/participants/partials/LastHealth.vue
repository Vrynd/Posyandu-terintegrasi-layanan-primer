<script setup lang="ts">
import { Activity, MapPin, Ruler, Scale } from '@lucide/vue';
import { computed } from 'vue';
import { TileGroup, TileItem } from '@/components/ui/tile';
import { formatDate } from '@/lib/date';
import type { ParticipantItem } from '@/types';

const props = defineProps<{
    participant: ParticipantItem | null;
}>();

const exam = computed(() => props.participant?.latest_examination);
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
        <!-- Tampilan Mobile (< sm) -->
        <div class="sm:hidden">
            <TileGroup>
                <TileItem
                    label="Pemeriksaan Terakhir"
                    :value="
                        exam?.examination_date
                            ? formatDate(exam.examination_date)
                            : 'Belum Ada'
                    "
                    :icon="Activity"
                    icon-class="text-emerald-500"
                />
                <TileItem
                    label="Lokasi Pelayanan"
                    :value="exam?.location_label || exam?.location || '—'"
                    :icon="MapPin"
                    icon-class="text-orange-500"
                />
                <TileItem
                    label="Berat Badan (BB)"
                    :value="exam?.weight ? `${exam.weight} kg` : '—'"
                    :icon="Scale"
                    icon-class="text-blue-500"
                />
                <TileItem
                    label="Tinggi / Panjang Badan (TB)"
                    :value="latestHeight ? `${latestHeight} cm` : '—'"
                    :icon="Ruler"
                    icon-class="text-indigo-500"
                />
            </TileGroup>
        </div>

        <!-- Tampilan Desktop (sm+) -->
        <div class="hidden sm:grid sm:grid-cols-2 sm:gap-5">
            <!-- Kolom Kiri: Info Waktu & Tempat Pelayanan -->
            <div class="space-y-1.5">
                <TileGroup>
                    <TileItem
                        label="Tanggal Pemeriksaan Terakhir"
                        :value="
                            exam?.examination_date
                                ? formatDate(exam.examination_date)
                                : 'Belum Ada'
                        "
                        :icon="Activity"
                        icon-class="text-emerald-500"
                    />
                    <TileItem
                        label="Lokasi Pelayanan"
                        :value="exam?.location_label || exam?.location || '—'"
                        :icon="MapPin"
                        icon-class="text-orange-500"
                    />
                </TileGroup>
            </div>

            <!-- Kolom Kanan: Pengukuran Fisik -->
            <div class="space-y-1.5">
                <TileGroup>
                    <TileItem
                        label="Berat Badan (BB)"
                        :value="exam?.weight ? `${exam.weight} kg` : '—'"
                        :icon="Scale"
                        icon-class="text-blue-500"
                    />
                    <TileItem
                        label="Tinggi / Panjang Badan (TB)"
                        :value="latestHeight ? `${latestHeight} cm` : '—'"
                        :icon="Ruler"
                        icon-class="text-indigo-500"
                    />
                </TileGroup>
            </div>
        </div>
    </div>
</template>
