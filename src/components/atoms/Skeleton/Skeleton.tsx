// @component Skeleton | @tipo atom | @versao 1.0.0
// > Placeholder animado de carregamento — className, width, height

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
    type?: 'text' | 'title' | 'avatar' | 'rect';
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', width, height, className = '', style, ...props }) => {
    const customStyle: React.CSSProperties = {
        width,
        height,
        ...style,
    };

    const classes = cn(
        'block animate-pulse bg-muted',
        type === 'text' && 'h-4 rounded-md',
        type === 'title' && 'h-8 rounded-lg',
        type === 'avatar' && 'rounded-full',
        type === 'rect' && 'rounded-lg',
        className
    );

    return <span className={classes} style={customStyle} {...props} />;
};

export { Skeleton };
export default Skeleton;
