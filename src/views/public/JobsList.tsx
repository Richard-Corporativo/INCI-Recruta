'use client';

// @page JobsList | @tipo page-component | @versao 1.1.0
// > Listagem pública de vagas — filtros, busca, paginação, apply
// @calls useJobs — fetch public, useNavigate — detail/apply

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from '@src/lib/router-compat';

import JobFilterConsole from '@src/components/public/JobFilterConsole';
import JobCardCompact from '@src/components/public/JobCardCompact';
import JobDetailView from '@src/components/public/JobDetailView';

import { JobService } from '@src/services/job.service';
import { CandidateService } from '@src/services/candidate.service';
import { Job } from '@src/types';
import { PublicJob } from '@src/components/public/JobCardPublic';
import { mapJobToDetail } from '@src/lib/job-helpers';
import { Icon } from "@iconify/react";
import { useAuth } from '@src/context/AuthContext';
import { useRecommendedJobs } from '@src/hooks/useRecommendedJobs';
import { analyticsService } from '@src/services/analytics.service';

const mapJobToPublic = (job: Job): PublicJob => {
    // Cálculo de 'isNew' (vagas criadas nos últimos 7 dias)
    // No servidor, usamos uma data fixa ou ignoramos para evitar mismatch
    const isNew = job.created_at 
        ? new Date(job.created_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
        : false;

    return {
        id: job.id.toString(),
        title: job.title,
        department: job.department,
        location: job.location,
        model: job.model,
        contract: job.contract,
        seniority: job.seniority || 'Não definida',
        tags: [job.model, job.contract].filter(Boolean),
        isUrgent: job.urgency === 'Alta',
        urgencyLevel: job.urgency,
        isPcd: Boolean(job.is_pcd ?? job.pcd ?? job.pcd_only ?? job.exclusive_pcd),
        isNew: isNew,
        createdAt: job.created_at,
        deadline: job.registration_deadline,
        status: job.status,
        rank: (job as any).rank
    };
};

const JOBS_PER_PAGE = 20;

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // State
    const [allJobs, setAllJobs] = useState<PublicJob[]>([]);
    const [rawJobs, setRawJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<PublicJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Selection
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedJobData, setSelectedJobData] = useState<any | null>(null);

    // Filters & Sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [sortOption, setSortOption] = useState<'recent' | 'deadline' | 'urgency'>('recent');
    const [sidebarFilters, setSidebarFilters] = useState<{
        areas: string[];
        levels: string[];
        models: string[];
        contracts: string[];
        urgencies: string[];
        pcd: string[];
    }>({
        areas: [],
        levels: [],
        models: [],
        contracts: [],
        urgencies: [],
        pcd: []
    });

    // Áreas únicas extraídas das vagas ativas — atualiza automaticamente quando novas vagas chegam
    const availableAreas = useMemo(() => {
        const areas = allJobs.map(j => j.department).filter(Boolean);
        return [...new Set(areas)].sort();
    }, [allJobs]);

    // Debounce: aplica a busca com 300ms de atraso para não filtrar a cada tecla
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery) {
                analyticsService.trackSearch(searchQuery, filteredJobs.length);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, filteredJobs.length]);

    // Initial Fetch
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                // Performance: busca apenas vagas ativas com colunas reduzidas
                const data = await JobService.getPublicJobs();
                const publicJobs = data.map(mapJobToPublic);

                setRawJobs(data);
                setAllJobs(publicJobs);
                setFilteredJobs(publicJobs);

                // Auto-select first job
                if (publicJobs.length > 0) {
                    setSelectedJobId(publicJobs[0].id);
                }

                // Track Landing View
                analyticsService.trackLandingView();
            } catch (error) {

                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Recomendações personalizadas (só para autenticados)
    const { recommendations } = useRecommendedJobs({
        limit: 3,
    });

    const handleSelectJob = (jobId: string) => {
        const found = allJobs.find(job => job.id === jobId);
        setSelectedJobId(jobId);
        if (found) analyticsService.trackJobClick(jobId, found.title);
    };

    // Fetch Details when Selection changes
    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedJobId) {
                setSelectedJobData(null);
                return;
            }
            setIsDetailLoading(true);
            try {
                const found = await JobService.getJobById(selectedJobId);
                if (found) {
                    setSelectedJobData(mapJobToDetail(found));
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setIsDetailLoading(false);
            }
        };
        fetchDetails();
    }, [selectedJobId]);

    // Filter Logic
    const applyFilters = useCallback(() => {
        let results = [...allJobs];

        // Text Search (usa debouncedSearch para não filtrar a cada tecla)
        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase();
            results = results.filter(j =>
                j.title.toLowerCase().includes(query) ||
                j.department.toLowerCase().includes(query)
            );
        }

        // Location Filter
        if (locationFilter) {
            results = results.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }

        // Sidebar Filters
        if (sidebarFilters.areas.length > 0) {
            results = results.filter(j => sidebarFilters.areas.includes(j.department));
        }
        if (sidebarFilters.levels.length > 0) {
            results = results.filter(j => sidebarFilters.levels.includes(j.seniority));
        }
        if (sidebarFilters.models.length > 0) {
            results = results.filter(j => sidebarFilters.models.includes(j.model));
        }
        if (sidebarFilters.contracts.length > 0) {
            results = results.filter(j => sidebarFilters.contracts.includes(j.contract));
        }
        if (sidebarFilters.urgencies.length > 0) {
            results = results.filter(j => j.urgencyLevel && sidebarFilters.urgencies.includes(j.urgencyLevel));
        }
        if (sidebarFilters.pcd.length > 0) {
            const showOnlyPcd = sidebarFilters.pcd.includes('Sim');
            const showOnlyNonPcd = sidebarFilters.pcd.includes('Não');
            
            if (showOnlyPcd && !showOnlyNonPcd) {
                results = results.filter(j => j.isPcd);
            } else if (!showOnlyPcd && showOnlyNonPcd) {
                results = results.filter(j => !j.isPcd);
            }
        }

        // Sorting
        results.sort((a, b) => {
            if (sortOption === 'deadline') {
                const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return dateA - dateB;
            }
            if (sortOption === 'urgency') {
                const urgencyWeight = { 'Alta': 3, 'Média': 2, 'Baixa': 1, undefined: 0 };
                return (urgencyWeight[b.urgencyLevel as keyof typeof urgencyWeight] || 0) -
                       (urgencyWeight[a.urgencyLevel as keyof typeof urgencyWeight] || 0);
            }
            // Default: Recent
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        // Merge Recommendations at the top if available
        if (isAuthenticated && recommendations.length > 0) {
            const recommendedIds = new Set(recommendations.map(r => r.job_id));
            const baseResults = results.filter(j => !recommendedIds.has(j.id));

            const mappedRecs = recommendations.map((r, idx) => {
                const originalJob = rawJobs.find(rj => rj.id === r.job_id);
                if (!originalJob) return null;
                return {
                    ...mapJobToPublic(originalJob),
                    rank: idx + 1
                };
            }).filter(Boolean) as PublicJob[];

            results = [...mappedRecs, ...baseResults];
        }

        setFilteredJobs(results);

        // Update selection if current selection is no longer in filtered results
        if (results.length > 0) {
            if (!selectedJobId || !results.some(j => j.id === selectedJobId)) {
                setSelectedJobId(results[0].id);
            }
        } else {
            setSelectedJobId(null);
        }
    }, [allJobs, rawJobs, recommendations, isAuthenticated, debouncedSearch, locationFilter, sidebarFilters, sortOption]);

    useEffect(() => { applyFilters(); }, [applyFilters]);

    // Handlers
    const handleClearFilters = () => {
        setSearchQuery('');
        setLocationFilter('');
        setSidebarFilters({ areas: [], levels: [], models: [], contracts: [], urgencies: [], pcd: [] });
    };

    const handleFilterChange = (type: 'areas' | 'levels' | 'models' | 'contracts' | 'urgencies' | 'pcd', value: string) => {
        setSidebarFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const handleApply = (id: string) => {
        analyticsService.trackApplicationStart(id);
        navigate(`/vagas/${id}/candidatar`);
    };

    if (!mounted) {
        return (
            <div className="flex flex-col w-full bg-background min-h-screen">
                <section className="w-full bg-[#3857EF] py-12 md:py-16 text-white border-b border-white/5">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-32 animate-pulse" />
                </section>
                <div className="max-w-7xl mx-auto w-full px-4 md:px-6 -mt-8 pb-16">
                     <div className="h-20 bg-muted/20 rounded-2xl animate-pulse mb-8" />
                     <div className="flex gap-8">
                        <aside className="w-[340px] space-y-4">
                            {[1,2,3].map(i => <div key={i} className="h-32 bg-muted/20 rounded-2xl animate-pulse" />)}
                        </aside>
                        <main className="flex-1 h-96 bg-muted/20 rounded-2xl animate-pulse" />
                     </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full bg-background antialiased font-sans">
            {/* Hero Section */}
            <section className="w-full bg-primary py-12 md:py-16 text-primary-foreground border-b border-primary-foreground/5">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
                        <div className="w-full lg:max-w-[65%] space-y-4 md:space-y-6">
                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
                                Sua <span className="text-primary-foreground/60 font-normal">Próxima</span>{' '}
                                <span className="text-primary-foreground font-bold">Oportunidade</span> começa aqui.
                            </h1>
                            <p className="text-sm md:text-lg text-primary-foreground/80 font-normal max-w-[560px] leading-relaxed">
                                Explore o ecossistema do INCI Recruta e descubra o próximo passo da sua jornada profissional.
                            </p>
                        </div>

                        <div className="w-full lg:w-auto flex flex-col gap-2 pt-12 lg:pt-0 border-t lg:border-t-0 border-primary-foreground/5">
                            <div className="flex items-center gap-4">
                                <div className="size-1.5 bg-primary-foreground/40 rounded-full" />
                                <span className="text-sm font-medium tracking-wide text-primary-foreground/80">Oportunidades</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-1.5 bg-primary-foreground/40 rounded-full" />
                                <span className="text-sm font-medium tracking-wide text-primary-foreground/80">Acompanhamento</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-1.5 bg-primary-foreground/40 rounded-full" />
                                <span className="text-sm font-medium tracking-wide text-primary-foreground/80">Crescimento</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <div className="max-w-7xl mx-auto w-full px-4 md:px-6 -mt-8 pb-16">

                {/* Filter Console */}
                <div id="jobs-list-content" className="mb-6 md:mb-8 relative z-20">
                    <JobFilterConsole
                        filters={sidebarFilters}
                        availableAreas={availableAreas}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        locationFilter={locationFilter}
                        onLocationChange={setLocationFilter}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    {/* Master: Job List Sidebar */}
                    <aside className="w-full lg:w-[340px] shrink-0 space-y-4 lg:sticky lg:top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1 custom-scrollbar">
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {filteredJobs.length} Oportunidades
                            </span>

                            <div className="flex items-center gap-2">
                                <Icon icon="material-symbols:sort" className="size-4 text-muted-foreground" />
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value as any)}
                                    className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-foreground outline-none cursor-pointer"
                                >
                                    <option value="recent">Recentes</option>
                                    <option value="deadline">Prazo</option>
                                    <option value="urgency">Urgência</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse border border-border" />
                                ))
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
                                    <JobCardCompact
                                        key={job.id}
                                        job={job}
                                        isSelected={selectedJobId === job.id}
                                        onSelect={handleSelectJob}
                                    />
                                ))
                            ) : (
                                <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Sem resultados</p>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Detail: Job Details Main */}
                    <main className="flex-1 min-w-0">
                        {isDetailLoading ? (
                            <div className="space-y-12 animate-pulse">
                                <div className="h-32 bg-muted/50 rounded-2xl border border-border" />
                                <div className="h-96 bg-muted/50 rounded-2xl border border-border" />
                            </div>
                        ) : (
                            <JobDetailView
                                job={selectedJobData}
                                onApply={handleApply}
                            />
                        )}
                    </main>
                </div>
            </div>


        </div>
    );
};

export default JobsList;
