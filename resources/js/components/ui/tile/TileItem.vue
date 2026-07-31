<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="tile-item"
    :class="cn('flex items-center justify-between p-3 text-xs sm:px-4 sm:py-3 sm:text-sm', props.class)"
  >
    <slot />
  </div>
</template>
