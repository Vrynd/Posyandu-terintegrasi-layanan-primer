<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { Search, X } from '@lucide/vue';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        placeholder?: string;
        class?: HTMLAttributes['class'];
    }>(),
    {
        placeholder: 'Cari data...',
    },
);

const search = defineModel<string>({ default: '' });
const hasSearch = computed(() => Boolean(search.value?.trim()));
</script>

<template>
    <div :class="cn('relative min-w-0 flex-1 w-full', props.class)">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            v-model="search"
            :placeholder="props.placeholder"
            class="h-9 w-full pl-9 pr-8 text-sm"
        />
        <button
            v-if="hasSearch"
            type="button"
            class="absolute right-2.5 top-2.5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            title="Hapus pencarian"
            @click="search = ''"
        >
            <X class="h-4 w-4" />
        </button>
    </div>
</template>
