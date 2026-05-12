'use client';

import React, { useState, useRef, useEffect, useId, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { cn } from '@src/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    size?: 'sm' | 'md';
    name?: string;
    searchable?: boolean;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    className,
    size = 'md',
    name,
    searchable = false,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const id = useId();

    const selected = options.find(o => o.value === value);
    const displayLabel = selected ? selected.label : placeholder;

    const filtered = useMemo(() => {
        if (!searchable || !query.trim()) return options;
        const q = query.toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, query, searchable]);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownH = Math.min(filtered.length * 40 + (searchable ? 52 : 8), searchable ? 260 : 216);
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < dropdownH && rect.top > dropdownH;
        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            ...(openUp
                ? { bottom: window.innerHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
            zIndex: 9999,
        });
    }, [filtered.length, searchable]);

    useEffect(() => {
        if (!open) { setQuery(''); return; }
        updatePosition();
        if (searchable) setTimeout(() => searchRef.current?.focus(), 50);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [open, updatePosition, searchable]);

    useEffect(() => {
        if (!open) return;
        const handleOutside = (e: MouseEvent) => {
            const t = e.target as Node;
            if (triggerRef.current?.contains(t)) return;
            if (listRef.current?.contains(t)) return;
            if (searchRef.current?.contains(t)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); return; }
        if (!open) return;
        const idx = filtered.findIndex(o => o.value === value);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = filtered[Math.min(idx + 1, filtered.length - 1)];
            if (next) onChange(next.value);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = filtered[Math.max(idx - 1, 0)];
            if (prev) onChange(prev.value);
        }
    };

    const h = size === 'sm' ? 'h-9' : 'h-10';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <div className={cn('relative', className)}>
            {name && <input type="hidden" name={name} value={value} />}

            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={`${id}-list`}
                onKeyDown={handleKeyDown}
                onClick={() => setOpen(o => !o)}
                className={cn(
                    'w-full flex items-center justify-between gap-2 px-3',
                    h,
                    'bg-background border border-border rounded-xl',
                    textSize, 'font-semibold text-left',
                    'outline-none cursor-pointer select-none',
                    'transition-all duration-200 ease-in-out',
                    'hover:border-primary/40',
                    open ? 'border-primary ring-2 ring-primary/15 text-foreground' : 'text-foreground',
                    !selected && 'text-muted-foreground/70'
                )}
            >
                <span className="truncate">{displayLabel}</span>
                <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className={cn(
                        'size-4 text-muted-foreground/60 shrink-0 transition-transform duration-200',
                        open && 'rotate-180'
                    )}
                />
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <div
                    style={dropdownStyle}
                    className="bg-card border border-border rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-100 flex flex-col overflow-hidden"
                >
                    {searchable && (
                        <div className="p-2 border-b border-border shrink-0">
                            <div className="relative">
                                <Icon
                                    icon="material-symbols:search"
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none"
                                />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Buscar..."
                                    className={cn(
                                        'w-full h-8 pl-8 pr-3 bg-background border border-border rounded-lg',
                                        textSize, 'font-semibold text-foreground outline-none',
                                        'placeholder:text-muted-foreground/50',
                                        'focus:border-primary focus:ring-2 focus:ring-primary/15',
                                        'transition-all duration-200'
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <ul
                        id={`${id}-list`}
                        ref={listRef}
                        role="listbox"
                        className="py-1 max-h-52 overflow-y-auto"
                    >
                        {filtered.length === 0 ? (
                            <li className={cn('px-3 py-2 mx-1 text-muted-foreground/60', textSize, 'font-semibold')}>
                                Nenhum resultado
                            </li>
                        ) : filtered.map(option => {
                            const isSelected = option.value === value;
                            return (
                                <li
                                    key={option.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    data-selected={isSelected}
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => { onChange(option.value); setOpen(false); }}
                                    className={cn(
                                        'flex items-center justify-between gap-2 px-3 py-2 mx-1 rounded-lg',
                                        textSize, 'font-semibold cursor-pointer',
                                        'transition-colors duration-100',
                                        isSelected
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-muted'
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && (
                                        <Icon icon="material-symbols:check" className="size-4 shrink-0" />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Select;
