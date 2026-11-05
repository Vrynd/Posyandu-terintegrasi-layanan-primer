<script setup lang="ts">
type Props = {
    showName?: boolean;
};

withDefaults(defineProps<Props>(), {
    showName: true,
});
</script>

<template>
    <div class="flex items-center gap-2.5">
        <img
            src="/images/logo.png"
            alt="Logo Posyandu"
            class="size-8.5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
        />
        <div v-if="showName" class="flex flex-col text-left">
            <span
                class="font-display text-base font-bold tracking-tight text-foreground"
            >
                Posyandu Tondomulyo
            </span>
        </div>
    </div>
</template>
