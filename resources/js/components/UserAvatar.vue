<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import { cn } from '@/lib/utils';

// Pilihan ukuran avatar
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
    name: string;
    avatar?: string | null;
    size?: AvatarSize;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    avatar: null,
    size: 'md',
    class: '',
});

// Peta ukuran Tailwind untuk avatar & font inisial
const sizeClasses: Record<AvatarSize, string> = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
    xl: 'h-12 w-12 text-base',
};

const { getInitials } = useInitials();
const showAvatar = computed(() => !!props.avatar);
</script>

<template>
    <Avatar
        :class="
            cn(
                'shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted font-semibold text-muted-foreground',
                sizeClasses[props.size],
                props.class,
            )
        "
    >
        <AvatarImage v-if="showAvatar" :src="avatar!" :alt="name" />
        <AvatarFallback
            class="rounded-full bg-transparent font-semibold text-muted-foreground"
        >
            {{ getInitials(name) }}
        </AvatarFallback>
    </Avatar>
</template>
