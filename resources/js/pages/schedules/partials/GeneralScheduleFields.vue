<script setup lang="ts">
import { Building2, Hospital } from '@lucide/vue';
import { FormInput } from '@/components/ui/form';

const form = defineModel<any>('form', { required: true });
</script>

<template>
    <div class="space-y-5">
        <!-- 1. Input Judul Kegiatan -->
        <FormInput
            id="title"
            v-model="form.title"
            label="Judul / Nama Kegiatan"
            placeholder="Contoh: Posyandu Balita & Lansia Melati 03"
            :error="form.errors?.title"
        />

        <!-- 2. Pilihan Lokasi Kegiatan (2 Tempat Tetap) -->
        <div class="space-y-2">
            <label class="text-xs font-medium text-foreground/90">
                Lokasi Kegiatan
            </label>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <!-- Opsi 1: Balai Desa -->
                <div
                    class="flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all"
                    :class="
                        form.location === 'Balai Desa'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                            : 'border-border bg-card/60 hover:border-border/80 hover:bg-muted/20'
                    "
                    @click="form.location = 'Balai Desa'"
                >
                    <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                        :class="
                            form.location === 'Balai Desa'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                        "
                    >
                        <Building2 class="size-5" />
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-semibold text-foreground">
                            Balai Desa
                        </p>
                        <p class="text-[11px] text-muted-foreground">
                            Balai pertemuan utama desa
                        </p>
                    </div>
                </div>

                <!-- Opsi 2: Puskesmas Pembantu -->
                <div
                    class="flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all"
                    :class="
                        form.location === 'Puskesmas Pembantu'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                            : 'border-border bg-card/60 hover:border-border/80 hover:bg-muted/20'
                    "
                    @click="form.location = 'Puskesmas Pembantu'"
                >
                    <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                        :class="
                            form.location === 'Puskesmas Pembantu'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                        "
                    >
                        <Hospital class="size-5" />
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-semibold text-foreground">
                            Puskesmas Pembantu
                        </p>
                        <p class="text-[11px] text-muted-foreground">
                            Fasilitas kesehatan Pustu desa
                        </p>
                    </div>
                </div>
            </div>
            <span
                v-if="form.errors?.location"
                class="block text-xs font-medium text-red-500 italic"
            >
                {{ form.errors.location }}
            </span>
        </div>
    </div>
</template>
