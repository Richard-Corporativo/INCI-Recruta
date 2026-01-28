import React, { useState } from 'react';

interface AdvancedSearchFiltersProps {
    onSearch: (filters: any) => void;
    allSkills: string[];
    allLocations: string[];
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ onSearch, allSkills, allLocations }) => {
    const [filters, setFilters] = useState({
        query: '',
        skills: [] as string[],
        competencies: [] as string[],
        location: '',
        availability: '',
        status: 'Ativo'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onSearch(filters);
    };

    const handleClear = () => {
        const reset = {
            query: '',
            skills: [],
            competencies: [],
            location: '',
            availability: '',
            status: 'Ativo'
        };
        setFilters(reset);
        onSearch(reset);
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined text-[22px]">tune</span>
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground">Busca Inteligente</h2>
                    <p className="text-[11px] text-muted-foreground font-medium">Combine parâmetros para encontrar o talento ideal.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Identificação / Cargo</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">search</span>
                        <input
                            name="query"
                            value={filters.query}
                            onChange={handleChange}
                            placeholder="Nome, email..."
                            className="h-11 w-full pl-10 pr-4 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Habilidade / Hard Skill</label>
                    <select
                        name="skills"
                        value={filters.skills[0] || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value ? [e.target.value] : [] }))}
                        className="h-11 px-3 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                    >
                        <option value="">Qualquer habilidade</option>
                        {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Localização</label>
                    <select
                        name="location"
                        value={filters.location}
                        onChange={handleChange}
                        className="h-11 px-3 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                    >
                        <option value="">Qualquer cidade</option>
                        {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Status de Cadastro</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="h-11 px-3 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                    >
                        <option value="Ativo">Ativo</option>
                        <option value="Arquivado">Arquivado</option>
                        <option value="Contratado">Contratado</option>
                    </select>
                </div>


                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Disponibilidade</label>
                    <select
                        name="availability"
                        value={filters.availability}
                        onChange={handleChange}
                        className="h-11 px-3 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                    >
                        <option value="">Qualquer uma</option>
                        <option value="Imediata">Imediata</option>
                        <option value="15 dias">15 dias</option>
                        <option value="30 dias">30 dias</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-border/60">
                <button
                    onClick={handleClear}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                >
                    Limpar Filtros
                </button>
                <button
                    onClick={handleApply}
                    className="bg-primary text-primary-foreground px-8 py-2.5 rounded-base text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
                >
                    <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                    Executar Busca
                </button>
            </div>
        </div>
    );
};

export default AdvancedSearchFilters;
