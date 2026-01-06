import React, { useState, useRef } from 'react';

interface StringListEditorProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    addButtonLabel?: string;
    icon?: string;
    emptyMessage?: string;
}

const StringListEditor: React.FC<StringListEditorProps> = ({
    items = [],
    onChange,
    placeholder = 'Digite aqui...',
    addButtonLabel = 'Adicionar item',
    icon = 'check_circle',
    emptyMessage = 'Nenhum item adicionado à lista.'
}) => {
    const [newItemText, setNewItemText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (newItemText.trim()) {
            onChange([...items, newItemText.trim()]);
            setNewItemText('');
            // Keep focus to add multiple items quickly
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const handleEdit = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onChange(newItems);
    };

    return (
        <div className="flex flex-col gap-3">
            {items.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-primary/40 pointer-events-none">
                                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                </div>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleEdit(index, e.target.value)}
                                    className="w-full h-10 pl-10 pr-10 rounded-md border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all hover:border-ring/50"
                                    placeholder={placeholder}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Remover item"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 border border-border border-dashed rounded-lg bg-muted/20 text-center">
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </div>
            )}

            <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-10 pl-3 pr-12 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all shadow-sm"
                        placeholder={addButtonLabel + "..."}
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!newItemText.trim()}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground hover:bg-primary/90 transition-all font-medium text-xs shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StringListEditor;
