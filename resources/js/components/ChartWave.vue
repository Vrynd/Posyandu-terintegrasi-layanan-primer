<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, useId } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    heights: number[];
    containerWidth: number;
    height?: number;
    visibleColumns?: number;
    gap?: number;
    crownInset?: number;
    color?: string;
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    height: 228,
    visibleColumns: 9,
    gap: 24,
    crownInset: 6,
    color: 'var(--muted-foreground)',
});

const gradientId = `chart-wave-gradient-${useId()}`;

const wave = computed(() => {
    if (props.containerWidth <= 0 || props.heights.length === 0) {
        return { width: 0, linePath: '', areaPath: '' };
    }

    const barWidth =
        (props.containerWidth - (props.visibleColumns - 1) * props.gap) /
        props.visibleColumns;
    const step = barWidth + props.gap;
    const totalWidth =
        props.heights.length * barWidth +
        (props.heights.length - 1) * props.gap;

    const points = props.heights.map((barHeight, index) => {
        const x = index * step + barWidth / 2;
        const y = Math.max(2, props.height - barHeight + props.crownInset);

        return { x, y };
    });

    const first = points[0];
    const last = points[points.length - 1];

    // Mulai dari tepi kiri batang pertama menuju titik tengah batang pertama
    let linePath = `M 0 ${first.y} L ${first.x} ${first.y}`;

    // Hubungkan tiap titik tengah batang menggunakan kurva Cubic Bezier halus
    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cpOffset = (next.x - curr.x) * 0.45;

        linePath += ` C ${curr.x + cpOffset} ${curr.y}, ${next.x - cpOffset} ${next.y}, ${next.x} ${next.y}`;
    }

    // Akhiri sampai tepi kanan batang terakhir
    linePath += ` L ${totalWidth} ${last.y}`;

    // Area tertutup sampai dasar batang untuk gradasi background
    const areaPath = `${linePath} L ${totalWidth} ${props.height} L 0 ${props.height} Z`;

    return {
        width: totalWidth,
        linePath,
        areaPath,
    };
});
</script>

<template>
    <svg
        v-if="wave.width > 0"
        :width="wave.width"
        :height="props.height"
        :class="
            cn(
                'pointer-events-none absolute top-0 left-0 z-0 overflow-visible',
                props.class,
            )
        "
        aria-hidden="true"
    >
        <defs>
            <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="0%"
                    :stop-color="props.color"
                    stop-opacity="0.14"
                />
                <stop
                    offset="65%"
                    :stop-color="props.color"
                    stop-opacity="0.05"
                />
                <stop
                    offset="100%"
                    :stop-color="props.color"
                    stop-opacity="0"
                />
            </linearGradient>
        </defs>

        <!-- Area Gradasi Lembut di Bawah Kurva -->
        <path
            :d="wave.areaPath"
            :fill="`url(#${gradientId})`"
            class="transition-all duration-300"
        />

        <!-- Garis Kurva Halus Penghubung Puncak Bar -->
        <path
            :d="wave.linePath"
            fill="none"
            stroke-width="1.75"
            stroke-linecap="round"
            class="stroke-muted-foreground/25 transition-all duration-300 dark:stroke-muted-foreground/30"
        />
    </svg>
</template>
