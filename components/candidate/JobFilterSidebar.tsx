import React from 'react';

interface JobFilterSidebarProps {
    filters: {
        areas: string[];
        levels: string[];
        models: string[];
    };
    onFilterChange: (type: 'areas' | 'levels' | 'models', value: string) => void;
    onClear: () => void;
    totalResults: number;
}

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({ filters, onFilterChange, onClear, totalResults }) => {
    return (
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24">
            {/* Mobile Filter Accordion */}
            <details className="lg:hidden group mb-4">
                <summary className="flex items-center justify-between p-4 bg-white text-slate-900 border border-slate-300 cursor-pointer select-none transition-colors rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary transition-colors">tune</span>
                        <span className="font-semibold text-sm tracking-tight">Filtrar vagas</span>
                    </div>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 p-5 bg-white text-slate-900 border border-slate-300 transition-all rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-slate-900 tracking-tight">Filtros</h3>
                        <button onClick={onClear} className="text-xs font-semibold text-primary hover:text-slate-900 transition-colors">Limpar</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* Mobile Filters Area */}
                        <div className="pt-2 pb-3 flex flex-col gap-3">
                            <p className="text-xs font-semibold text-slate-400 mb-1">Área de atuação</p>
                            {['Tecnologia', 'Marketing', 'Design', 'Recursos Humanos', 'Financeiro'].map(area => (
                                <label key={area} className="flex items-center gap-3 cursor-pointer group/label">
                                    <input
                                        type="checkbox"
                                        checked={filters.areas.includes(area)}
                                        onChange={() => onFilterChange('areas', area)}
                                        className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 bg-white focus:ring-0 transition-colors"
                                    />
                                    <span className={`text-xs font-semibold ${filters.areas.includes(area) ? 'text-primary' : 'text-slate-500'} group-hover/label:text-slate-900 transition-colors`}>{area}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </details>

            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:flex flex-col gap-4 bg-white text-slate-900 border border-slate-200 p-6 transition-all rounded-2xl shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                    <h3 className="font-semibold text-lg text-slate-900 tracking-tight">Filtros</h3>
                    {(filters.areas.length > 0 || filters.models.length > 0) && (
                        <button onClick={onClear} className="text-xs font-semibold text-primary hover:text-slate-900 transition-colors animate-in fade-in slide-in-from-right-2 duration-300">Limpar</button>
                    )}
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-3 transition-colors">
                    {/* Filter Group: Área */}
                    <div className="py-4 border-b border-slate-200">
                        <h4 className="flex items-center justify-between py-2 select-none text-xs font-bold text-slate-400 mb-2">
                            Área de atuação
                        </h4>
                        <div className="flex flex-col gap-3 pl-1">
                            {['Tecnologia', 'Marketing', 'Design', 'Recursos Humanos', 'Financeiro'].map(area => (
                                <label key={area} className="flex items-center gap-3 cursor-pointer group/item">
                                    <input
                                        type="checkbox"
                                        checked={filters.areas.includes(area)}
                                        onChange={() => onFilterChange('areas', area)}
                                        className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 bg-white focus:ring-0 transition-colors"
                                    />
                                    <span className={`text-xs font-semibold ${filters.areas.includes(area) ? 'text-primary' : 'text-slate-500'} group-hover/item:text-slate-900 transition-colors`}>
                                        {area}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Modalidade */}
                    <div className="py-4 border-b border-slate-200">
                        <h4 className="flex items-center justify-between py-2 select-none text-xs font-bold text-slate-400 mb-2">
                            Modalidade
                        </h4>
                        <div className="flex flex-col gap-3 pl-1">
                            {['Remoto', 'Híbrido', 'Presencial'].map(model => (
                                <label key={model} className="flex items-center gap-3 cursor-pointer group/item">
                                    <input
                                        type="checkbox"
                                        checked={filters.models.includes(model)}
                                        onChange={() => onFilterChange('models', model)}
                                        className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 bg-white focus:ring-0 transition-colors"
                                    />
                                    <span className={`text-xs font-semibold ${filters.models.includes(model) ? 'text-primary' : 'text-slate-500'} group-hover/item:text-slate-900 transition-colors`}>
                                        {model}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Contrato */}
                    <div className="py-4 border-b border-slate-200">
                        <h4 className="flex items-center justify-between py-2 select-none text-xs font-bold text-slate-400 mb-2">
                            Contrato
                        </h4>
                        <div className="flex flex-col gap-3 pl-1">
                            {['PJ', 'CLT'].map(contract => (
                                <label key={contract} className="flex items-center gap-3 cursor-pointer group/item">
                                    <input
                                        type="checkbox"
                                        checked={filters.models.includes(contract)}
                                        onChange={() => onFilterChange('models', contract)}
                                        className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 bg-white focus:ring-0 transition-colors"
                                    />
                                    <span className={`text-xs font-semibold ${filters.models.includes(contract) ? 'text-primary' : 'text-slate-500'} group-hover/item:text-slate-900 transition-colors`}>
                                        {contract}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-center text-slate-400 font-bold">
                        {totalResults} {totalResults === 1 ? 'Vaga encontrada' : 'Vagas encontradas'}
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default JobFilterSidebar;
