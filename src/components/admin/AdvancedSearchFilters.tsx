'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@src/lib/utils';
import Select from '@src/components/atoms/Select/Select';

interface AdvancedSearchFiltersProps {
    onSearch: (filters: any) => void;
    allSkills: string[];
    allLocations?: string[]; // mantido para compatibilidade, não usado no dropdown
}

const labelClass = 'text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-0.5';

const inputClass = cn(
    'h-10 w-full bg-background border border-border rounded-xl',
    'text-sm font-semibold text-foreground outline-none',
    'transition-all duration-200 ease-in-out',
    'hover:border-primary/40',
    'focus:border-primary focus:ring-2 focus:ring-primary/15',
    'placeholder:text-muted-foreground/50'
);

const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Arquivado', label: 'Arquivado' },
];

const availabilityOptions = [
    { value: '', label: 'Disp.' },
    { value: 'Imediata', label: 'Imediata' },
    { value: '15 dias', label: '15 dias' },
    { value: '30 dias', label: '30 dias' },
];

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ onSearch, allSkills }) => {
    const [filters, setFilters] = useState({
        query: '',
        skills: [] as string[],
        competencies: [] as string[],
        location: '',
        availability: '',
        status: 'Ativo',
    });

    const set = (key: string, val: string) => setFilters(prev => ({ ...prev, [key]: val }));

    const handleApply = () => onSearch(filters);

    const handleClear = () => {
        const reset = { query: '', skills: [], competencies: [], location: '', availability: '', status: 'Ativo' };
        setFilters(reset);
        onSearch(reset);
    };

    const skillOptions = [
        { value: '', label: 'Qualquer habilidade' },
        ...allSkills.map(s => ({ value: s, label: s })),
    ];

    return (
        <div className="bg-card rounded-2xl p-5 border border-border transition-all duration-200 overflow-x-auto">
            <div className="flex gap-3 items-end min-w-[640px]">

                {/* Identificação */}
                <div className="flex flex-col gap-1.5 flex-[2] min-w-[160px]">
                    <label className={labelClass}>Identificação</label>
                    <div className="relative">
                        <Icon
                            icon="material-symbols:search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none"
                        />
                        <input
                            name="query"
                            value={filters.query}
                            onChange={e => set('query', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleApply()}
                            placeholder="Nome, email..."
                            className={cn(inputClass, 'pl-9 pr-3')}
                        />
                    </div>
                </div>

                {/* Hard Skill — searchable */}
                <div className="flex flex-col gap-1.5 flex-[2] min-w-[160px]">
                    <label className={labelClass}>Hard Skill</label>
                    <Select
                        options={skillOptions}
                        value={filters.skills[0] || ''}
                        onChange={val => setFilters(prev => ({ ...prev, skills: val ? [val] : [] }))}
                        searchable
                    />
                </div>

                {/* Localização — input livre */}
                <div className="flex flex-col gap-1.5 flex-[2] min-w-[150px]">
                    <label className={labelClass}>Localização</label>
                    <div className="relative">
                        <Icon
                            icon="material-symbols:location-on-outline"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none"
                        />
                        <input
                            name="location"
                            value={filters.location}
                            onChange={e => set('location', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleApply()}
                            placeholder="Cidade..."
                            className={cn(inputClass, 'pl-9 pr-3')}
                        />
                    </div>
                </div>

                {/* Status / Disponibilidade */}
                <div className="flex flex-col gap-1.5 flex-[2] min-w-[170px]">
                    <label className={labelClass}>Status / Disponibilidade</label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select
                            options={statusOptions}
                            value={filters.status}
                            onChange={val => set('status', val)}
                            size="sm"
                        />
                        <Select
                            options={availabilityOptions}
                            value={filters.availability}
                            onChange={val => set('availability', val)}
                            size="sm"
                        />
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-end gap-2 shrink-0">
                    <button
                        onClick={handleApply}
                        className={cn(
                            'h-10 px-5 bg-primary text-primary-foreground rounded-xl',
                            'text-xs font-bold flex items-center gap-2 whitespace-nowrap',
                            'transition-all duration-200 ease-in-out',
                            'hover:bg-primary/90 active:scale-[0.97] active:brightness-95',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
                        )}
                    >
                        <Icon icon="material-symbols:filter-alt" className="size-4" />
                        Filtrar
                    </button>
                    <button
                        onClick={handleClear}
                        aria-label="Limpar filtros"
                        className={cn(
                            'h-10 w-10 shrink-0 flex items-center justify-center rounded-xl',
                            'bg-background border border-border text-muted-foreground',
                            'transition-all duration-200 ease-in-out',
                            'hover:border-primary/40 hover:text-primary hover:bg-primary/5',
                            'active:scale-[0.97] active:brightness-95',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20'
                        )}
                    >
                        <Icon icon="material-symbols:refresh" className="size-4" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdvancedSearchFilters;
