<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="list-header"
    :class="
      cn(
        'flex items-center justify-between rounded-xl border border-border/80 bg-card p-3 shadow-2xs dark:bg-zinc-900/60',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
