<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type Props = {
    breadcrumbs: BreadcrumbItemType[];
};

defineProps<Props>();
</script>

<template>
    <Breadcrumb class="max-w-full min-w-0">
        <BreadcrumbList>
            <template v-for="(item, index) in breadcrumbs" :key="index">
                <BreadcrumbItem
                    :class="
                        index === breadcrumbs.length - 1
                            ? 'min-w-0 flex-1 overflow-hidden'
                            : 'shrink-0'
                    "
                >
                    <template v-if="index === breadcrumbs.length - 1">
                        <BreadcrumbPage
                            class="block max-w-full truncate"
                            :title="item.title"
                        >
                            {{ item.title }}
                        </BreadcrumbPage>
                    </template>
                    <template v-else>
                        <BreadcrumbLink
                            as-child
                            class="shrink-0 whitespace-nowrap"
                        >
                            <Link :href="item.href">{{ item.title }}</Link>
                        </BreadcrumbLink>
                    </template>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                    v-if="index !== breadcrumbs.length - 1"
                    class="shrink-0"
                />
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
