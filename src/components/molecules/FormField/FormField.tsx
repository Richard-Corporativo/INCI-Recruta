// @component FormField | @tipo molecule | @versao 1.0.0
// > Label + input + mensagem de erro — composição de átomos
// @api label, error, inputProps, required

import React from 'react';
import { Input, Text } from '../../atoms';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helpText?: string;
    required?: boolean;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(({
    label,
    name,
    error,
    helpText,
    required = false,
    ...props
}, ref) => {
    return (
        <div className="form-field">
            <label htmlFor={name} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>

            <Input
                ref={ref}
                id={name}
                name={name}
                error={error}
                {...props}
            />

            {helpText && !error && (
                <Text size="small" color="muted" className="form-field__help">
                    {helpText}
                </Text>
            )}

            {error && (
                <Text size="small" color="error" role="alert" className="form-field__error">
                    {error}
                </Text>
            )}
        </div>
    );
});

FormField.displayName = 'FormField';

export default FormField;
