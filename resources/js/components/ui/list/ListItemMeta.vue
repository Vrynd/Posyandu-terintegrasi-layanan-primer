<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="list-item-meta"
    :class="cn('flex items-center gap-2 text-xs text-muted-foreground', props.class)"
  >
    <slot />
  </div>
</template>
