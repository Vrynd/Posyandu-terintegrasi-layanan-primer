import type { InertiaLinkProps } from '@inertiajs/vue3';

export interface ActionCardItem {
    id: string;
    title: string;
    description: string;
    image?: string;
    href: NonNullable<InertiaLinkProps['href']>;
    isLocked?: boolean;
    lockedTooltip?: string;
    gradient?: string;
    glow?: string;
}
