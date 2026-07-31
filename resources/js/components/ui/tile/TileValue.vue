<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="tile-value"
    :class="cn('font-medium text-foreground text-xs', props.class)"
  >
    <slot />
  </div>
</template>
