<script setup lang="ts">
import {
    Baby,
    Briefcase,
    Calendar,
    Clock,
    Heart,
    History,
    House,
    IdCard,
    Layers,
    MapPin,
    Phone,
    Ruler,
    Scale,
    ShieldCheck,
    User,
    UserCheck,
    VenusAndMars,
} from '@lucide/vue';
import { useMediaQuery } from '@vueuse/core';
import { TileGroup, TileItem } from '@/components/ui/tile';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { calculateAge, formatDate } from '@/lib/date';
import { formatCategory, genderMap } from '@/lib/participant';
import type { FilterOption, ParticipantItem } from '@/types';

interface Props {
    participant: ParticipantItem | null;
    categories?: FilterOption[];
}

const props = withDefaults(defineProps<Props>(), {
    categories: () => [],
});

const isMobile = useMediaQuery('(max-width: 639px)');
</script>

<template>
    <div v-if="props.participant" class="w-full">
        <div class="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6">
            <!-- Kolom 1: Identitas Pokok Peserta -->
            <TileGroup>
                <TileItem
                    label="Nama Lengkap"
                    :value="props.participant.name"
                    :icon="UserCheck"
                    icon-class="text-blue-600 dark:text-blue-400"
                />
                <TileItem
                    label="Kategori"
                    :value="
                        formatCategory(
                            props.participant.category,
                            props.categories,
                        )
                    "
                    :icon="Layers"
                    icon-class="text-purple-600 dark:text-purple-400"
                />
                <TileItem
                    label="Usia"
                    :value="
                        calculateAge(
                            props.participant.birth_date,
                            props.participant.category,
                        )
                    "
                    :icon="Clock"
                    icon-class="text-amber-600 dark:text-amber-400"
                />
                <TileItem
                    label="Nomor Induk"
                    :value="props.participant.nik_masked || 'Tanpa NIK'"
                    :icon="IdCard"
                    icon-class="text-indigo-600 dark:text-indigo-400"
                    :is-mono="
                        Boolean(
                            props.participant.nik ||
                            props.participant.nik_masked,
                        )
                    "
                />
                <TileItem
                    label="Jenis Kelamin"
                    :value="
                        genderMap[props.participant.gender] ||
                        props.participant.gender
                    "
                    :icon="VenusAndMars"
                    icon-class="text-violet-600 dark:text-violet-400"
                />
                <TileItem
                    label="Tanggal Lahir"
                    :value="formatDate(props.participant.birth_date)"
                    :icon="Calendar"
                    icon-class="text-sky-600 dark:text-sky-400"
                />

                <!-- Tambahan Khusus Ibu Hamil agar Seimbang (8 vs 8) -->
                <template
                    v-if="props.participant.category === 'pregnant_mother'"
                >
                    <TileItem
                        label="Nomor Telepon / WA"
                        :value="props.participant.phone || '—'"
                        :icon="Phone"
                        icon-class="text-emerald-600 dark:text-emerald-400"
                        :is-mono="Boolean(props.participant.phone)"
                    />
                    <TileItem
                        label="Kepesertaan BPJS"
                        :value="
                            props.participant.has_bpjs
                                ? 'Ya (Aktif)'
                                : 'Tidak Ada'
                        "
                        :icon="ShieldCheck"
                        icon-class="text-teal-600 dark:text-teal-400"
                    />
                </template>
            </TileGroup>

            <!-- Kolom 2: Kontak, Domisili & Atribut Kategori -->
            <TileGroup>
                <!-- Nomor Telepon untuk kategori selain Ibu Hamil -->
                <TileItem
                    v-if="props.participant.category !== 'pregnant_mother'"
                    label="Nomor Telepon / WA"
                    :value="props.participant.phone || '—'"
                    :icon="Phone"
                    icon-class="text-emerald-600 dark:text-emerald-400"
                    :is-mono="Boolean(props.participant.phone)"
                />
                <TileItem
                    label="Alamat Domisili"
                    :value="props.participant.address || '—'"
                    :icon="House"
                    icon-class="text-rose-600 dark:text-rose-400"
                >
                    <TooltipProvider>
                        <Tooltip
                            :disabled="!isMobile || !props.participant.address"
                        >
                            <TooltipTrigger as-child>
                                <span
                                    class="block max-w-35 cursor-pointer truncate sm:max-w-none sm:cursor-default sm:whitespace-normal"
                                >
                                    {{ props.participant.address || '—' }}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent
                                class="max-w-xs text-xs wrap-break-word sm:hidden"
                            >
                                {{ props.participant.address }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TileItem>
                <TileItem
                    label="RT / RW"
                    :value="
                        props.participant.rt || props.participant.rw
                            ? `RT ${props.participant.rt || '-'} / RW ${props.participant.rw || '-'}`
                            : '—'
                    "
                    :icon="MapPin"
                    icon-class="text-orange-600 dark:text-orange-400"
                />

                <!-- BPJS untuk kategori selain Ibu Hamil -->
                <TileItem
                    v-if="props.participant.category !== 'pregnant_mother'"
                    label="Kepesertaan BPJS"
                    :value="
                        props.participant.has_bpjs ? 'Ya (Aktif)' : 'Tidak Ada'
                    "
                    :icon="ShieldCheck"
                    icon-class="text-teal-600 dark:text-teal-400"
                />

                <!-- Khusus Balita & Remaja -->
                <TileItem
                    v-if="
                        props.participant.category === 'toddler' ||
                        props.participant.category === 'teenager'
                    "
                    label="Orang Tua / Wali"
                    :value="
                        props.participant.toddler?.parent_name ||
                        props.participant.teen?.parent_name ||
                        '—'
                    "
                    :icon="User"
                    icon-class="text-blue-600 dark:text-blue-400"
                />

                <!-- Khusus Ibu Hamil (8 Item Seimbang dengan Kolom Kiri) -->
                <template
                    v-else-if="props.participant.category === 'pregnant_mother'"
                >
                    <TileItem
                        label="Nama Suami"
                        :value="
                            props.participant.latest_pregnancy?.husband_name ||
                            '—'
                        "
                        :icon="User"
                        icon-class="text-sky-600 dark:text-sky-400"
                    />
                    <TileItem
                        label="Hamil Anak Ke-"
                        :value="
                            props.participant.latest_pregnancy?.pregnancy_number
                                ? `Ke-${props.participant.latest_pregnancy.pregnancy_number}`
                                : '—'
                        "
                        :icon="Baby"
                        icon-class="text-rose-600 dark:text-rose-400"
                    />
                    <TileItem
                        label="Jarak Kehamilan"
                        :value="
                            props.participant.latest_pregnancy
                                ?.birth_spacing_years
                                ? `${props.participant.latest_pregnancy.birth_spacing_years} Tahun`
                                : props.participant.latest_pregnancy
                                        ?.pregnancy_number === 1
                                  ? 'Anak Pertama'
                                  : '—'
                        "
                        :icon="History"
                        icon-class="text-amber-600 dark:text-amber-400"
                    />
                    <TileItem
                        label="BB Pra-Hamil"
                        :value="
                            props.participant.latest_pregnancy
                                ?.weight_before_pregnancy
                                ? `${props.participant.latest_pregnancy.weight_before_pregnancy} kg`
                                : '—'
                        "
                        :icon="Scale"
                        icon-class="text-teal-600 dark:text-teal-400"
                    />
                    <TileItem
                        label="Tinggi Badan"
                        :value="
                            props.participant.latest_pregnancy?.height
                                ? `${props.participant.latest_pregnancy.height} cm`
                                : '—'
                        "
                        :icon="Ruler"
                        icon-class="text-indigo-600 dark:text-indigo-400"
                    />
                    <TileItem
                        label="HPHT"
                        :value="
                            props.participant.latest_pregnancy
                                ?.last_menstrual_period
                                ? formatDate(
                                      props.participant.latest_pregnancy
                                          .last_menstrual_period,
                                  )
                                : '—'
                        "
                        :icon="Calendar"
                        icon-class="text-pink-600 dark:text-pink-400"
                    />
                </template>

                <!-- Khusus Dewasa & Lansia -->
                <template
                    v-else-if="
                        props.participant.category === 'productive' ||
                        props.participant.category === 'adult'
                    "
                >
                    <TileItem
                        label="Pekerjaan"
                        :value="
                            props.participant.adult?.employment_label || '—'
                        "
                        :icon="Briefcase"
                        icon-class="text-amber-700 dark:text-amber-400"
                    />
                    <TileItem
                        label="Status Pernikahan"
                        :value="
                            props.participant.adult?.marital_status_label || '—'
                        "
                        :icon="Heart"
                        icon-class="text-pink-600 dark:text-pink-400"
                    />
                </template>
            </TileGroup>
        </div>
    </div>
</template>
