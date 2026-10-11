import {
    Baby,
    Briefcase,
    GraduationCap,
    HeartHandshake,
    HeartPulse,
} from '@lucide/vue';
import type { Component } from 'vue';
import type { BadgeColor } from '@/components/StatusBadge.vue';
import type { TrendCategory } from '@/types';

export interface CategoryMeta {
    key: TrendCategory;
    label: string;
    color: string;
    icon: Component;
}

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

export const trendCategories: readonly CategoryMeta[] = [
    {
        key: 'pregnant',
        label: 'Ibu Hamil',
        color: 'bg-linear-to-r from-pink-500 to-pink-400',
        icon: HeartPulse,
    },
    {
        key: 'toddler',
        label: 'Balita',
        color: 'bg-linear-to-r from-blue-500 to-blue-400',
        icon: Baby,
    },
    {
        key: 'teenager',
        label: 'Remaja',
        color: 'bg-linear-to-r from-teal-500 to-teal-400',
        icon: GraduationCap,
    },
    {
        key: 'productive',
        label: 'Produktif',
        color: 'bg-linear-to-r from-orange-500 to-orange-400',
        icon: Briefcase,
    },
    {
        key: 'adult',
        label: 'Lansia',
        color: 'bg-linear-to-r from-amber-400 to-amber-300',
        icon: HeartHandshake,
    },
];

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
