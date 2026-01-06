import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface DynamicListInputProps {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    icon?: string;
    options?: string[]; // New prop for predefined options
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({
    label,
    items,
    onChange,
    placeholder = "Digite e pressione Enter...",
    icon = "list",
    options = [] // Default to empty array if not provided
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem(inputValue);
        }
    };

    const addItem = (value: string) => {
        if (value.trim()) {
            if (!items.includes(value.trim())) {
                onChange([...items, value.trim()]);
            }
            setInputValue('');
            setShowOptions(false);
        }
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const filteredOptions = options.filter(opt =>
        !items.includes(opt) &&
        opt.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-3" ref={wrapperRef}>
            <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
                {label}
            </label>

            <div className="relative">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (options.length > 0) setShowOptions(true);
                        }}
                        onFocus={() => {
                            if (options.length > 0) setShowOptions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 placeholder:text-muted-foreground"
                        placeholder={placeholder}
                    />
                    <button
                        type="button"
                        onClick={() => addItem(inputValue)}
                        disabled={!inputValue.trim()}
                        className="h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Adicionar
                    </button>
                </div>

                {/* Predefined Options Dropdown */}
                {showOptions && filteredOptions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                        {filteredOptions.map((option, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 text-foreground"
                                onClick={() => addItem(option)}
                            >
                                <span className="material-symbols-outlined text-[16px] text-muted-foreground">add</span>
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-1">
                {items.length === 0 && (
                    <p className="text-xs text-muted-foreground italic pl-1">Nenhum item adicionado.</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-muted/30 border border-border rounded-lg text-sm transition-all hover:bg-muted/50 hover:border-primary/30"
                        >
                            <span className="text-foreground font-medium">{item}</span>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="size-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DynamicListInput;
