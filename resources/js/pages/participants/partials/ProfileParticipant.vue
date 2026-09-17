<script setup lang="ts">
import {
    Briefcase,
    Calendar,
    Clock,
    Heart,
    House,
    IdCard,
    Layers,
    MapPin,
    Phone,
    ShieldCheck,
    User,
    UserCheck,
    VenusAndMars,
} from '@lucide/vue';
import { TileGroup, TileItem } from '@/components/ui/tile';
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
</script>

<template>
    <div v-if="props.participant" class="w-full">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <!-- Kolom 1: Identitas Peserta -->
            <div class="space-y-1.5">
                <TileGroup>
                    <TileItem
                        label="Nama Lengkap"
                        :value="props.participant.name"
                        :icon="UserCheck"
                        icon-class="text-blue-500"
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
                        icon-class="text-purple-500"
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
                        icon-class="text-yellow-500"
                    />
                    <TileItem
                        label="Nomor Induk Kependudukan"
                        :value="props.participant.nik_masked || 'Tanpa NIK'"
                        :icon="IdCard"
                        icon-class="text-indigo-500"
                    />
                    <TileItem
                        label="Jenis Kelamin"
                        :value="
                            genderMap[props.participant.gender] ||
                            props.participant.gender
                        "
                        :icon="VenusAndMars"
                        icon-class="text-violet-500"
                    />
                    <TileItem
                        label="Tanggal Lahir"
                        :value="formatDate(props.participant.birth_date)"
                        :icon="Calendar"
                        icon-class="text-cyan-500"
                    />
                </TileGroup>
            </div>

            <!-- Kolom 2: Kontak, Domisili & Info Tambahan -->
            <div class="space-y-1.5">
                <TileGroup>
                    <TileItem
                        label="Nomor Telepon"
                        :value="props.participant.phone || '—'"
                        :icon="Phone"
                        icon-class="text-emerald-500"
                    />
                    <TileItem
                        label="Alamat Domisili"
                        :value="props.participant.address || '—'"
                        :icon="House"
                        icon-class="text-rose-500"
                    />
                    <TileItem
                        label="RT / RW"
                        :value="
                            props.participant.rt || props.participant.rw
                                ? `RT ${props.participant.rt || '-'} / RW ${props.participant.rw || '-'}`
                                : '—'
                        "
                        :icon="MapPin"
                        icon-class="text-orange-500"
                    />
                    <TileItem
                        label="Status BPJS"
                        :value="props.participant.has_bpjs ? 'Ya' : 'Tidak'"
                        :icon="ShieldCheck"
                        icon-class="text-teal-500"
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
                        icon-class="text-blue-500"
                    />

                    <!-- Khusus Ibu Hamil -->
                    <TileItem
                        v-else-if="
                            props.participant.category === 'pregnant_mother'
                        "
                        label="Nama Suami"
                        :value="
                            props.participant.latest_pregnancy?.husband_name ||
                            '—'
                        "
                        :icon="User"
                        icon-class="text-sky-500"
                    />

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
                            icon-class="text-amber-600"
                        />
                        <TileItem
                            label="Status Pernikahan"
                            :value="
                                props.participant.adult?.marital_status_label ||
                                '—'
                            "
                            :icon="Heart"
                            icon-class="text-pink-500"
                        />
                    </template>
                </TileGroup>
            </div>
        </div>
    </div>
</template>
