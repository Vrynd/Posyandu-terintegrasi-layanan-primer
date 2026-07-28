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
</script>

<template>
    <Card
        v-if="props.links && props.lastPage > 1"
        class="mt-4 gap-0 overflow-hidden border-border/60 bg-card/80 py-0 shadow-xs sm:mt-5"
    >
        <CardContent
            class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
        >
            <Badge
                variant="outline"
                class="hidden w-fit rounded-full border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-normal text-muted-foreground sm:inline-flex"
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
                            'h-8 text-xs font-semibold transition-all duration-200',
                            isNavLabel(link.label)
                                ? 'min-w-0 flex-1 px-2 sm:min-w-8 sm:flex-none'
                                : 'h-8 min-w-8 shrink-0 px-2.5',
                            link.active
                                ? 'border-zinc-300/40 bg-linear-to-r from-slate-100 via-zinc-200 to-slate-200 font-bold text-zinc-950 shadow-xs hover:from-slate-200 hover:to-slate-100'
                                : 'border-border/60 bg-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                        ]"
                    >
                        <Link :href="link.url" preserve-scroll>
                            <span v-html="link.label" />
                        </Link>
                    </Button>
                    <Button
                        v-else
                        disabled
                        variant="outline"
                        size="sm"
                        :class="[
                            'h-8 text-xs font-medium opacity-50',
                            isNavLabel(link.label)
                                ? 'min-w-0 flex-1 px-2 sm:min-w-8 sm:flex-none'
                                : 'h-8 min-w-8 shrink-0 px-2.5',
                        ]"
                    >
                        <span v-html="link.label" />
                    </Button>
                </template>
            </div>
        </CardContent>
    </Card>
</template>
