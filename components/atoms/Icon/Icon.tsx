import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    filled?: boolean;
    size?: number;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ name, filled = false, size, className = '', style, ...props }) => {
    const filledClass = filled ? 'filled' : '';
    const styles = size ? { fontSize: `${size}px`, ...style } : style;

    return (
        <span
            className={`material-symbols-outlined ${filledClass} ${className}`}
            style={styles}
            {...props}
        >
            {name}
        </span>
    );
};

export default Icon;
