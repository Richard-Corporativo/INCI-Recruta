// @component Button | @tipo atom | @versao 1.0.0
// > Botão base com variantes Balha DS — primary, secondary, ghost, danger
// @api variant, size, children, onClick, disabled

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                secondary: 'bg-muted text-foreground hover:bg-muted/80',
                outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-8 px-3 text-xs',
                md: 'h-10 px-6 py-2 min-h-[40px]',
                lg: 'h-12 px-8 text-base min-h-[48px]',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
