'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from "@iconify/react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[] | string[];
    placeholder?: string;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
    value, 
    onChange, 
    options, 
    placeholder = "Selecione...", 
    className = "" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const normalizedOptions = options.map(opt => 
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const selectedLabel = normalizedOptions.find(opt => opt.value === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 rounded-2xl border border-border bg-background px-4 outline-none text-sm font-semibold text-foreground flex items-center justify-between hover:border-primary/50 transition-all focus:border-primary"
            >
                <span className={`truncate ${!value ? 'text-muted-foreground/40' : ''}`}>{selectedLabel}</span>
                <Icon 
                    icon="material-symbols:expand-more" 
                    className={`size-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 w-full mt-1 bg-popover border border-border rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                        {normalizedOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-primary/10 transition-colors flex items-center justify-between ${value === opt.value ? 'bg-primary/5 text-primary font-bold' : 'text-foreground font-medium'}`}
                            >
                                {opt.label}
                                {value === opt.value && <Icon icon="material-symbols:check-small" className="size-5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
