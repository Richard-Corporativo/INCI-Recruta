import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import JobFilterSidebar from '../../components/candidate/JobFilterSidebar';
import JobCardPublic, { PublicJob } from '../../components/candidate/JobCardPublic';
import JobCardSkeleton from '../../components/candidate/JobCardSkeleton';

import { JobService } from '../../src/services/JobService';
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
    isNew: true, // Placeholder logic
    createdAt: job.created_at || new Date().toISOString()
});

const JOBS_PER_PAGE = 10;

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const [allJobs, setAllJobs] = React.useState<PublicJob[]>([]);
    const [rawJobs, setRawJobs] = React.useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = React.useState<PublicJob[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [locationFilter, setLocationFilter] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState<'recent' | 'urgent'>('recent');
    const [currentPage, setCurrentPage] = React.useState(1);
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


    React.useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const data = await JobService.getJobs();
            const activeJobs = data.filter(j => j.status === 'Ativa');
            setRawJobs(activeJobs);
            const publicJobs = activeJobs.map(mapJobToPublic);
            setAllJobs(publicJobs);
            setFilteredJobs(publicJobs);
            setIsLoading(false);
        };

        fetchJobs();
    }, []);

    // Calculate jobs posted today
    const jobsPostedToday = React.useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return rawJobs.filter(job => {
            if (!job.created_at) return false;
            const jobDate = new Date(job.created_at);
            jobDate.setHours(0, 0, 0, 0);
            return jobDate.getTime() === today.getTime();
        }).length;
    }, [rawJobs]);

    const applyFilters = React.useCallback(() => {
        let results = [...allJobs];

        // Search filter
        if (searchQuery) {
            results = results.filter(j =>
                j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Location filter
        if (locationFilter) {
            results = results.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }

        // Area/Department filter
        if (sidebarFilters.areas.length > 0) {
            results = results.filter(j => sidebarFilters.areas.includes(j.department));
        }

        // Model filter (Remoto, Híbrido, Presencial) - AND logic
        if (sidebarFilters.models.length > 0) {
            results = results.filter(j => sidebarFilters.models.some(m => j.tags.includes(m)));
        }

        // Contract filter (PJ, CLT) - AND logic, separate from model
        if (sidebarFilters.contracts.length > 0) {
            results = results.filter(j => sidebarFilters.contracts.some(c => j.tags.includes(c)));
        }

        // Sorting
        if (sortOrder === 'urgent') {
            results.sort((a, b) => {
                if (a.isUrgent && !b.isUrgent) return -1;
                if (!a.isUrgent && b.isUrgent) return 1;
                return 0;
            });
        } else {
            // Sort by most recent
            results.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        }

        setFilteredJobs(results);
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [allJobs, searchQuery, locationFilter, sidebarFilters, sortOrder]);

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
        setSidebarFilters({ areas: [], levels: [], models: [], contracts: [] });
        setSortOrder('recent');
    };

    const handleSidebarFilterChange = (type: 'areas' | 'levels' | 'models' | 'contracts', value: string) => {
        setSidebarFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage <= 3) {
                buttons.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                buttons.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                buttons.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return buttons;
    };

    return (
        <div className="flex flex-col w-full bg-slate-50 transition-colors duration-200">
            {/* Hero Section */}
            <section className="w-full bg-primary py-12 md:py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col gap-3 text-center md:text-left max-w-3xl">
                        <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                            <span className="text-xs font-bold text-white/80">
                                {jobsPostedToday > 0 ? `${jobsPostedToday} vaga${jobsPostedToday > 1 ? 's' : ''} disponível${jobsPostedToday > 1 ? 'eis' : ''} hoje` : 'Vagas disponíveis'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">Venha Construir o Futuro da Educação Conosco!</h1>
                        <p className="text-base text-white/90 font-regular leading-relaxed max-w-xl">Ambiente oficial de recrutamento. Acompanhe processos seletivos e novas oportunidades em tempo real.</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 text-white/90">
                        <div className="flex flex-col items-center md:items-end gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                            <span className="text-[10px] font-bold">Dados seguros</span>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-3xl">speed</span>
                            <span className="text-[10px] font-bold">Alta performance</span>
                        </div>
                    </div>
                </div>
            </section>

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
                <nav className="flex items-center gap-2 mb-8 px-2 text-xs font-semibold text-slate-400">
                    <Link className="hover:text-primary transition-colors" to="/vagas" data-discover="true">Home</Link>
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
                        <div className="mb-12 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col lg:flex-row w-full items-stretch border border-slate-200 bg-white rounded-xl overflow-hidden p-2 gap-2">
                                    <div className="flex-1 flex items-center px-4 h-12 lg:h-14 relative border border-slate-100 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 h-full text-sm ml-3 font-semibold focus:outline-none"
                                            placeholder="Cargo ou habilidade..."
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            name="q"
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
                                            <option value="Juazeiro do Norte">Juazeiro do Norte</option>
                                            <option value="Barbalha">Barbalha</option>
                                        </select>
                                        <span className="material-symbols-outlined text-slate-400 text-sm absolute right-4 pointer-events-none">expand_more</span>
                                    </div>
                                    <button className="flex-none h-12 lg:h-14 px-8 bg-primary text-white font-semibold text-xs hover:bg-slate-900 transition-colors rounded-lg active:scale-95" type="submit">Buscar</button>
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <h2 className="text-slate-900 text-3xl font-semibold">Oportunidades <span className="text-primary">abertas</span></h2>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                <span>{filteredJobs.length} Resultados</span>
                                <div className="h-4 w-px bg-slate-300"></div>
                                <select
                                    className="bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors text-slate-600 font-semibold"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'recent' | 'urgent')}
                                >
                                    <option value="recent">Mais recentes</option>
                                    <option value="urgent">Urgentes primeiro</option>
                                </select>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 gap-6">
                            {isLoading ? (
                                [1, 2, 3].map(i => <JobCardSkeleton key={i} />)
                            ) : paginatedJobs.length > 0 ? (
                                paginatedJobs.map(job => (
                                    <JobCardPublic
                                        key={job.id}
                                        job={job}
                                        onApply={handleApply}
                                        onDetails={handleDetails}
                                    />
                                ))
                            ) : (
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
                                        <button onClick={() => navigate('/talentos')} className="h-14 px-8 bg-primary text-white font-semibold text-xs hover:bg-slate-900 transition-all rounded-xl shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-lg">person_add</span>
                                            Candidatura Espontânea
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <nav className="flex justify-center items-center gap-2 mt-16 py-8 border-t border-slate-200">
                                <button
                                    className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                {renderPaginationButtons().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="text-slate-300 font-semibold px-2">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`flex items-center justify-center size-12 font-semibold text-sm rounded-lg transition-colors ${currentPage === page
                                                ? 'bg-primary text-white'
                                                : 'border border-slate-200 text-slate-600 hover:bg-white hover:text-primary hover:border-primary'
                                                }`}
                                            onClick={() => handlePageChange(page as number)}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}

                                <button
                                    className="flex items-center justify-center size-12 border border-slate-200 text-slate-400 hover:bg-white hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
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
