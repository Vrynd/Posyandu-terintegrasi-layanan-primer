<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  label?: string
  value?: string | number | null
  icon?: Component
  iconClass?: string
  isMono?: boolean
  class?: HTMLAttributes["class"]
}>()

const hasValue = () =>
  props.value !== undefined && props.value !== null && props.value !== ""
</script>

<template>
  <div
    data-slot="tile-item"
    :class="cn('flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors hover:bg-muted/30', props.class)"
  >
    <!-- Sisi Kiri: Ikon & Label Deskriptor -->
    <span class="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-muted-foreground shrink-0">
      <slot name="icon">
        <component
          :is="props.icon"
          v-if="props.icon"
          :class="cn('size-4 shrink-0 text-muted-foreground/80', props.iconClass)"
        />
      </slot>
      <slot name="label">
        {{ props.label }}
      </slot>
    </span>

    <!-- Sisi Kanan: Nilai Data Inti Peserta -->
    <div
      v-if="$slots.default || hasValue()"
      :class="cn(
        'text-right text-[13px] font-medium text-foreground min-w-0 wrap-break-word',
        props.isMono && 'font-display text-xs sm:text-[13px] tracking-tight text-foreground'
      )"
    >
      <slot>
        {{ props.value }}
      </slot>
    </div>
  </div>
</template>