<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
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

// Batasi tampilan nomor halaman agar tidak memanjang (maksimal 7 tombol nomor + elipsis)
const visibleLinks = computed(() => {
    if (!props.links || props.links.length <= 3) {
        return props.links;
    }

    const prevLink = props.links[0];
    const nextLink = props.links[props.links.length - 1];
    const pageLinks = props.links.slice(1, -1);

    if (props.lastPage <= 7) {
        return props.links;
    }

    const activeIndex = pageLinks.findIndex((l) => l.active);
    const currentPage =
        activeIndex !== -1 ? parseInt(pageLinks[activeIndex].label, 10) : 1;
    const lastPage = props.lastPage;

    const result: PaginationLink[] = [prevLink];

    const getPageLink = (num: number): PaginationLink => {
        const found = pageLinks.find((l) => parseInt(l.label, 10) === num);

        return (
            found ?? {
                url: null,
                label: String(num),
                active: num === currentPage,
            }
        );
    };

    const ellipsisLink: PaginationLink = {
        url: null,
        label: '...',
        active: false,
    };

    if (currentPage <= 4) {
        // Dekat awal: [1] [2] [3] [4] [5] [...] [lastPage]
        for (let i = 1; i <= Math.min(5, lastPage); i++) {
            result.push(getPageLink(i));
        }

        if (lastPage > 5) {
            result.push(ellipsisLink);
            result.push(getPageLink(lastPage));
        }
    } else if (currentPage >= lastPage - 3) {
        // Dekat akhir: [1] [...] [lastPage-4] [lastPage-3] [lastPage-2] [lastPage-1] [lastPage]
        result.push(getPageLink(1));
        result.push(ellipsisLink);

        for (let i = lastPage - 4; i <= lastPage; i++) {
            result.push(getPageLink(i));
        }
    } else {
        // Di tengah: [1] [...] [current-1] [current] [current+1] [...] [lastPage]
        result.push(getPageLink(1));
        result.push(ellipsisLink);
        result.push(getPageLink(currentPage - 1));
        result.push(getPageLink(currentPage));
        result.push(getPageLink(currentPage + 1));
        result.push(ellipsisLink);
        result.push(getPageLink(lastPage));
    }

    result.push(nextLink);

    return result;
});
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
                <template v-for="(link, index) in visibleLinks" :key="index">
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
