'use client';
// @component JobFilterConsole | @tipo componente | @versao 1.0.0
// > Console de filtros para busca de vagas — pesquisa, departamento, localização
// @state filters — filtros ativos, isOpen — estado do console
'use client';
// @component JobFilterConsole | @tipo componente | @versao 1.0.0
// > Console de filtros para busca de vagas — pesquisa, departamento, localização
// @state filters — filtros ativos, isOpen — estado do console


import React, { useState, useRef, useEffect } from 'react';
import { Icon } from "@iconify/react";
import LocationDropdown from './LocationDropdown';
import { DEPARTMENT_AREAS } from '@src/constants/departments';

interface JobFilterConsoleProps {
    filters: {
        areas: string[];
        levels: string[];
        models: string[];
        contracts: string[];
        urgencies: string[];
        pcd: string[];
    };
    /** Lista de áreas dinâmicas extraídas das vagas ativas no banco */
    availableAreas?: string[];
    onFilterChange: (type: 'areas' | 'levels' | 'models' | 'contracts' | 'urgencies' | 'pcd', value: string) => void;
    onClear: () => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    locationFilter: string;
    onLocationChange: (value: string) => void;
    otherAreaQuery?: string;
    onOtherAreaQueryChange?: (value: string) => void;
}

const JobFilterConsole: React.FC<JobFilterConsoleProps> = ({
    filters,
    availableAreas,
    onFilterChange,
    onClear,
    searchQuery,
    onSearchChange,
    locationFilter,
    onLocationChange,
    otherAreaQuery = '',
    onOtherAreaQueryChange
}) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // Áreas: Usar a lista constante definida no projeto
    const filterOptions = {
        areas: DEPARTMENT_AREAS,
        models: ['Remoto', 'Híbrido', 'Presencial'],
        contracts: ['PJ', 'CLT', 'Estágio', 'Temporário'],
        levels: ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Gestão'],
        urgencies: ['Alta', 'Média', 'Baixa'],
        pcd: ['Sim', 'Não']
    };

    const hasActiveFilters = filters.areas.length > 0 || filters.models.length > 0 || filters.contracts.length > 0 || filters.levels.length > 0 || filters.urgencies.length > 0 || filters.pcd.length > 0 || searchQuery || locationFilter;

    return (
        <div className="w-full space-y-4" ref={dropdownRef}>
            {/* Search Bar - Principal */}
            <div className="bg-card border border-border p-3 rounded-2xl flex flex-col lg:flex-row gap-3">
                <div className="flex-1 flex items-center px-5 h-14 bg-muted/50 rounded-xl focus-within:ring-2 ring-primary/20 transition-all group">
                    <Icon icon="material-symbols:search" className="text-muted-foreground group-focus-within:text-primary size-5" />
                    <input
                        id="job-search-input"
                        className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 text-sm font-semibold ml-3 outline-none uppercase tracking-wide"
                        placeholder="Buscar Vagas..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                
                <LocationDropdown 
                    value={locationFilter} 
                    onChange={onLocationChange} 
                />

                {hasActiveFilters && (
                    <button 
                        onClick={onClear}
                        className="h-14 px-6 text-[10px] font-semibold text-primary hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest border border-primary/10"
                    >
                        Limpar
                    </button>
                )}
            </div>

            {/* Quick Filters - Secondary Row */}
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-stretch lg:items-center gap-2 lg:gap-3">
                {/* Areas Filter */}
                <div className="relative w-full lg:w-auto">
                    <button 
                        onClick={() => toggleDropdown('areas')}
                        className={`flex items-center justify-between w-full gap-2 px-3 py-3 h-full min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'areas' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Área:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.areas.length > 0 ? `${filters.areas.length} Sel.` : 'Todas'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'areas' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'areas' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-2xl p-3 z-[100] animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                            <div className="space-y-1 mb-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {filterOptions.areas.map(option => {
                                    const isOther = option === 'Outro';
                                    if (isOther) return null; // Renderizamos o Outro separadamente abaixo

                                    return (
                                        <label key={option} className="flex items-center gap-3 px-3 py-1.5 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.areas.includes(option)}
                                                    onChange={() => onFilterChange('areas', option)}
                                                    className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                                />
                                                <Icon 
                                                    icon="material-symbols:check-small-rounded" 
                                                    className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.areas.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                            </div>
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                                {option}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Área "Outro" como Input Direto (sem checkbox) */}
                            <div className="mt-2 pt-2 border-t border-border">
                                <div className={`flex items-center gap-2 bg-muted/40 rounded-lg px-3 h-9 transition-all border ${otherAreaQuery ? 'border-primary/30 bg-primary/5' : 'border-transparent'}`}>
                                    <Icon 
                                        icon="material-symbols:edit-square-outline" 
                                        className={`size-4 ${otherAreaQuery ? 'text-primary' : 'text-muted-foreground'}`} 
                                    />
                                    <input
                                        type="text"
                                        value={otherAreaQuery}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            onOtherAreaQueryChange?.(val);
                                            const trimmedVal = val.trim();
                                            // Se o usuário digitou algo (mesmo com espaços), garantimos que 'Outro' está selecionado nos filtros
                                            if (trimmedVal && !filters.areas.includes('Outro')) {
                                                onFilterChange('areas', 'Outro');
                                            } else if (!trimmedVal && filters.areas.includes('Outro')) {
                                                // Se apagou tudo, desmarca o 'Outro'
                                                onFilterChange('areas', 'Outro');
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setOpenDropdown(null);
                                            }
                                        }}
                                        placeholder="OUTRA ÁREA..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/40 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contract Filter (Vínculo) */}
                <div className="relative w-full lg:w-auto">
                    <button 
                        onClick={() => toggleDropdown('contracts')}
                        className={`flex items-center justify-between w-full gap-2 px-3 py-3 h-full min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'contracts' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Vínculo:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.contracts.length > 0 ? `${filters.contracts.length} Sel.` : 'Todos'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'contracts' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'contracts' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            {filterOptions.contracts.map(option => (
                                <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.contracts.includes(option)}
                                            onChange={() => onFilterChange('contracts', option)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon 
                                            icon="material-symbols:check-small-rounded" 
                                            className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.contracts.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Environment Filter (Modelo) */}
                <div className="relative w-full lg:w-auto">
                    <button 
                        onClick={() => toggleDropdown('models')}
                        className={`flex items-center justify-between w-full gap-2 px-3 py-3 h-full min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'models' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Modelo:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.models.length > 0 ? filters.models.join(', ') : 'Todos'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'models' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'models' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            {filterOptions.models.map(option => (
                                <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.models.includes(option)}
                                            onChange={() => onFilterChange('models', option)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon 
                                            icon="material-symbols:check-small-rounded" 
                                            className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.models.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Seniority Filter (Nível) */}
                <div className="relative w-full lg:w-auto">
                    <button 
                        onClick={() => toggleDropdown('levels')}
                        className={`flex items-center justify-between w-full gap-2 px-3 py-3 h-full min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'levels' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Nível:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.levels.length > 0 ? `${filters.levels.length} Sel.` : 'Todos'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'levels' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'levels' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            {filterOptions.levels.map(option => (
                                <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.levels.includes(option)}
                                            onChange={() => onFilterChange('levels', option)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon 
                                            icon="material-symbols:check-small-rounded" 
                                            className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.levels.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Urgency Filter */}
                <div className="relative col-span-2 lg:col-span-1 w-full lg:w-auto">
                    <button 
                        onClick={() => toggleDropdown('urgencies')}
                        className={`flex items-center justify-between w-full lg:w-auto gap-2 px-3 py-3 min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'urgencies' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">Urgência:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.urgencies.length > 0 ? `${filters.urgencies.length} Sel.` : 'Todas'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'urgencies' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'urgencies' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            {filterOptions.urgencies.map(option => (
                                <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.urgencies.includes(option)}
                                            onChange={() => onFilterChange('urgencies', option)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon 
                                            icon="material-symbols:check-small-rounded" 
                                            className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.urgencies.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* PCD Filter */}
                <div className="relative col-span-2 lg:col-span-1 w-full lg:w-auto">
                    <button
                        onClick={() => toggleDropdown('pcd')}
                        className={`flex items-center justify-between w-full lg:w-auto gap-2 px-3 py-3 min-h-[40px] bg-card border rounded-xl transition-all hover:border-primary/50 ${openDropdown === 'pcd' ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">PCD:</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-foreground truncate">
                                {filters.pcd.length > 0 ? filters.pcd.join(', ') : 'Todos'}
                            </span>
                        </div>
                        <Icon icon="material-symbols:keyboard-arrow-down" className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${openDropdown === 'pcd' ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {openDropdown === 'pcd' && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-card border border-border rounded-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                            {filterOptions.pcd.map(option => (
                                <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.pcd.includes(option)}
                                            onChange={() => onFilterChange('pcd', option)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon 
                                            icon="material-symbols:check-small-rounded" 
                                            className={`absolute size-3.5 text-primary-foreground transition-opacity pointer-events-none ${filters.pcd.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobFilterConsole;
