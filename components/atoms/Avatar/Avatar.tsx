import React from 'react';
import './Avatar.css';

export interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    fallback,
    size = 'medium',
    className = ''
}) => {
    const classes = `avatar avatar--${size} ${className}`;

    return (
        <div className={classes}>
            {src ? (
                <img src={src} alt={alt} className="avatar__image" />
            ) : (
                <span className="avatar__fallback">{fallback}</span>
            )}
        </div>
    );
};

export default Avatar;
