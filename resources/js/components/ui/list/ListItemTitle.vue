<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <h4
    data-slot="list-item-title"
    :class="cn('truncate text-sm font-semibold text-foreground', props.class)"
  >
    <slot />
  </h4>
</template>
