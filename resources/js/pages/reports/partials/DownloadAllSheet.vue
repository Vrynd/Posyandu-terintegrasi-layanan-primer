<script setup lang="ts">
import { Download } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

const open = defineModel<boolean>('open', { default: false });

const now = new Date();
const currentMonth = String(now.getMonth() + 1);
const currentYear = String(now.getFullYear());

const selectedMonth = ref<string>(currentMonth);
const selectedYear = ref<string>(currentYear);

// 12 Pilihan Bulan Bahasa Indonesia
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(
        new Date(2026, i, 1),
    ),
    value: String(i + 1),
}));

// Pilihan Tahun (Tahun berjalan & 2 tahun sebelumnya)
const yearOptions = computed(() => [
    { label: currentYear, value: currentYear },
    {
        label: String(Number(currentYear) - 1),
        value: String(Number(currentYear) - 1),
    },
    {
        label: String(Number(currentYear) - 2),
        value: String(Number(currentYear) - 2),
    },
]);

const startDownload = () => {
    console.log('Unduh 4 laporan untuk periode:', {
        month: selectedMonth.value,
        year: selectedYear.value,
    });
    open.value = false;
};
</script>

<template>
    <Sheet v-model:open="open">
        <SheetContent
            side="bottom"
            class="mx-auto max-w-lg gap-5 rounded-t-3xl border-t border-border bg-card p-5 text-card-foreground sm:rounded-2xl sm:border sm:p-6"
        >
            <SheetHeader class="gap-1.5 p-0 text-left">
                <SheetTitle
                    class="font-display text-lg leading-none text-foreground"
                >
                    Unduh Semua Laporan
                </SheetTitle>
                <SheetDescription class="text-xs text-muted-foreground">
                    Pilih periode bulan dan tahun laporan yang ingin diunduh
                    secara bersamaan.
                </SheetDescription>
            </SheetHeader>

            <!-- Form Filter Periode Bulan dan Tahun -->
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <!-- Pilihan Bulan -->
                <div class="flex flex-col gap-2">
                    <Label class="text-xs font-medium text-foreground/90">
                        Periode Bulan
                    </Label>
                    <Select v-model="selectedMonth">
                        <SelectTrigger class="w-full shadow-none">
                            <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="opt in monthOptions"
                                :key="opt.value"
                                :value="opt.value"
                            >
                                {{ opt.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Pilihan Tahun -->
                <div class="flex flex-col gap-2">
                    <Label class="text-xs font-medium text-foreground/90">
                        Tahun
                    </Label>
                    <Select v-model="selectedYear">
                        <SelectTrigger class="w-full shadow-none">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="opt in yearOptions"
                                :key="opt.value"
                                :value="opt.value"
                            >
                                {{ opt.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <!-- Footer Sheet: Tombol Batal & Unduh -->
            <SheetFooter
                class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
            >
                <Button
                    size="lg"
                    type="button"
                    variant="outline"
                    class="w-full sm:w-auto"
                    @click="open = false"
                >
                    Batal
                </Button>
                <Button
                    size="lg"
                    type="button"
                    class="w-full sm:w-auto"
                    @click="startDownload"
                >
                    <Download class="size-4" />
                    <span>Mulai Unduh</span>
                </Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
