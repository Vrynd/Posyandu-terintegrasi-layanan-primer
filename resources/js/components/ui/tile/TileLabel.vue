<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    data-slot="tile-label"
    :class="cn('flex items-center gap-2 text-muted-foreground text-xs', props.class)"
  >
    <slot />
  </span>
</template>
