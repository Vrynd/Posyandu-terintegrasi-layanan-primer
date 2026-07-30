<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';

export type BadgeColor = 'emerald' | 'amber' | 'rose' | 'indigo' | 'sky';

interface Props {
    text: string;
    color: BadgeColor;
}
const props = defineProps<Props>();

const colorClasses: Record<BadgeColor, string> = {
    emerald:
        'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
};

const badgeClass = computed(() => colorClasses[props.color]);
</script>

<template>
    <Badge variant="outline" :class="badgeClass">
        {{ text }}
    </Badge>
</template>
