import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../../components/candidate/HeroSection';
import JobFilterSidebar from '../../components/candidate/JobFilterSidebar';
import JobCardPublic, { PublicJob } from '../../components/candidate/JobCardPublic';

import { StorageService, KEYS } from '../../lib/storage';
import { Job } from '../../types';

// Helper to map Job to JobCardPublic format if they differ slightly
const mapJobToPublic = (job: Job): PublicJob => ({
    id: job.id.toString(),
    title: job.title,
    department: `${job.department}`,
    location: `${job.location} (${job.model})`,
    type: job.contract,
    level: job.seniority || 'Sênior',
    tags: [job.model, job.contract, job.urgency === 'Alta' ? 'Urgente' : ''].filter(Boolean),
    isUrgent: job.urgency === 'Alta',
    isNew: true // Placeholder logic
});

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const [allJobs, setAllJobs] = React.useState<PublicJob[]>([]);
    const [filteredJobs, setFilteredJobs] = React.useState<PublicJob[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [locationFilter, setLocationFilter] = React.useState('');
    const [sidebarFilters, setSidebarFilters] = useState<{
        areas: string[];
        levels: string[];
        models: string[];
    }>({
        areas: [],
        levels: [],
        models: []
    });

    React.useEffect(() => {
        const data = StorageService.get<Job[]>(KEYS.JOBS) || [];
        const activeJobs = data
            .filter(j => j.status === 'Ativa')
            .map(mapJobToPublic);
        setAllJobs(activeJobs);
        setFilteredJobs(activeJobs);
        setIsLoading(false);
    }, []);

    const applyFilters = React.useCallback(() => {
        let results = [...allJobs];

        if (searchQuery) {
            results = results.filter(j =>
                j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (locationFilter) {
            results = results.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }

        if (sidebarFilters.areas.length > 0) {
            results = results.filter(j => sidebarFilters.areas.includes(j.department));
        }

        if (sidebarFilters.models.length > 0) {
            results = results.filter(j => sidebarFilters.models.some(m => j.tags.includes(m)));
        }

        setFilteredJobs(results);
    }, [allJobs, searchQuery, locationFilter, sidebarFilters]);

    React.useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleApply = (id: string) => {
        navigate(`/vagas/${id}/candidatar`);
    };

    const handleDetails = (id: string) => {
        navigate(`/vagas/${id}`);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setLocationFilter('');
        setSidebarFilters({ areas: [], levels: [], models: [] });
    };

    const handleSidebarFilterChange = (type: 'areas' | 'levels' | 'models', value: string) => {
        setSidebarFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    return (
        <div className="flex flex-col w-full bg-slate-50 transition-colors duration-200">
            <HeroSection />

            {/* Trust Bar */}
            <div className="w-full bg-slate-100 border-b border-slate-200 py-6 overflow-hidden">
                <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-sm font-semibold text-slate-500">Empresas do Grupo:</span>
                    <div className="flex flex-wrap justify-center gap-12 items-center">
                        <div className="flex items-center gap-2 font-semibold text-xl text-slate-800">INCI <span className="text-primary">Tech</span></div>
                        <div className="flex items-center gap-2 font-semibold text-xl text-slate-800">INCI <span className="text-primary">Edu</span></div>
                        <div className="flex items-center gap-2 font-semibold text-xl text-slate-800">INCI <span className="text-primary">Labs</span></div>
                        <div className="flex items-center gap-2 font-semibold text-xl text-slate-800">INCI <span className="text-primary">Brasil</span></div>
                    </div>
                </div>
            </div>

            <div className="layout-container flex h-full grow flex-col max-w-[1280px] mx-auto w-full px-4 lg:px-8 py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-8 px-2 text-xs font-semibold text-slate-400">
                    <Link className="hover:text-primary transition-colors" to="/vagas">Home</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-primary">Vagas disponíveis</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 relative items-start">
                    <JobFilterSidebar
                        filters={sidebarFilters}
                        onFilterChange={handleSidebarFilterChange}
                        onClear={handleClearFilters}
                        totalResults={filteredJobs.length}
                    />

                    <main className="flex-1 min-w-0">
                        {/* Search Area */}
                        <div className="mb-12 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col lg:flex-row w-full items-stretch border border-slate-200 bg-white rounded-xl overflow-hidden p-2 gap-2">
                                    <div className="flex-1 flex items-center px-4 h-12 lg:h-14 relative border border-slate-100 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 h-full text-sm ml-3 font-semibold focus:outline-none"
                                            name="q"
                                            placeholder="Cargo ou habilidade..."
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="lg:w-[280px] flex items-center px-4 h-12 lg:h-14 relative border border-slate-100 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">location_on</span>
                                        <select
                                            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-sm ml-2 cursor-pointer appearance-none font-semibold focus:outline-none"
                                            name="local"
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                        >
                                            <option value="">Qualquer lugar</option>
                                            <option value="Remoto">Remoto</option>
                                            <option value="Híbrido">Híbrido</option>
                                            <option value="Presencial">Presencial</option>
                                        </select>
                                        <span className="material-symbols-outlined text-slate-400 text-sm absolute right-4 pointer-events-none">expand_more</span>
                                    </div>
                                    <button className="flex-none h-12 lg:h-14 px-8 bg-primary text-white font-semibold text-xs hover:bg-slate-900 transition-colors rounded-lg active:scale-95" type="submit">
                                        Buscar
                                    </button>
                                </div>

                                {/* Active Filters */}
                                {(searchQuery || locationFilter || sidebarFilters.areas.length > 0 || sidebarFilters.models.length > 0) && (
                                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <span className="text-xs font-semibold text-slate-400 mr-2">Ativos:</span>
                                        {searchQuery && (
                                            <button onClick={() => setSearchQuery('')} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                Busca: {searchQuery}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        )}
                                        {locationFilter && (
                                            <button onClick={() => setLocationFilter('')} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                {locationFilter}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        )}
                                        <button onClick={handleClearFilters} className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors ml-2 border-b border-transparent hover:border-primary pb-px">Limpar tudo</button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <h2 className="text-slate-900 text-3xl font-semibold">
                                Oportunidades <span className="text-primary">abertas</span>
                            </h2>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                <span>{filteredJobs.length} Resultados</span>
                                <div className="h-4 w-px bg-slate-300"></div>
                                <select className="bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors text-slate-600 font-semibold">
                                    <option>Mais recentes</option>
                                    <option>Urgentes primeiro</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Grid - Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            {filteredJobs.map(job => (
                                <JobCardPublic
                                    key={job.id}
                                    job={job}
                                    onApply={handleApply}
                                    onDetails={handleDetails}
                                />
                            ))}

                            {/* No Results State */}
                            {filteredJobs.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 bg-slate-50 rounded-3xl animate-in fade-in zoom-in duration-500">
                                    <div className="size-20 bg-white border border-slate-200 flex items-center justify-center mb-6 rounded-full">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 font-semibold">rocket_launch</span>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">Sem vagas encontradas</h3>
                                    <p className="text-slate-500 text-base max-w-md mb-8 font-medium">Tente ajustar seus filtros ou mude sua busca para encontrar novas oportunidades.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                        <button onClick={handleClearFilters} className="h-14 px-8 border border-slate-300 bg-white text-slate-900 font-semibold text-xs hover:bg-slate-50 transition-colors rounded-xl active:scale-95">
                                            Limpar filtros
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredJobs.length > 0 && (
                            <nav className="flex justify-center items-center gap-2 mt-16 py-8 border-t border-slate-200">
                                <button className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors disabled:opacity-30 rounded-lg" disabled>
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="flex items-center justify-center size-12 bg-primary text-white font-semibold text-sm rounded-lg">1</button>
                                <button className="flex items-center justify-center size-12 border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-white hover:text-primary hover:border-primary transition-colors rounded-lg">2</button>
                                <button className="flex items-center justify-center size-12 border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-white hover:text-primary hover:border-primary transition-colors rounded-lg">3</button>
                                <span className="text-slate-300 font-semibold px-2">...</span>
                                <button className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors rounded-lg">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </nav>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
