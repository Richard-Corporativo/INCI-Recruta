'use client';

// @page JobsList | @tipo page-component | @versao 1.1.0
// > Listagem pública de vagas — filtros, busca, paginação, apply
// @calls useJobs — fetch public, useNavigate — detail/apply

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from '@src/lib/router-compat';

import JobFilterConsole from '@src/components/public/JobFilterConsole';
import JobCardCompact from '@src/components/public/JobCardCompact';
import JobDetailView from '@src/components/public/JobDetailView';

import { JobService } from '@src/services/job.service';
import { CompanyService } from '@src/services/company.service';
import { CandidateService } from '@src/services/candidate.service';
import { Job, Company } from '@src/types';
import { PublicJob } from '@src/components/public/JobCardPublic';
import { mapJobToDetail } from '@src/lib/job-helpers';
import { Icon } from "@iconify/react";
import { useAuth } from '@src/context/AuthContext';
import { useRecommendedJobs } from '@src/hooks/useRecommendedJobs';
import { analyticsService } from '@src/services/analytics.service';
import { parseDate } from '@src/lib/formatters';

const mapJobToPublic = (job: Job): PublicJob => {
    const isNew = job.created_at
        ? (parseDate(job.created_at)?.getTime() ?? 0) > Date.now() - (7 * 24 * 60 * 60 * 1000)
        : false;
    const department = (job.department?.trim() && job.department !== 'Geral') 
        ? job.department 
        : 'Área não informada';

    const requirements = Array.isArray(job.requirements)
        ? job.requirements
        : job.requirements ? [job.requirements] : undefined;

    return {
        id: job.id.toString(),
        title: job.title,
        department,
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
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        positionsCount: job.positions_count || (job as any).positions || 1,
        requirements: requirements,
        experienceMin: job.experience_min,
        reportsTo: job.reports_to,
        rank: (job as any).rank
    };
};

const JOBS_PER_PAGE = 20;

const JobsList: React.FC = () => {
    const navigate = useNavigate();
    const { user: _user, isAuthenticated } = useAuth();
    const { slug } = useParams() as { slug?: string };

    // State
    const [company, setCompany] = useState<Company | null>(null);
    const [companyNotFound, setCompanyNotFound] = useState(false);
    const [allJobs, setAllJobs] = useState<PublicJob[]>([]);
    const [rawJobs, setRawJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<PublicJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Selection
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedJobData, setSelectedJobData] = useState<any | null>(null);

    // Filters & Sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [otherAreaQuery, setOtherAreaQuery] = useState('');
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

    useEffect(() => {
        setMounted(true);
    }, []);

    const availableAreas = useMemo(() => {
        const areas = allJobs.map(j => j.department).filter(Boolean);
        return [...new Set(areas)].sort();
    }, [allJobs]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery) {
                analyticsService.trackSearch(searchQuery, filteredJobs.length);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, filteredJobs.length]);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                let data: Job[];
                if (slug) {
                    const comp = await CompanyService.getPublicCompanyBySlug(slug);
                    if (!comp) {
                        setCompanyNotFound(true);
                        setIsLoading(false);
                        return;
                    }
                    setCompany(comp);
                    data = await JobService.getPublicJobsByCompanySlug(slug);
                } else {
                    data = await JobService.getPublicJobs();
                }

                const publicJobs = data.map(mapJobToPublic);

                setRawJobs(data);
                setAllJobs(publicJobs);
                setFilteredJobs(publicJobs);

                if (publicJobs.length > 0) {
                    setSelectedJobId(publicJobs[0].id);
                }

                analyticsService.trackLandingView();
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [slug]);

    const { recommendations } = useRecommendedJobs({ limit: 3 });

    const handleSelectJob = (jobId: string) => {
        const found = allJobs.find(job => job.id === jobId);
        setSelectedJobId(jobId);
        if (found) analyticsService.trackJobClick(jobId, found.title);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedJobId) {
                setSelectedJobData(null);
                return;
            }
            setIsDetailLoading(true);
            try {
                const found = slug
                    ? await JobService.getPublicJobByIdInCompany(slug, selectedJobId)
                    : await JobService.getJobById(selectedJobId);
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
    }, [selectedJobId, slug]);

    const applyFilters = useCallback(() => {
        let results = [...allJobs];

        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase();
            results = results.filter(j =>
                j.title.toLowerCase().includes(query) ||
                j.department.toLowerCase().includes(query)
            );
        }

        if (locationFilter) {
            results = results.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }

        if (sidebarFilters.areas.length > 0) {
            results = results.filter(j => {
                if (sidebarFilters.areas.includes('Outro') && otherAreaQuery) {
                    const isOtherMatch = j.department.toLowerCase().includes(otherAreaQuery.toLowerCase());
                    if (sidebarFilters.areas.length === 1) return isOtherMatch;
                    const fixedAreas = sidebarFilters.areas.filter(a => a !== 'Outro');
                    return fixedAreas.includes(j.department) || isOtherMatch;
                }
                return sidebarFilters.areas.includes(j.department);
            });
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
            if (showOnlyPcd && !showOnlyNonPcd) results = results.filter(j => j.isPcd);
            else if (!showOnlyPcd && showOnlyNonPcd) results = results.filter(j => !j.isPcd);
        }

        results.sort((a, b) => {
            if (sortOption === 'deadline') {
                const dateA = parseDate(a.deadline)?.getTime() ?? Infinity;
                const dateB = parseDate(b.deadline)?.getTime() ?? Infinity;
                return dateA - dateB;
            }
            if (sortOption === 'urgency') {
                const urgencyWeight = { 'Alta': 3, 'Média': 2, 'Baixa': 1, undefined: 0 };
                return (urgencyWeight[b.urgencyLevel as keyof typeof urgencyWeight] || 0) -
                       (urgencyWeight[a.urgencyLevel as keyof typeof urgencyWeight] || 0);
            }
            const dateA = parseDate(a.createdAt)?.getTime() ?? 0;
            const dateB = parseDate(b.createdAt)?.getTime() ?? 0;
            return dateB - dateA;
        });

        if (isAuthenticated && recommendations.length > 0) {
            const recommendedIds = new Set(recommendations.map(r => r.job_id));
            const baseResults = results.filter(j => !recommendedIds.has(j.id));
            const mappedRecs = recommendations.map((r, idx) => {
                const originalJob = rawJobs.find(rj => rj.id === r.job_id);
                if (!originalJob) return null;
                return { ...mapJobToPublic(originalJob), rank: idx + 1 };
            }).filter(Boolean) as PublicJob[];
            results = [...mappedRecs, ...baseResults];
        }

        setFilteredJobs(results);

        if (results.length > 0) {
            if (!selectedJobId || !results.some(j => j.id === selectedJobId)) {
                setSelectedJobId(results[0].id);
            }
        } else {
            setSelectedJobId(null);
        }
    }, [allJobs, rawJobs, recommendations, isAuthenticated, debouncedSearch, locationFilter, sidebarFilters, otherAreaQuery, sortOption, selectedJobId]);

    useEffect(() => { applyFilters(); }, [applyFilters]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setLocationFilter('');
        setOtherAreaQuery('');
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
        if (slug) {
            navigate(`/vagas/${slug}/${id}/candidatar`);
            return;
        }
        const job = rawJobs.find(j => j.id.toString() === id);
        if (job?.company_slug) {
            navigate(`/vagas/${job.company_slug}/${id}/candidatar`);
        } else {
            console.warn('[JobsList] Vaga sem slug de empresa — não é possível candidatar.');
        }
    };

    if (companyNotFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
                <h2 className="text-3xl font-semibold tracking-tight uppercase text-foreground text-center">Empresa não encontrada</h2>
                <p className="text-sm text-muted-foreground text-center max-w-md">A página que você tentou acessar não existe ou a empresa está temporariamente indisponível.</p>
                <button onClick={() => navigate('/vagas')} className="h-12 px-8 bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-widest rounded-xl">
                    Ver todas as vagas
                </button>
            </div>
        );
    }

    if (!mounted) {
        return (
            <div className="flex flex-col w-full bg-background min-h-screen">
                <section className="w-full bg-primary py-12 md:py-16 text-primary-foreground border-b border-primary-foreground/5">
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
            <section
                className="w-full bg-primary py-12 md:py-16 text-primary-foreground border-b border-primary-foreground/5"
                style={company?.primary_color ? { backgroundColor: company.primary_color } : undefined}
            >
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
                        <div className="w-full lg:max-w-[65%] space-y-4 md:space-y-6">
                            {company && (
                                <div className="flex items-center gap-4 mb-2">
                                    {company.logo_url && (
                                        <img src={company.logo_url} alt={company.name} className="size-12 rounded-xl bg-white/10 object-contain p-2" />
                                    )}
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/70">
                                        Vagas em {company.name}
                                    </span>
                                </div>
                            )}
                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
                                Sua <span className="text-primary-foreground/60 font-normal">Próxima</span>{' '}
                                <span className="text-primary-foreground font-bold">Oportunidade</span> começa aqui.
                            </h1>
                            <p className="text-sm md:text-lg text-primary-foreground/80 font-normal max-w-[560px] leading-relaxed">
                                {company
                                    ? `Conheça as oportunidades abertas na ${company.name}.`
                                    : 'Explore o ecossistema do INCI Recruta e descubra o próximo passo da sua jornada profissional.'}
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
                        otherAreaQuery={otherAreaQuery}
                        onOtherAreaQueryChange={setOtherAreaQuery}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
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
