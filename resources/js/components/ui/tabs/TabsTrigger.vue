<script setup lang="ts">
import type { TabsTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { TabsTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

export type TabBadgeVariant = 'default' | 'emerald' | 'rose' | 'primary' | 'secondary'

const props = withDefaults(
  defineProps<
    TabsTriggerProps & {
      class?: HTMLAttributes["class"]
      count?: number | string
      badgeVariant?: TabBadgeVariant
    }
  >(),
  {
    badgeVariant: "default",
  },
)

const delegatedProps = reactiveOmit(props, "class", "count", "badgeVariant")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        'group/trigger inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-2xs dark:data-[state=active]:bg-zinc-800',
        props.class,
      )
    "
  >
    <slot />

    <!-- Optional Built-in Pill Counter Badge -->
    <span
      v-if="props.count !== undefined"
      data-slot="tabs-trigger-badge"
      :class="
        cn(
          'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors',
          'bg-muted text-muted-foreground',
          badgeVariant === 'emerald' && 'group-data-[state=active]/trigger:bg-emerald-500/15 group-data-[state=active]/trigger:text-emerald-600 dark:group-data-[state=active]/trigger:bg-emerald-500/25 dark:group-data-[state=active]/trigger:text-emerald-400',
          badgeVariant === 'rose' && 'group-data-[state=active]/trigger:bg-rose-500/15 group-data-[state=active]/trigger:text-rose-600 dark:group-data-[state=active]/trigger:bg-rose-500/25 dark:group-data-[state=active]/trigger:text-rose-400',
          badgeVariant === 'primary' && 'group-data-[state=active]/trigger:bg-primary/15 group-data-[state=active]/trigger:text-primary dark:group-data-[state=active]/trigger:bg-primary/25',
          badgeVariant === 'secondary' && 'group-data-[state=active]/trigger:bg-secondary group-data-[state=active]/trigger:text-secondary-foreground',
          badgeVariant === 'default' && 'group-data-[state=active]/trigger:bg-foreground/10 group-data-[state=active]/trigger:text-foreground',
        )
      "
    >
      {{ props.count }}
    </span>
  </TabsTrigger>
</template>
