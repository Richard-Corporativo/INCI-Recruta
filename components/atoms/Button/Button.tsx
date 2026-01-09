import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'small' | 'medium' | 'large';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    ...props
}, ref) => {
    const classes = `btn btn--${variant} btn--${size} ${className}`;

    return (
        <button
            ref={ref}
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
