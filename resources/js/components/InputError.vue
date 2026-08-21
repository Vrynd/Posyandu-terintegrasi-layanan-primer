<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div v-show="message">
        <p class="text-xs text-red-600 italic dark:text-red-500">
            {{ message }}
        </p>
    </div>
</template>
