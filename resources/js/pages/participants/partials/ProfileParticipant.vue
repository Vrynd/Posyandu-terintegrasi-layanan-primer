<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    Briefcase,
    Calendar,
    Clock,
    Heart,
    HeartPulse,
    House,
    IdCard,
    Layers,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    User,
    UserCheck,
    VenusAndMars,
} from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { TileGroup, TileItem } from '@/components/ui/tile';
import { calculateAge, formatDate } from '@/lib/date';
import { formatCategory, genderMap } from '@/lib/participant';
import { create as createExamination } from '@/routes/examinations';
import { edit as editParticipant } from '@/routes/participants';
import type { FilterOption, ParticipantItem } from '@/types';

const props = defineProps<{
    open: boolean;
    participant: ParticipantItem | null;
    categories?: FilterOption[];
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();
</script>

<template>
    <Sheet :open="props.open" @update:open="emit('update:open', $event)">
        <SheetContent
            side="bottom"
            @open-auto-focus.prevent
            class="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-card px-4 pt-0 pb-4 shadow-2xl **:data-[slot=sheet-close]:hidden sm:px-6 sm:py-6 sm:**:data-[slot=sheet-close]:inline-flex"
        >
            <template v-if="props.participant">
                <div class="mx-auto flex w-full max-w-3xl flex-col">
                    <div
                        class="sticky top-0 z-20 -mx-4 flex justify-center rounded-t-3xl bg-card px-4 pt-3 pb-3.5 sm:static sm:z-auto sm:mx-0 sm:mb-4 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0"
                    >
                        <div
                            class="h-1 w-14 rounded-full bg-muted-foreground/25 sm:h-1.5 sm:w-16"
                        />
                    </div>

                    <SheetHeader
                        class="mb-4 space-y-1 p-0 text-center sm:mb-8 sm:text-left"
                    >
                        <SheetTitle
                            class="font-display text-lg font-bold text-foreground sm:text-xl"
                        >
                            Profil Peserta
                        </SheetTitle>
                        <SheetDescription class="text-sm text-muted-foreground">
                            Informasi lengkap data diri sasaran posyandu dan
                            riwayat kepesertaan.
                        </SheetDescription>
                    </SheetHeader>

                    <div
                        class="mb-4 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-4"
                    >
                        <!-- Identitas Peserta -->
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
                                            categories,
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
                                    :value="
                                        props.participant.nik_masked ||
                                        'Tanpa NIK'
                                    "
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
                                    :value="
                                        formatDate(props.participant.birth_date)
                                    "
                                    :icon="Calendar"
                                    icon-class="text-cyan-500"
                                />
                            </TileGroup>
                        </div>

                        <!-- Kontak, Domisili & Info Tambahan -->
                        <div class="space-y-1.5">
                            <TileGroup class="bg-transparent">
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
                                        props.participant.rt ||
                                        props.participant.rw
                                            ? `RT ${props.participant.rt || '-'} / RW ${props.participant.rw || '-'}`
                                            : '—'
                                    "
                                    :icon="MapPin"
                                    icon-class="text-orange-500"
                                />
                                <TileItem
                                    label="Status BPJS"
                                    :value="
                                        props.participant.has_bpjs
                                            ? 'Ya'
                                            : 'Tidak'
                                    "
                                    :icon="ShieldCheck"
                                    icon-class="text-teal-500"
                                />

                                <!-- Balita / Remaja -->
                                <TileItem
                                    v-if="
                                        props.participant.toddler
                                            ?.parent_name ||
                                        props.participant.teen?.parent_name
                                    "
                                    label="Orang Tua / Wali"
                                    :value="
                                        props.participant.toddler
                                            ?.parent_name ||
                                        props.participant.teen?.parent_name
                                    "
                                    :icon="User"
                                    icon-class="text-blue-500"
                                />

                                <!-- Ibu Hamil -->
                                <template
                                    v-if="props.participant.latest_pregnancy"
                                >
                                    <TileItem
                                        label="Nama Suami"
                                        :value="
                                            props.participant.latest_pregnancy
                                                .husband_name || '—'
                                        "
                                        :icon="User"
                                        icon-class="text-sky-500"
                                    />
                                </template>

                                <!-- Usia Dewasa / Lansia -->
                                <template v-if="props.participant.adult">
                                    <TileItem
                                        label="Pekerjaan"
                                        :value="
                                            props.participant.adult
                                                .employment_label || '—'
                                        "
                                        :icon="Briefcase"
                                        icon-class="text-amber-600"
                                    />
                                    <TileItem
                                        label="Status Pernikahan"
                                        :value="
                                            props.participant.adult
                                                .marital_status_label || '—'
                                        "
                                        :icon="Heart"
                                        icon-class="text-pink-500"
                                    />
                                </template>
                            </TileGroup>
                        </div>
                    </div>

                    <SheetFooter
                        class="flex flex-col-reverse gap-2 p-0 sm:flex-row sm:justify-end sm:gap-4"
                    >
                        <Button
                            variant="outline"
                            as-child
                            class="shadow-none"
                            size="lg"
                        >
                            <Link
                                :href="
                                    editParticipant({
                                        participant: props.participant.ulid,
                                    }).url
                                "
                            >
                                <Pencil class="size-4" />
                                <span>Ubah Data Peserta</span>
                            </Link>
                        </Button>

                        <Button as-child class="shadow-none" size="lg">
                            <Link
                                :href="
                                    createExamination({
                                        query: {
                                            participant: props.participant.ulid,
                                        },
                                    }).url
                                "
                            >
                                <HeartPulse class="size-4" />
                                <span>Input Pemeriksaan</span>
                            </Link>
                        </Button>
                    </SheetFooter>
                </div>
            </template>
        </SheetContent>
    </Sheet>
</template>
