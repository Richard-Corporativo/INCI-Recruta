'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

interface JobOption {
    label: string;
    value: string;
    badge?: string;
    icon?: string;
}

interface JobOptionDropdownProps {
    label: string;
    value: string;
    options: JobOption[];
    onChange: (value: string) => void;
    icon: string;
    placeholder?: string;
}

const JobOptionDropdown: React.FC<JobOptionDropdownProps> = ({
    label,
    value,
    options,
    onChange,
    icon,
    placeholder = 'Selecionar'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selected = options.find(option => option.value === value);
    const displayValue = selected?.label || value || placeholder;

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
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(open => !open)}
                className="group flex h-12 w-full items-center rounded-xl border border-transparent bg-muted/50 px-4 text-left transition-all hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <Icon icon={icon} className="size-5 shrink-0 text-muted-foreground group-focus-visible:text-primary" aria-hidden="true" />
                <span className="ml-3 flex-1 truncate text-sm font-semibold uppercase tracking-wide text-foreground">
                    {displayValue}
                </span>
                <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-200">
                    <div className="border-b border-border/50 bg-muted/30 p-3">
                        <div className="flex h-10 items-center rounded-xl border border-border bg-background px-3 ring-primary/20 transition-all focus-within:ring-2">
                            <Icon icon="material-symbols:search" className="size-4 text-muted-foreground" aria-hidden="true" />
                            <span className="ml-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {label}
                            </span>
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto custom-scrollbar" role="listbox">
                        {options.map(option => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className="group flex w-full items-center justify-between border-b border-border/10 px-4 py-3 text-left transition-colors last:border-none hover:bg-primary/5"
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        {option.icon && (
                                            <Icon icon={option.icon} className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                                        )}
                                        <span className="truncate text-[11px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary">
                                            {option.label}
                                        </span>
                                    </span>
                                    {option.badge && (
                                        <span className="ml-3 flex h-5 w-[42px] shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black uppercase text-primary-foreground">
                                            {option.badge}
                                        </span>
                                    )}
                                    {isSelected && !option.badge && (
                                        <Icon icon="material-symbols:check-circle-rounded" className="ml-3 size-4 shrink-0 text-primary" aria-hidden="true" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobOptionDropdown;
