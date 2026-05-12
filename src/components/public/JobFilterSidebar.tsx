import React from 'react';
import { Icon } from '@iconify/react';
import { DEPARTMENT_AREAS } from '@src/constants/departments';

interface JobFilterSidebarProps {
    filters: {
        areas: string[];
        levels: string[];
        models: string[];
        contracts: string[];
    };
    otherAreaQuery?: string;
    onOtherAreaQueryChange?: (value: string) => void;
    onFilterChange: (type: 'areas' | 'levels' | 'models' | 'contracts', value: string) => void;
    onClear: () => void;
    totalResults: number;
}

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({ 
    filters, 
    onFilterChange, 
    onClear, 
    totalResults,
    otherAreaQuery = '',
    onOtherAreaQueryChange 
}) => {
    return (
        <aside className="w-full shrink-0">
            {/* Filter Module - Balha 9.1 */}
            <div className="bg-card border border-border p-6 md:p-8 rounded-2xl space-y-10 relative overflow-hidden text-[var(--foreground)]">
                <div className="flex justify-between items-center border-b border-border pb-5 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:tune" className="size-4 text-primary" />
                            <h3 className="text-[11px] font-semibold text-[var(--foreground)] uppercase tracking-wide">Filtros</h3>
                        </div>
                    </div>
                    {(filters.areas.length > 0 || filters.models.length > 0 || filters.contracts.length > 0) && (
                        <button 
                            onClick={onClear} 
                            className="text-[9px] font-semibold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-all uppercase tracking-wide"
                        >
                            Limpar
                        </button>
                    )}
                </div>

                <div className="space-y-10 relative z-10">
                    {/* Filter Group: Área Técnica */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Área Técnica</h4>
                            <span className="h-px flex-1 bg-border ml-4"></span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {DEPARTMENT_AREAS.map(area => (
                                <div key={area} className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.areas.includes(area)}
                                                onChange={() => onFilterChange('areas', area)}
                                                className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                            />
                                            <Icon icon="material-symbols:check" className="absolute text-white opacity-0 peer-checked:opacity-100 h-2.5 w-2.5 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className={`text-[12px] font-semibold uppercase tracking-wide transition-colors ${filters.areas.includes(area) ? 'text-[var(--foreground)]' : 'text-muted-foreground group-hover:text-[var(--foreground)]'}`}>
                                            {area}
                                        </span>
                                    </label>
                                    
                                    {area === 'Outro' && filters.areas.includes('Outro') && (
                                        <div className="pl-7 animate-in slide-in-from-top-1 duration-200">
                                            <input
                                                type="text"
                                                value={otherAreaQuery}
                                                onChange={(e) => onOtherAreaQueryChange?.(e.target.value)}
                                                placeholder="Especifique..."
                                                className="w-full h-8 bg-muted/30 border border-border rounded-lg px-3 text-[11px] font-medium text-foreground outline-none focus:border-primary transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Ambiente Operacional */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Ambiente</h4>
                            <span className="h-px flex-1 bg-border ml-4"></span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {['Remoto', 'Híbrido', 'Presencial'].map(model => (
                                <label key={model} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.models.includes(model)}
                                            onChange={() => onFilterChange('models', model)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon icon="material-symbols:check" className="absolute text-white opacity-0 peer-checked:opacity-100 h-2.5 w-2.5 pointer-events-none transition-opacity" />
                                    </div>
                                    <span className={`text-[12px] font-semibold uppercase tracking-wide transition-colors ${filters.models.includes(model) ? 'text-[var(--foreground)]' : 'text-muted-foreground group-hover:text-[var(--foreground)]'}`}>
                                        {model}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Vínculo Contratual */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Vínculo</h4>
                            <span className="h-px flex-1 bg-border ml-4"></span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {['PJ', 'CLT'].map(contract => (
                                <label key={contract} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.contracts.includes(contract)}
                                            onChange={() => onFilterChange('contracts', contract)}
                                            className="peer appearance-none size-4 border border-border rounded bg-background checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <Icon icon="material-symbols:check" className="absolute text-white opacity-0 peer-checked:opacity-100 h-2.5 w-2.5 pointer-events-none transition-opacity" />
                                    </div>
                                    <span className={`text-[12px] font-semibold uppercase tracking-wide transition-colors ${filters.contracts.includes(contract) ? 'text-[var(--foreground)]' : 'text-muted-foreground group-hover:text-[var(--foreground)]'}`}>
                                        {contract}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border flex flex-col gap-3 relative z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Resultados</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-semibold text-[var(--foreground)] tabular-nums">{totalResults}</span>
                            <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wide">Vagas</span>
                        </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min(100, (totalResults / 20) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default JobFilterSidebar;
