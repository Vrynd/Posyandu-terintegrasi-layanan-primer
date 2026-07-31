<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="tile-group"
    :class="cn('overflow-hidden rounded-xl border border-border/80 bg-muted/20 divide-y divide-border/60', props.class)"
  >
    <slot />
  </div>
</template>
