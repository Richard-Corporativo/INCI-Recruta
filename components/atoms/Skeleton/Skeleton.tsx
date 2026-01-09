import React from 'react';
import './Skeleton.css';

interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
    type?: 'text' | 'title' | 'avatar' | 'rect';
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', width, height, className = '', style, ...props }) => {
    // Constrói o estilo inline se width/height forem passados manualmente
    const customStyle: React.CSSProperties = {
        width,
        height,
        ...style,
    };

    const classes = `skeleton ${type} ${className}`;

    return <span className={classes} style={customStyle} {...props} />;
};

export { Skeleton };
export default Skeleton;
