<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="list-content"
    :class="
      cn(
        'flex flex-col divide-y divide-border/60 overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs dark:bg-zinc-900/60',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
