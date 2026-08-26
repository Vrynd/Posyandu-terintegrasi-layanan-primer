<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="list"
    :class="cn('flex flex-1 flex-col gap-3', props.class)"
  >
    <slot />
  </div>
</template>
