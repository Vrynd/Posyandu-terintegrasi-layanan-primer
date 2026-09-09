<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div v-if="message">
        <p class="text-xs text-destructive italic">
            {{ message }}
        </p>
    </div>
</template>
