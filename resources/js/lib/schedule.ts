import type { StatusOption } from '@/types';

export const defaultLabels: Record<string, string> = {
    scheduled: 'Terjadwal',
    ongoing: 'Sedang Berlangsung',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export const defaultColors: Record<string, string> = {
    scheduled: 'blue',
    ongoing: 'amber',
    completed: 'emerald',
    cancelled: 'rose',
};

const classMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-500 dark:text-blue-400' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-500 dark:text-amber-400' },
    orange: { bg: 'bg-amber-500', text: 'text-amber-500 dark:text-amber-400' },
    emerald: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-500 dark:text-emerald-400',
    },
    rose: { bg: 'bg-rose-500', text: 'text-rose-500 dark:text-rose-400' },
};

const defaultStyle = {
    bg: 'bg-blue-500',
    text: 'text-blue-500 dark:text-blue-400',
};

export function formatStatus(
    status: string,
    statuses: StatusOption[] = [],
): string {
    return (
        statuses.find((s) => s.value === status)?.label ??
        defaultLabels[status] ??
        status
    );
}

function resolveColor(status: string, statuses: StatusOption[] = []): string {
    return (
        statuses.find((s) => s.value === status)?.color ??
        defaultColors[status] ??
        'blue'
    );
}

export function statusBg(
    status: string,
    statuses: StatusOption[] = [],
): string {
    const color = resolveColor(status, statuses);

    return (classMap[color] ?? defaultStyle).bg;
}

export function statusText(
    status: string,
    statuses: StatusOption[] = [],
): string {
    const color = resolveColor(status, statuses);

    return (classMap[color] ?? defaultStyle).text;
}
