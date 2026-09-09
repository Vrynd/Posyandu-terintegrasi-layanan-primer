import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
    // Base — seminimal mungkin dari bawaan shadcn, hanya tambah active:scale
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-xs hover:ring-2 hover:ring-primary/30 active:scale-[0.97]',
                gradient:
                    'bg-linear-to-r from-primary to-accent text-white shadow-xs hover:ring-2 hover:ring-primary/30   active:scale-[0.97]',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-xs hover:ring-2 hover:ring-destructive/30 active:scale-[0.97] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive',
                outline:
                    'border bg-muted/60 text-foreground shadow-xs hover:bg-muted dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:ring-2 hover:ring-border/30 hover:ring-offset-background active:scale-[0.97]',
                ghost:
                    'hover:bg-muted hover:text-foreground active:bg-muted/80 dark:hover:bg-accent/50',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                xs: 'h-7 rounded-md gap-1 px-2.5 text-[11px] has-[>svg]:px-2',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                default: 'h-9 px-4 py-2 has-[>svg]:px-3.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                'icon-sm': 'size-8',
                icon: 'size-9',
                'icon-lg': 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
