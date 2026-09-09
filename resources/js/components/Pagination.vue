<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
    currentCount: number;
    total: number;
    lastPage: number;
}

const props = defineProps<Props>();

const isNavLabel = (label: string) => {
    const cleanLabel = label.replace(/<[^>]*>/g, '').trim();

    return (
        cleanLabel.toLowerCase().includes('prev') ||
        cleanLabel.toLowerCase().includes('next') ||
        cleanLabel.includes('«') ||
        cleanLabel.includes('»') ||
        cleanLabel.includes('&laquo;') ||
        cleanLabel.includes('&raquo;')
    );
};

const formatLabel = (label: string) => {
    const clean = label
        .replace(/<[^>]*>/g, '')
        .trim()
        .toLowerCase();

    if (
        clean.includes('prev') ||
        label.includes('«') ||
        label.includes('&laquo;')
    ) {
        return 'Sebelumnya';
    }

    if (
        clean.includes('next') ||
        label.includes('»') ||
        label.includes('&raquo;')
    ) {
        return 'Berikutnya';
    }

    return label;
};
</script>

<template>
    <Card
        v-if="props.links && props.lastPage > 1"
        class="gap-0 overflow-hidden rounded-xl border border-card bg-card/80 py-0 shadow-none backdrop-blur-xs dark:border-border"
    >
        <CardContent
            class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
            <Badge
                variant="outline"
                class="hidden w-fit rounded-full border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex"
            >
                Menampilkan
                <span class="mx-1 font-semibold text-accent">{{
                    props.currentCount
                }}</span>
                dari
                <span class="mx-1 font-semibold text-accent">{{
                    props.total
                }}</span>
                total data
            </Badge>

            <div
                class="flex w-full items-center justify-between gap-1.5 sm:w-auto"
            >
                <template v-for="(link, index) in props.links" :key="index">
                    <Button
                        v-if="link.url"
                        as-child
                        variant="outline"
                        size="sm"
                        :class="[
                            isNavLabel(link.label)
                                ? 'flex-1 sm:flex-none'
                                : 'w-8 px-0 font-mono text-xs',
                            link.active && 'font-bold text-accent',
                        ]"
                    >
                        <Link :href="link.url" preserve-scroll>
                            <span v-html="formatLabel(link.label)" />
                        </Link>
                    </Button>
                    <!-- 2. Tombol Disabled (Prev/Next di ujung atau ...) -->
                    <Button
                        v-else
                        disabled
                        variant="outline"
                        size="sm"
                        :class="
                            isNavLabel(link.label)
                                ? 'flex-1 sm:flex-none'
                                : 'w-8 px-0 font-mono text-xs'
                        "
                    >
                        <span v-html="formatLabel(link.label)" />
                    </Button>
                </template>
            </div>
        </CardContent>
    </Card>
</template>
