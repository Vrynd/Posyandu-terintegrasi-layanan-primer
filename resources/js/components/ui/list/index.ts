import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as List } from './List.vue';
export { default as ListHeader } from './ListHeader.vue';
export { default as ListTitle } from './ListTitle.vue';
export { default as ListBadge } from './ListBadge.vue';
export { default as ListContent } from './ListContent.vue';
export { default as ListItem } from './ListItem.vue';
export { default as ListItemTitle } from './ListItemTitle.vue';
export { default as ListItemMeta } from './ListItemMeta.vue';
export { default as ListItemAction } from './ListItemAction.vue';

export const listBadgeVariants = cva(
    'inline-flex min-w-6 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-muted text-muted-foreground',
                emerald:
                    'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
                success:
                    'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
                rose: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
                destructive:
                    'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
                primary: 'bg-primary/10 text-primary dark:bg-primary/20',
                secondary: 'bg-secondary text-secondary-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export type ListBadgeVariants = VariantProps<typeof listBadgeVariants>;
