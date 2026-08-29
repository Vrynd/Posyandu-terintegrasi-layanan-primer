<script setup lang="ts">
import { Building2, Hospital, MapPin } from '@lucide/vue';
import { computed } from 'vue';
import { FormInput } from '@/components/ui/form';
import type { LocationOption } from '@/types';

const props = withDefaults(
    defineProps<{
        locations?: LocationOption[];
    }>(),
    {
        locations: () => [],
    },
);

const form = defineModel<any>('form', { required: true });

// Tanggal hari ini dalam format YYYY-MM-DD lokal
const todayDate = computed(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
});

// Pemetaan string icon dari backend Enum ke komponen ikon Lucide
const iconMap: Record<string, any> = {
    Building2,
    Hospital,
    MapPin,
};
</script>

<template>
    <div class="space-y-5">
        <!-- 1. Nama Kegiatan -->
        <FormInput
            id="title"
            v-model="form.title"
            label="Nama Kegiatan"
            placeholder="Contoh: Posyandu Balita & Lansia Melati 03"
            :error="form.errors?.title"
        />

        <!-- 2. Tanggal Mulai dan Selesai (Dibatasi Minimal Hari Ini) -->
        <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormInput
                id="start_date"
                v-model="form.start_date"
                type="date"
                label="Tanggal Mulai"
                :min="todayDate"
                :error="form.errors?.start_date"
            />
            <FormInput
                id="end_date"
                v-model="form.end_date"
                type="date"
                label="Tanggal Selesai (Opsional)"
                :min="form.start_date || todayDate"
                :error="form.errors?.end_date"
            />
        </div>

        <!-- 3. Waktu Mulai dan Selesai (Sejajar Berdampingan) -->
        <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormInput
                id="start_time"
                v-model="form.start_time"
                type="time"
                label="Waktu Mulai (WIB)"
                :error="form.errors?.start_time"
            />
            <FormInput
                id="end_time"
                v-model="form.end_time"
                type="time"
                label="Waktu Selesai (WIB)"
                :error="form.errors?.end_time"
            />
        </div>

        <!-- 4. Pilihan Lokasi Kegiatan (3 Kartu Sejajar Berdampingan) -->
        <div class="space-y-2.5">
            <label class="block text-xs font-medium text-foreground/90">
                Lokasi Kegiatan
            </label>
            <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                    v-for="loc in props.locations"
                    :key="loc.value"
                    type="button"
                    class="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card/60 p-3 text-left transition-all hover:border-border/80 hover:bg-muted/20"
                    :class="{
                        'border-primary bg-primary/5 ring-1 ring-primary/40':
                            form.location === loc.value,
                    }"
                    @click="form.location = loc.value"
                >
                    <!-- Box Ikon -->
                    <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors"
                        :class="{
                            'bg-primary text-primary-foreground':
                                form.location === loc.value,
                        }"
                    >
                        <component
                            :is="iconMap[loc.icon || ''] || MapPin"
                            class="size-5"
                        />
                    </div>

                    <!-- Label & Deskripsi Dinamis -->
                    <div class="min-w-0 flex-1">
                        <p
                            class="truncate text-xs font-semibold text-foreground"
                        >
                            {{ loc.label }}
                        </p>
                        <p class="truncate text-[11px] text-muted-foreground">
                            {{ loc.description }}
                        </p>
                    </div>
                </button>
            </div>

            <!-- 5. Input Lokasi Lainnya (Kustom) jika memilih 'other' -->
            <div v-if="form.location === 'other'" class="pt-1">
                <FormInput
                    id="custom_location"
                    v-model="form.custom_location"
                    label="Nama / Alamat Lokasi Khusus"
                    placeholder="Contoh: Rumah Bu Kadus Melati RW 03 / Balai RW 02..."
                    :error="form.errors?.custom_location"
                />
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
