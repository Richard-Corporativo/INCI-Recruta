'use client';
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

const BENEFIT_ICON_OPTIONS = [
  'material-symbols:restaurant-rounded',
  'material-symbols:directions-bus-rounded',
  'material-symbols:shield-rounded',
  'material-symbols:home-work-rounded',
  'material-symbols:payments-rounded',
  'material-symbols:school-rounded',
  'material-symbols:schedule-rounded',
  'material-symbols:cake-rounded',
  'material-symbols:medical-services-rounded',
  'material-symbols:volunteer-activism-rounded',
  'material-symbols:rocket-launch-rounded',
  'material-symbols:local-library-rounded',
  'material-symbols:wifi-rounded',
  'material-symbols:coffee-rounded',
  'material-symbols:directions-car-rounded',
  'material-symbols:beach-access-rounded',
  'material-symbols:family-restroom-rounded',
  'material-symbols:home-rounded',
  'material-symbols:lightbulb-rounded',
  'material-symbols:badge-rounded',
  'material-symbols:music-note-rounded',
  'material-symbols:sports-bar-rounded',
  'material-symbols:flight-rounded',
  'material-symbols:groups-rounded',
  'material-symbols:accessibility-new-rounded',
  'material-symbols:cleaning-services-rounded',
  'material-symbols:star-rounded'
];

const BENEFIT_COLOR_OPTIONS = [
    { id: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    { id: 'sky', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
    { id: 'violet', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    { id: 'rose', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    { id: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    { id: 'cyan', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
    { id: 'lime', bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', dot: 'bg-lime-500' },
    { id: 'fuchsia', bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', dot: 'bg-fuchsia-500' },
    { id: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' }
];

interface BenefitsSelectorProps {
    selectedBenefits: string[];
    onChange: (benefits: string[]) => void;
}

interface ParsedBenefit {
    name: string;
    icon: string;
    colorId: string;
}

const parseBenefit = (encoded: string): ParsedBenefit => {
    const parts = encoded.split('|');
    if (parts.length === 3) {
        return { name: parts[0], icon: parts[1], colorId: parts[2] };
    }
    return { name: encoded, icon: BENEFIT_ICON_OPTIONS[0], colorId: 'sky' };
};

const encodeBenefit = (b: ParsedBenefit): string => `${b.name}|${b.icon}|${b.colorId}`;

const BenefitsSelector: React.FC<BenefitsSelectorProps> = ({ selectedBenefits, onChange }) => {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(BENEFIT_ICON_OPTIONS[0]);
    const [selectedColorId, setSelectedColorId] = useState('sky');
    const [isAdding, setIsAdding] = useState(false);

    const parsedBenefits = selectedBenefits.map(parseBenefit);

    const addBenefit = () => {
        if (!name.trim()) return;
        const newBenefit = encodeBenefit({ name: name.trim(), icon: selectedIcon, colorId: selectedColorId });
        onChange([...selectedBenefits, newBenefit]);
        setName('');
        setIsAdding(false);
    };

    const removeBenefit = (index: number) => {
        onChange(selectedBenefits.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Icon icon="material-symbols:card-giftcard-outline-rounded" className="h-4 w-4" />
                    Benefícios
                </label>
                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                    <Icon icon={isAdding ? "material-symbols:close-rounded" : "material-symbols:add-rounded"} className="size-4" />
                    {isAdding ? 'Cancelar' : 'Adicionar Novo'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-muted/10 border border-dashed border-border rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nome do Benefício</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Vale Refeição"
                                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-primary transition-all"
                                />
                            </label>

                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cor de Destaque</span>
                                <div className="flex flex-wrap gap-2">
                                    {BENEFIT_COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedColorId(c.id)}
                                            className={`size-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColorId === c.id ? 'border-primary scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                                                } ${c.bg}`}
                                        >
                                            <div className={`size-3 rounded-full ${c.dot}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                            <div className="space-y-4">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ícone Representativo</span>
                                <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                        {BENEFIT_ICON_OPTIONS.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setSelectedIcon(icon)}
                                                className={`size-10 rounded-xl border flex items-center justify-center transition-all ${selectedIcon === icon
                                                    ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-md'
                                                    : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                                                    }`}
                                            >
                                                <Icon icon={icon} className="size-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Preview:</span>
                            {name && (
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${BENEFIT_COLOR_OPTIONS.find(c => c.id === selectedColorId)?.bg} ${BENEFIT_COLOR_OPTIONS.find(c => c.id === selectedColorId)?.text} ${BENEFIT_COLOR_OPTIONS.find(c => c.id === selectedColorId)?.border}`}>
                                    <Icon icon={selectedIcon} className="size-4" />
                                    {name}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={addBenefit}
                            disabled={!name.trim()}
                            className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            Salvar Benefício
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2.5">
                {parsedBenefits.map((b, i) => {
                    const color = BENEFIT_COLOR_OPTIONS.find(c => c.id === b.colorId) || BENEFIT_COLOR_OPTIONS[0];
                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all hover:shadow-sm group ${color.bg} ${color.text} ${color.border}`}
                        >
                            <Icon icon={b.icon} className="size-4 shrink-0" />
                            <span className="text-[11px] font-bold tracking-tight">{b.name}</span>
                            <button
                                type="button"
                                onClick={() => removeBenefit(i)}
                                className="ml-1 opacity-40 group-hover:opacity-100 hover:text-rose-600 transition-all"
                            >
                                <Icon icon="material-symbols:close-rounded" className="size-4" />
                            </button>
                        </div>
                    );
                })}
                {selectedBenefits.length === 0 && !isAdding && (
                    <div className="w-full py-8 flex flex-col items-center justify-center bg-muted/5 border border-dashed border-border rounded-2xl text-muted-foreground/50">
                        <Icon icon="material-symbols:card-giftcard-outline-rounded" className="size-8 mb-2 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Nenhum benefício adicionado</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BenefitsSelector;
