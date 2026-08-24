<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Calendar, Clock, MapPin, User } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDate, formatTimeRange } from '@/lib/formatters';
import type { ScheduleItem } from '@/types';

defineProps<{
    schedule: ScheduleItem;
    isAdmin?: boolean;
}>();
</script>

<template>
    <Card
        class="border-border/60 bg-card/90 shadow-xs transition-all hover:border-border hover:shadow-md dark:bg-zinc-900/80"
    >
        <CardHeader class="p-3.5 pb-2">
            <!-- Jenis Kegiatan Badge -->
            <div class="flex items-center justify-between gap-2">
                <span
                    v-if="schedule.activity_type"
                    class="inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                >
                    {{ schedule.activity_type }}
                </span>
            </div>

            <!-- Judul Kegiatan -->
            <CardTitle class="line-clamp-2 text-sm leading-snug font-semibold">
                {{ schedule.title }}
            </CardTitle>
        </CardHeader>

        <CardContent
            class="space-y-1.5 p-3.5 pt-0 text-xs text-muted-foreground"
        >
            <!-- Tanggal & Jam -->
            <div
                class="flex items-center gap-1.5 font-medium text-foreground/90"
            >
                <Calendar class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{{ formatDate(schedule.date) }}</span>
            </div>

            <div class="flex items-center gap-1.5">
                <Clock class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{{
                    formatTimeRange(schedule.start_time, schedule.end_time)
                }}</span>
            </div>

            <!-- Lokasi -->
            <div class="flex items-center gap-1.5">
                <MapPin class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span class="line-clamp-1">{{ schedule.location }}</span>
            </div>

            <!-- Deskripsi Singkat -->
            <CardDescription
                v-if="schedule.description"
                class="mt-1 line-clamp-2 text-[11px] text-muted-foreground/80"
            >
                {{ schedule.description }}
            </CardDescription>
        </CardContent>

        <CardFooter
            class="flex items-center justify-between border-t border-border/40 p-2.5 px-3.5 text-[11px]"
        >
            <!-- Pembuat / Admin -->
            <div class="flex items-center gap-1 text-muted-foreground">
                <User class="h-3 w-3" />
                <span class="max-w-30 truncate">{{
                    schedule.creator?.name ?? 'Admin'
                }}</span>
            </div>

            <!-- Tombol Aksi -->
            <Button
                variant="ghost"
                size="sm"
                class="h-6 px-2 text-xs hover:text-accent"
                as-child
            >
                <Link href="#"> Detail </Link>
            </Button>
        </CardFooter>
    </Card>
</template>
