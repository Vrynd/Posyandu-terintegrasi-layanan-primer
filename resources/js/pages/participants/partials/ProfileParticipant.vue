<script setup lang="ts">
import {
    Activity,
    Briefcase,
    Calendar,
    Clock,
    Heart,
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
import { computed } from 'vue';
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

// Helper untuk mengambil pemeriksaan kesehatan terkini
const exam = computed(() => props.participant?.latest_examination);

// Helper untuk mengambil nilai Tinggi/Panjang Badan dari kategori yang sesuai
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
    <div class="w-full">
        <template v-if="props.participant">
            <!-- Data Profil Peserta (6 Kiri vs 6 Kanan) -->
            <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
                <!-- Identitas Peserta (6 Data) -->
                <div class="space-y-1.5">
                    <TileGroup class="border-border bg-transparent">
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

                <!-- Kontak, Domisili & Info Tambahan (6 Data) -->
                <div class="space-y-1.5">
                    <TileGroup class="border-border bg-transparent">
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
                                props.participant.latest_pregnancy
                                    ?.husband_name || '—'
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
                                    props.participant.adult?.employment_label ||
                                    '—'
                                "
                                :icon="Briefcase"
                                icon-class="text-amber-600"
                            />
                            <TileItem
                                label="Status Pernikahan"
                                :value="
                                    props.participant.adult
                                        ?.marital_status_label || '—'
                                "
                                :icon="Heart"
                                icon-class="text-pink-500"
                            />
                        </template>
                    </TileGroup>
                </div>
            </div>

            <!-- Label Separator Pemeriksaan Terakhir -->
            <div class="mb-3 flex items-center gap-3">
                <div
                    class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                    <Activity class="size-3.5 text-primary" />
                    <span>Pemeriksaan Kesehatan Terakhir</span>
                </div>
                <div class="h-px flex-1 bg-border/60" />
            </div>

            <!-- Data Pemeriksaan Terakhir (2 Kiri vs 2 Kanan) -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
                <!-- Info Pelayanan (2 Data Kiri) -->
                <div class="space-y-1.5">
                    <TileGroup class="border-border bg-transparent">
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
                            :value="
                                exam?.location_label || exam?.location || '—'
                            "
                            :icon="MapPin"
                            icon-class="text-orange-500"
                        />
                    </TileGroup>
                </div>

                <!-- Pengukuran Fisik (2 Data Kanan) -->
                <div class="space-y-1.5">
                    <TileGroup class="border-border bg-transparent">
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
        </template>
    </div>
</template>
