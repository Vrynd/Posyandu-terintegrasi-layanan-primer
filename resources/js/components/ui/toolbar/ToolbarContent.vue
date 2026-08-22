<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    open?: boolean;
    totalCount?: number;
    search?: string;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    totalCount: 0,
    search: '',
});

const emit = defineEmits<{
    (e: 'reset'): void;
}>();

const hasSearch = computed(() => Boolean(props.search?.trim()));
const searchStatus = computed(() => {
    if (hasSearch.value && props.totalCount === 0) {
        return 'not_found';
    }
    if (hasSearch.value && props.totalCount > 0) {
        return 'found';
    }
    if (!hasSearch.value && props.totalCount === 0) {
        return 'empty';
    }
    return 'idle';
});
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
            class="flex items-center justify-between gap-3 text-xs"
        >
            <!-- Sisi Kiri: Dot Indicator & Kalimat Hasil Pencarian -->
            <div class="flex items-center gap-2">
                <!-- 1. Kondisi Data Ditemukan (Search aktif & total > 0) -->
                <template v-if="searchStatus === 'found'">
                    <span
                        class="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"
                    />
                    <span class="text-muted-foreground">
                        Dari kata kunci
                        <span class="font-medium text-foreground">
                            '{{ props.search }}'
                        </span>
                        ditemukan
                        <span class="font-semibold text-foreground">
                            {{ props.totalCount }}
                        </span>
                        data
                    </span>
                </template>

                <!-- 2. Kondisi Data Tidak Ditemukan (Search aktif & total == 0) -->
                <template v-else-if="searchStatus === 'not_found'">
                    <span
                        class="h-2 w-2 shrink-0 rounded-full bg-rose-500 ring-2 ring-rose-500/20"
                    />
                    <span class="text-rose-500 dark:text-rose-400">
                        Dari kata kunci
                        <span
                            class="font-medium text-rose-500 dark:text-rose-400"
                        >
                            '{{ props.search }}'
                        </span>
                        tidak ada data yang ditemukan
                    </span>
                </template>

                <!-- 3. Kondisi Data Belum Tersedia (Database kosong) -->
                <template v-else-if="searchStatus === 'empty'">
                    <span
                        class="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40"
                    />
                    <span class="italic text-muted-foreground">
                        Data belum tersedia
                    </span>
                </template>

                <!-- 4. Kondisi Idle (Default tanpa pencarian) -->
                <template v-else>
                    <span
                        class="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40"
                    />
                    <span class="text-muted-foreground">
                        Tidak ada pencarian aktif
                    </span>
                </template>

                <slot />
            </div>

            <!-- Sisi Kanan: Tombol Reset Text Underline -->
            <div v-if="hasSearch" class="shrink-0">
                <button
                    type="button"
                    class="cursor-pointer text-xs text-muted-foreground hover:underline underline-offset-4 transition-colors hover:text-accent"
                    @click="emit('reset')"
                >
                    Bersihkan Pencarian
                </button>
            </div>
        </div>
    </Transition>
</template>
