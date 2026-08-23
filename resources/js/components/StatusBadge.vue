<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';

export type BadgeColor =
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'sky'
    | 'pink'
    | 'blue'
    | 'teal'
    | 'orange'
    | 'yellow';

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
    pink: 'border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
    teal: 'border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-400',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

const badgeClass = computed(() => colorClasses[props.color]);
</script>

<template>
    <Badge variant="outline" :class="badgeClass">
        {{ text }}
    </Badge>
</template>
