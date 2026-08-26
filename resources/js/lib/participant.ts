import type { BadgeColor } from '@/components/StatusBadge.vue';

export const genderMap: Record<string, string> = {
    male: 'Laki-laki',
    female: 'Perempuan',
};

export const badgeMap: Record<string, BadgeColor> = {
    pregnant_mother: 'pink',
    toddler: 'blue',
    teenager: 'teal',
    productive: 'orange',
    adult: 'yellow',
};

export function badgeColor(category: string): BadgeColor {
    return badgeMap[category] ?? 'indigo';
}

export function formatCategory(
    category: string,
    categories: Array<{ label: string; value: string }> = [],
): string {
    return categories.find((c) => c.value === category)?.label ?? category;
}

export function isChild(category: string): boolean {
    return category === 'toddler' || category === 'teenager';
}

export function isPregnant(category: string): boolean {
    return category === 'pregnant_mother';
}

export function isAdult(category: string): boolean {
    return category === 'productive' || category === 'adult';
}
