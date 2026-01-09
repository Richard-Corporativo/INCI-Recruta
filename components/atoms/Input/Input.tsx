import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    id,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="input-wrapper">
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                ref={ref}
                id={id}
                className={`input ${error ? 'input--error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
