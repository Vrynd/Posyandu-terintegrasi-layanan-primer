<script setup lang="ts">
import { Download, FileText } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { TileGroup, TileItem } from '@/components/ui/tile';

export interface ReportItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'pending';
    statusLabel: string;
    createdAt?: string;
}

interface Props {
    reports: ReportItem[];
    loadingId?: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
    (e: 'download', report: ReportItem): void;
    (e: 'generate', report: ReportItem): void;
}>();
</script>

<template>
    <div class="grid grid-cols-1 gap-3.5 sm:gap-4">
        <Card
            v-for="item in reports"
            :key="item.id"
            class="gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-none sm:p-5"
        >
            <!-- 1. Header Kartu: Judul & Deskripsi -->
            <CardHeader class="gap-1 p-0">
                <CardTitle
                    class="text-sm font-semibold text-foreground sm:text-base"
                >
                    {{ item.title }}
                </CardTitle>
                <CardDescription
                    class="line-clamp-2 text-xs text-muted-foreground"
                >
                    {{ item.description }}
                </CardDescription>
            </CardHeader>

            <!-- 2. Konten Kartu: Status & Tanggal Pembuatan -->
            <CardContent class="p-0">
                <TileGroup class="divide-y-0 border-border/50 bg-muted/30">
                    <TileItem
                        label="Status"
                        class="relative after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-border/40 sm:after:left-10.5 [&>span]:font-normal"
                    >
                        <span
                            :class="
                                item.status === 'completed'
                                    ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                    : 'font-medium text-amber-600 dark:text-amber-400'
                            "
                        >
                            {{ item.statusLabel }}
                        </span>
                    </TileItem>
                    <TileItem
                        label="Tanggal Dibuat"
                        :value="item.createdAt ?? '-'"
                        class="[&>span]:font-normal"
                    />
                </TileGroup>
            </CardContent>

            <!-- 3. Footer Kartu: Tombol Aksi Mandiri per Kartu -->
            <CardFooter class="flex justify-end p-0">
                <!-- Jika Selesai: Tampilkan Tombol Unduh -->
                <Button
                    v-if="item.status === 'completed'"
                    type="button"
                    size="sm"
                    class="w-fit cursor-pointer shadow-none"
                    @click="emit('download', item)"
                >
                    <Download class="size-3.5" />
                    <span>Unduh Laporan</span>
                </Button>

                <!-- Jika Belum Dibuat: Tampilkan Tombol Buat Laporan -->
                <Button
                    v-else
                    type="button"
                    size="sm"
                    :disabled="loadingId === item.id"
                    class="w-fit cursor-pointer border border-amber-500/30 bg-amber-500/10 text-amber-700 shadow-none hover:bg-amber-500/20 active:scale-[0.98] dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
                    @click="emit('generate', item)"
                >
                    <FileText class="size-3.5" />
                    <span>{{
                        loadingId === item.id ? 'Membuat...' : 'Buat Laporan'
                    }}</span>
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>
