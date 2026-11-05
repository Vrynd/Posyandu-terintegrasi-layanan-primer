<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3';
import {
    CloudUploadIcon,
    DocumentTextIcon,
    DownloadSquareIcon,
    FileSpreadsheetIcon,
    InfoCircleIcon,
    ShieldCheckIcon,
} from '@solar-icons/vue/linear';
import { ref } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/routes';

setLayoutProps({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Impor Data' },
    ],
});

const isDragging = ref(false);
const selectedFile = ref<File | null>(null);

const handleDrop = (e: DragEvent) => {
    isDragging.value = false;
    const files = e.dataTransfer?.files;

    if (files && files.length > 0) {
        selectedFile.value = files[0];
    }
};

const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};

const clearFile = () => {
    selectedFile.value = null;
};

const handleProcess = () => {
    window.alert('Fitur pemrosesan data spreadsheet akan segera dihubungkan.');
};
</script>

<template>
    <Head title="Impor Data" />

    <div class="flex h-full flex-1 flex-col p-4 pt-6 pb-20 sm:p-6 sm:pt-8">
        <div
            class="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
            <Heading
                title="Impor Data Excel & Spreadsheet"
                description="Muat data sasaran warga atau hasil pemeriksaan secara massal melalui berkas lembar kerja"
            />
            <div
                class="hidden items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 sm:flex dark:bg-emerald-950/40 dark:text-emerald-300"
            >
                <FileSpreadsheetIcon class="size-4" />
                <span>Format .xlsx, .xls, .csv</span>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <!-- Kolom Kiri: Area Unggah Berkas (8 Kolom) -->
            <div class="flex flex-col gap-4 lg:col-span-8">
                <!-- Dropzone Card -->
                <Card
                    class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200"
                    :class="[
                        isDragging
                            ? 'scale-[0.99] border-primary bg-primary/5'
                            : 'border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30',
                    ]"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                >
                    <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        class="sr-only"
                        @change="handleFileInput"
                    />

                    <!-- State 1: Belum Memilih Berkas -->
                    <template v-if="!selectedFile">
                        <div
                            class="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs"
                        >
                            <CloudUploadIcon class="size-7" />
                        </div>
                        <h3
                            class="mt-4 text-base font-semibold text-foreground"
                        >
                            Tarik & Lepaskan berkas Spreadsheet di sini
                        </h3>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Mendukung file Excel (.xlsx, .xls) atau CSV hingga
                            maksimal 10MB
                        </p>
                        <label
                            for="file-upload"
                            class="mt-5 inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                        >
                            Pilih Berkas dari Komputer
                        </label>
                    </template>

                    <!-- State 2: Berkas Telah Dipilih -->
                    <template v-else>
                        <div
                            class="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600"
                        >
                            <FileSpreadsheetIcon class="size-7" />
                        </div>
                        <h3
                            class="mt-4 text-base font-semibold text-foreground"
                        >
                            {{ selectedFile.name }}
                        </h3>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Ukuran berkas:
                            {{ (selectedFile.size / 1024).toFixed(1) }} KB
                        </p>
                        <div class="mt-5 flex items-center gap-2">
                            <Button
                                class="h-9 rounded-xl px-4 text-xs font-medium shadow-xs"
                                @click="handleProcess"
                            >
                                <CloudUploadIcon class="mr-1.5 size-4" />
                                Proses & Impor Sekarang
                            </Button>
                            <Button
                                variant="outline"
                                class="h-9 rounded-xl px-3 text-xs"
                                @click="clearFile"
                            >
                                Ganti Berkas
                            </Button>
                        </div>
                    </template>
                </Card>

                <!-- Informasi Validasi & Keamanan Data -->
                <div
                    class="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground"
                >
                    <ShieldCheckIcon
                        class="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <div>
                        <span class="font-semibold text-foreground"
                            >Validasi Data Otomatis:</span
                        >
                        Sistem akan memeriksa kelengkapan NIK, penomoran KK, dan
                        format tanggal sebelum data disimpan ke dalam basis data
                        posyandu.
                    </div>
                </div>
            </div>

            <!-- Kolom Kanan: Unduh Template & Panduan (4 Kolom) -->
            <div class="flex flex-col gap-4 lg:col-span-4">
                <!-- Card Unduh Template -->
                <Card class="rounded-2xl border border-border/80 bg-card p-5">
                    <div
                        class="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                        <DownloadSquareIcon class="size-4.5 text-primary" />
                        <span>Unduh Format Template</span>
                    </div>
                    <p class="mt-1 text-xs text-muted-foreground">
                        Gunakan berkas acuan resmi agar struktur kolom sesuai
                        dengan sistem:
                    </p>

                    <div class="mt-4 flex flex-col gap-2.5">
                        <div
                            class="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3 text-xs transition-colors hover:bg-muted/50"
                        >
                            <div class="flex items-center gap-2.5">
                                <DocumentTextIcon
                                    class="size-4 text-emerald-600"
                                />
                                <div>
                                    <p class="font-medium text-foreground">
                                        Template Data Sasaran
                                    </p>
                                    <p
                                        class="text-[11px] text-muted-foreground"
                                    >
                                        Format kependudukan & sasaran
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                class="h-7 text-xs font-semibold text-primary"
                            >
                                .XLSX
                            </Button>
                        </div>

                        <div
                            class="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3 text-xs transition-colors hover:bg-muted/50"
                        >
                            <div class="flex items-center gap-2.5">
                                <FileSpreadsheetIcon
                                    class="size-4 text-blue-600"
                                />
                                <div>
                                    <p class="font-medium text-foreground">
                                        Template Pemeriksaan
                                    </p>
                                    <p
                                        class="text-[11px] text-muted-foreground"
                                    >
                                        Format antropometri & fisik
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                class="h-7 text-xs font-semibold text-primary"
                            >
                                .XLSX
                            </Button>
                        </div>
                    </div>
                </Card>

                <!-- Card Langkah Pengisian -->
                <Card class="rounded-2xl border border-border/80 bg-card p-5">
                    <div
                        class="flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                        <InfoCircleIcon class="size-4.5 text-primary" />
                        <span>Petunjuk 3 Langkah</span>
                    </div>
                    <ol class="mt-3 space-y-2.5 text-xs text-muted-foreground">
                        <li class="flex gap-2">
                            <span
                                class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary"
                                >1</span
                            >
                            <span
                                >Unduh salah satu berkas template Excel di
                                atas.</span
                            >
                        </li>
                        <li class="flex gap-2">
                            <span
                                class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary"
                                >2</span
                            >
                            <span
                                >Isi baris data warga tanpa mengubah susunan
                                baris judul (*header*).</span
                            >
                        </li>
                        <li class="flex gap-2">
                            <span
                                class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary"
                                >3</span
                            >
                            <span
                                >Unggah berkas yang telah diisi ke kotak
                                dropzone di samping.</span
                            >
                        </li>
                    </ol>
                </Card>
            </div>
        </div>
    </div>
</template>
