<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    open?: boolean;
    totalCount?: number;
    search?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    totalCount: 0,
    search: '',
});

const emit = defineEmits<{
    (e: 'clearSearch'): void;
}>();

const hasResults = computed(() => props.totalCount > 0);
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-200 ease-out overflow-hidden"
        leave-active-class="transition-all duration-150 ease-in overflow-hidden"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-20 opacity-100"
        leave-from-class="max-h-20 opacity-100"
        leave-to-class="max-h-0 opacity-0"
    >
        <div
            v-show="open"
            class="flex items-center justify-between gap-3 border-t border-dashed border-border/60 pt-2.5 text-xs"
        >
            <!-- 1. Teks Hasil Pencarian & Dot Indicator -->
            <div class="flex items-center gap-2 text-muted-foreground">
                <!-- Dot Indicator Hijau (Ditemukan) / Merah (Tidak Ditemukan) -->
                <span
                    class="h-2 w-2 shrink-0 rounded-full transition-colors"
                    :class="hasResults ? 'bg-emerald-500' : 'bg-rose-500'"
                />

                <!-- Kalimat Hasil Pencarian Biasa -->
                <p v-if="hasResults" class="truncate">
                    Menampilkan
                    <span class="font-semibold text-foreground">{{ props.totalCount }}</span>
                    data untuk pencarian
                    <span class="font-medium text-foreground">"{{ props.search }}"</span>
                </p>
                <p v-else class="truncate text-rose-500/90 dark:text-rose-400">
                    Tidak ditemukan data untuk pencarian
                    <span class="font-medium text-foreground">"{{ props.search }}"</span>
                </p>
            </div>

            <div class="shrink-0">
                <button
                    type="button"
                    class="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                    @click="emit('clearSearch')"
                >
                    Hapus pencarian
                </button>
            </div>
        </div>
    </Transition>
</template>