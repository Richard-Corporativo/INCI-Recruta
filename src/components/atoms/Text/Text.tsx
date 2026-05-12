// @component Text | @tipo atom | @versao 1.0.0
// > Tipografia base — as, variant, weight, children

import React from 'react';

interface TextProps<T extends React.ElementType> {
    as?: T;
    size?: 'small' | 'base' | 'large' | 'xl';
    weight?: 'normal' | 'medium' | 'bold';
    color?: 'default' | 'muted' | 'primary' | 'error';
    children: React.ReactNode;
    className?: string;
}

const Text = <T extends React.ElementType = 'p'>({
    as,
    size = 'base',
    weight = 'normal',
    color = 'default',
    children,
    className = '',
    ...props
}: TextProps<T> & React.ComponentPropsWithoutRef<T>) => {
    const Component = as || 'p';
    const classes = `text text--${size} text--${weight} text--${color} ${className}`;

    return <Component className={classes} {...props}>{children}</Component>;
};

export default Text;
