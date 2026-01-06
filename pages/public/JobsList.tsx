import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../../components/candidate/HeroSection';
import JobFilterSidebar from '../../components/candidate/JobFilterSidebar';
import JobCardPublic, { PublicJob } from '../../components/candidate/JobCardPublic';

import { JobService } from '../../src/services/JobService';
import { Job } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useCandidateData } from '../../hooks/useCandidateData';

// Helper to map Job to JobCardPublic format if they differ slightly
const mapJobToPublic = (job: Job): PublicJob => {
    const createdAt = new Date(job.created_at);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return {
        id: job.id.toString(),
        title: job.title,
        department: `${job.department}`,
        location: `${job.location} (${job.model})`,
        type: job.contract,
        level: job.seniority || 'Sênior',
        tags: [job.model, job.contract].filter(Boolean),
        isUrgent: job.urgency === 'Alta',
        isNew: diffDays <= 7 // Only mark as new if created in the last 7 days
    };
};

const JobsList: React.FC = () => {
    const { user: authUser } = useAuth();
    const { myApplications, withdrawApplication } = useCandidateData();
    const navigate = useNavigate();
    const [allJobs, setAllJobs] = useState<PublicJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<PublicJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [sidebarFilters, setSidebarFilters] = useState<{
        areas: string[];
        levels: string[];
        models: string[];
        contracts: string[];
    }>({
        areas: [],
        levels: [],
        models: [],
        contracts: []
    });

    const [sortBy, setSortBy] = useState<'recent' | 'urgent'>('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isWithdrawing, setIsWithdrawing] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const data = await JobService.getJobs();
            const activeJobs = data
                .filter(j => j.status === 'Ativa')
                .map(mapJobToPublic);
            setAllJobs(activeJobs);
            setFilteredJobs(activeJobs);
            setIsLoading(false);
        };

        fetchJobs();
    }, []);

    // Dynamic lists derived from data
    const availableAreas = Array.from(new Set(allJobs.map(j => j.department))).sort();
    const availableLocations = Array.from(new Set(allJobs.map(j => j.location.split(' (')[0]))).sort();

    const applyFilters = useCallback(() => {
        let results = [...allJobs];

        // Search Query
        if (searchQuery) {
            results = results.filter(j =>
                j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Location Filter
        if (locationFilter) {
            results = results.filter(j => j.location.split(' (')[0] === locationFilter);
        }

        // Sidebar: Areas
        if (sidebarFilters.areas.length > 0) {
            results = results.filter(j => sidebarFilters.areas.includes(j.department));
        }

        // Sidebar: Levels (Seniority)
        if (sidebarFilters.levels.length > 0) {
            results = results.filter(j => sidebarFilters.levels.includes(j.level));
        }

        // Sidebar: Models (Modality)
        if (sidebarFilters.models.length > 0) {
            results = results.filter(j => sidebarFilters.models.some(m => j.location.includes(m)));
        }

        // Sidebar: Contracts
        if (sidebarFilters.contracts.length > 0) {
            results = results.filter(j => sidebarFilters.contracts.includes(j.type));
        }

        // Sorting
        if (sortBy === 'urgent') {
            results.sort((a, b) => {
                if (a.isUrgent && !b.isUrgent) return -1;
                if (!a.isUrgent && b.isUrgent) return 1;
                return 0;
            });
        }

        setFilteredJobs(results);
        setCurrentPage(1); // Reset to first page on filter change
    }, [allJobs, searchQuery, locationFilter, sidebarFilters, sortBy]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleApply = (id: string) => {
        navigate(`/vagas/${id}/candidatar`);
    };

    const handleDetails = (id: string) => {
        navigate(`/vagas/${id}`);
    };

    const handleWithdraw = async (jobId: string) => {
        const app = myApplications.find(a => a.jobId?.toString() === jobId.toString());
        if (!app?.id) return;

        setIsWithdrawing(jobId);
        try {
            await withdrawApplication(app.id);
        } catch (err) {
            console.error(err);
        } finally {
            setIsWithdrawing(null);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setLocationFilter('');
        setSidebarFilters({ areas: [], levels: [], models: [], contracts: [] });
    };

    const handleSidebarFilterChange = (type: keyof typeof sidebarFilters, value: string) => {
        setSidebarFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    // Pagination Slices
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                        availableAreas={availableAreas}
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
                                            {availableLocations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined text-slate-400 text-sm absolute right-4 pointer-events-none">expand_more</span>
                                    </div>
                                    <button className="flex-none h-12 lg:h-14 px-8 bg-primary text-white font-semibold text-xs hover:bg-slate-900 transition-colors rounded-lg active:scale-95" type="submit">
                                        Buscar
                                    </button>
                                </div>

                                {/* Active Filters */}
                                {(searchQuery || locationFilter || sidebarFilters.areas.length > 0 || sidebarFilters.levels.length > 0 || sidebarFilters.models.length > 0 || sidebarFilters.contracts.length > 0) && (
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
                                                Local: {locationFilter}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        )}
                                        {sidebarFilters.areas.map(area => (
                                            <button key={area} onClick={() => handleSidebarFilterChange('areas', area)} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                {area}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        ))}
                                        {sidebarFilters.levels.map(lvl => (
                                            <button key={lvl} onClick={() => handleSidebarFilterChange('levels', lvl)} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                {lvl}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        ))}
                                        {sidebarFilters.models.map(model => (
                                            <button key={model} onClick={() => handleSidebarFilterChange('models', model)} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                {model}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        ))}
                                        {sidebarFilters.contracts.map(contract => (
                                            <button key={contract} onClick={() => handleSidebarFilterChange('contracts', contract)} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                                                {contract}
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        ))}
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
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors text-slate-600 font-semibold outline-none"
                                >
                                    <option value="recent">Mais recentes</option>
                                    <option value="urgent">Urgentes primeiro</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Grid - Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            {displayedJobs.map(job => (
                                <JobCardPublic
                                    key={job.id}
                                    job={job}
                                    onApply={handleApply}
                                    onDetails={handleDetails}
                                    hasApplied={authUser ? myApplications.some(app => app.jobId?.toString() === job.id.toString()) : false}
                                    onWithdraw={handleWithdraw}
                                    isWithdrawing={isWithdrawing === job.id}
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
                        {totalPages > 1 && (
                            <nav className="flex justify-center items-center gap-2 mt-16 py-8 border-t border-slate-200">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors disabled:opacity-30 rounded-lg"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`flex items-center justify-center size-12 font-semibold text-sm rounded-lg transition-all ${currentPage === page
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'border border-slate-200 text-slate-600 hover:bg-white hover:text-primary hover:border-primary'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors disabled:opacity-30 rounded-lg"
                                >
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
