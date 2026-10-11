<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Calendar, Stethoscope } from '@lucide/vue';
import { AltArrowLeftIcon, AltArrowRightIcon } from '@solar-icons/vue/linear';
import { useMediaQuery } from '@vueuse/core';
import { computed, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/composables/useInitials';
import { useScroll } from '@/composables/useScroll';
import * as participants from '@/routes/participants';
import type { FollowUpItem } from '@/types';

const props = defineProps<{
    items?: FollowUpItem[];
}>();

const container = ref<HTMLElement | null>(null);
const { getInitials } = useInitials();

const {
    containerWidth,
    scrollOffset,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
} = useScroll(container, { gap: () => cardGap.value });

const isMobile = useMediaQuery('(max-width: 639px)');

const cardGap = computed(() => (isMobile.value ? 12 : 16));
const cardColumns = computed(() => (isMobile.value ? 1 : 3));

const currentItems = computed(() => props.items ?? []);

const remainingCount = computed(() => {
    const total = currentItems.value.length;
    const visible = cardColumns.value;

    if (total <= visible) {
        return 0;
    }

    if (!canScrollRight.value && scrollOffset.value > 0) {
        return 0;
    }

    if (containerWidth.value <= 0) {
        return Math.max(total - visible, 0);
    }

    const stepPerCard = (containerWidth.value + cardGap.value) / visible;
    const scrolledCards =
        stepPerCard > 0 ? Math.round(scrollOffset.value / stepPerCard) : 0;

    return Math.max(total - visible - scrolledCards, 0);
});

function getPrimaryIssue(issues: string[]): string {
    return issues[0] ?? 'Rujukan Puskesmas';
}

function goToParticipant(item: FollowUpItem): void {
    if (!item.ulid) {
        return;
    }

    router.visit(participants.show({ participant: item.ulid }).url);
}
</script>

<template>
    <Card
        class="flex min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0"
    >
        <!-- 1. Header Kartu & Navigasi Geser -->
        <CardHeader
            class="flex flex-row items-center justify-between gap-4 border-dashed p-4 sm:p-5"
        >
            <div class="flex items-center gap-2.5">
                <span class="h-5 w-2 shrink-0 rounded-full bg-accent" />
                <CardTitle class="text-base text-foreground/90">
                    Daftar Tindak Lanjut
                </CardTitle>
            </div>

            <div class="flex items-center gap-1">
                <!-- Indikator Jumlah Kartu Lainnya (+N) -->
                <span
                    v-if="currentItems.length > cardColumns"
                    class="inline-flex size-7 items-center justify-center rounded-full border border-input bg-background text-xs font-medium tabular-nums transition-opacity select-none"
                    :class="
                        remainingCount > 0
                            ? 'text-muted-foreground'
                            : 'pointer-events-none opacity-50'
                    "
                    :title="
                        remainingCount > 0
                            ? `${remainingCount} peserta tindak lanjut lainnya`
                            : 'Semua kartu sudah ditampilkan'
                    "
                >
                    +{{ remainingCount }}
                </span>

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    class="size-7 rounded-full shadow-none"
                    :disabled="!canScrollLeft"
                    title="Sebelumnya"
                    @click="scrollPrev"
                >
                    <AltArrowLeftIcon class="size-4 text-muted-foreground" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    class="size-7 rounded-full shadow-none"
                    :disabled="!canScrollRight"
                    title="Berikutnya"
                    @click="scrollNext"
                >
                    <AltArrowRightIcon class="size-4 text-muted-foreground" />
                </Button>
            </div>
        </CardHeader>

        <!-- 2. Konten Daftar Kartu Tindak Lanjut (Horizontal Carousel) -->
        <CardContent class="px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
            <div
                v-if="currentItems.length > 0"
                ref="container"
                class="no-scrollbar flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth sm:gap-4"
            >
                <div
                    v-for="item in currentItems"
                    :key="item.id"
                    class="group flex w-full shrink-0 snap-start flex-col rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-border sm:w-[calc((100%-32px)/3)]"
                    :class="item.ulid && 'cursor-pointer'"
                    @click="goToParticipant(item)"
                >
                    <!-- Identitas Peserta & Masalah Kesehatan Utama -->
                    <div class="flex items-center gap-3">
                        <Avatar class="size-11 border-2 border-border p-0.5">
                            <AvatarFallback
                                class="text-xs font-semibold text-foreground/80"
                            >
                                {{ getInitials(item.name) }}
                            </AvatarFallback>
                        </Avatar>

                        <div class="min-w-0 flex-1">
                            <h4
                                class="truncate text-sm font-semibold text-foreground"
                            >
                                {{ item.name }}
                            </h4>
                            <p
                                class="mt-0.5 truncate text-xs text-muted-foreground"
                            >
                                {{ getPrimaryIssue(item.issues) }}
                            </p>
                        </div>
                    </div>

                    <!-- Garis Pemisah Putus-putus -->
                    <div
                        class="my-3.5 border-t border-dashed border-border/80"
                    />

                    <!-- Informasi Waktu, Lokasi, & Petugas Pemberi Rujukan -->
                    <div class="flex flex-col gap-2">
                        <div
                            class="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                            <Calendar class="size-3.5 shrink-0 text-accent" />
                            <span class="truncate">
                                {{ item.examinationDate }} • {{ item.location }}
                            </span>
                        </div>

                        <div
                            class="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                            <Stethoscope
                                class="size-3.5 shrink-0 text-accent"
                            />
                            <span class="truncate">
                                {{ item.examinerName }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kondisi Kosong (Belum Ada Daftar Tindak Lanjut) -->
            <EmptyState
                v-else
                :icon="Stethoscope"
                title="Belum ada tindak lanjut"
                description="Belum ada peserta yang memerlukan rujukan ke Puskesmas."
            />
        </CardContent>
    </Card>
</template>
