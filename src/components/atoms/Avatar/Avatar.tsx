// @component Avatar | @tipo atom | @versao 1.0.0
// > Avatar com fallback para iniciais — src, alt, initials, size, color

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
    'relative flex shrink-0 overflow-hidden rounded-full border border-border bg-muted select-none items-center justify-center font-semibold text-muted-foreground',
    {
        variants: {
            size: {
                sm: 'h-8 w-8 text-xs',
                md: 'h-10 w-10 text-sm',
                lg: 'h-14 w-14 text-lg',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

export interface AvatarProps 
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof avatarVariants> {
    src?: string;
    alt?: string;
    fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, size, src, alt, fallback, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(avatarVariants({ size, className }))}
                {...props}
            >
                {src ? (
                    <img 
                        src={src} 
                        alt={alt} 
                        className="aspect-square h-full w-full object-cover" 
                    />
                ) : (
                    <span className="uppercase">{fallback}</span>
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export default Avatar;
