<script setup lang="ts">
import { Building2, Hospital, MapPin } from '@lucide/vue';
import { FormInput } from '@/components/ui/form';

export interface LocationOption {
    value: string;
    label: string;
    description: string;
    icon?: string;
}

const props = withDefaults(
    defineProps<{
        locations?: LocationOption[];
    }>(),
    {
        locations: () => [],
    },
);

const form = defineModel<any>('form', { required: true });

// Pemetaan string icon dari backend Enum ke komponen ikon Lucide
const iconMap: Record<string, any> = {
    Building2,
    Hospital,
};
</script>

<template>
    <div class="space-y-5">
        <!-- 1. Input Judul Kegiatan -->
        <FormInput
            id="title"
            v-model="form.title"
            label="Nama Kegiatan"
            placeholder="Contoh: Posyandu Balita & Lansia Melati 03"
            :error="form.errors?.title"
        />

        <!-- 2. Pilihan Lokasi Kegiatan -->
        <div class="space-y-2.5">
            <label class="block text-xs font-medium text-foreground/90">
                Lokasi Kegiatan
            </label>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    v-for="loc in props.locations"
                    :key="loc.value"
                    type="button"
                    class="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-left transition-all hover:border-border/80 hover:bg-muted/20"
                    :class="{
                        'border-primary bg-primary/5 ring-1 ring-primary/40':
                            form.location === loc.value,
                    }"
                    @click="form.location = loc.value"
                >
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

                    <!-- Label & Deskripsi Dinamis dari Enum -->
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
            <span
                v-if="form.errors?.location"
                class="block text-xs font-medium text-red-500 italic"
            >
                {{ form.errors.location }}
            </span>
        </div>
    </div>
</template>
