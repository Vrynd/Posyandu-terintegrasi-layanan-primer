<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="list-item"
    :class="
      cn(
        'flex items-center justify-between p-3.5 transition-colors hover:bg-muted/40 sm:p-4 cursor-pointer',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
