<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  label?: string
  value?: string | number | boolean | null
  icon?: Component
  iconClass?: string
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    data-slot="tile-item"
    :class="cn('flex items-center justify-between p-3 text-xs sm:px-4 sm:py-3', props.class)"
  >
    <span class="flex items-center gap-2 text-foreground">
      <slot name="icon">
        <component
          :is="props.icon"
          v-if="props.icon"
          :class="cn('h-4 w-4', props.iconClass)"
        />
      </slot>
      <slot name="label">
        {{ props.label }}
      </slot>
    </span>

    <div class="font-medium text-muted-foreground">
      <slot>
        {{ props.value }}
      </slot>
    </div>
  </div>
</template>
