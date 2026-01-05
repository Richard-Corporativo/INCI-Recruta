import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidateData } from '../../hooks/useCandidateData';
import { StorageService, KEYS } from '../../lib/storage';
import { Job } from '../../types';

const MyApplications: React.FC = () => {
    const navigate = useNavigate();
    const { myApplications, isLoading } = useCandidateData();

    const jobs = useMemo(() => StorageService.get<Job[]>(KEYS.JOBS) || [], []);

    const handleViewDetails = (id: string) => {
        navigate(`/candidate/applications/${id}`);
    };

    if (isLoading) return <div className="p-12 text-center text-xs font-semibold">Buscando candidaturas...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold text-foreground">Minhas candidaturas</h2>
                <p className="text-muted-foreground text-sm font-medium">Acompanhe seus processos seletivos e o status de cada vaga.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-card p-5 rounded-lg border border-border flex flex-col lg:flex-row gap-5 items-stretch transition-colors">
                {/* Search */}
                <div className="flex-1">
                    <label className="relative block w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </span>
                        <input
                            className="block w-full h-12 rounded-md border border-border bg-background pl-12 pr-4 text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring outline-none transition-all duration-200 hover:border-ring"
                            placeholder="Filtrar por cargo ou referência"
                            type="text"
                        />
                    </label>
                </div>
                {/* Filter Chips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    <button className="flex shrink-0 items-center justify-center gap-2 h-12 rounded-base border border-border bg-background px-6 text-xs font-semibold text-foreground hover:bg-accent transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        <span>Status</span>
                        <span className="material-symbols-outlined text-[18px] opacity-70">expand_more</span>
                    </button>
                    <button className="flex shrink-0 items-center justify-center gap-2 h-12 rounded-base border border-border bg-background px-6 text-xs font-semibold text-foreground hover:bg-accent transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>Período</span>
                        <span className="material-symbols-outlined text-[18px] opacity-70">expand_more</span>
                    </button>
                    <button className="flex shrink-0 items-center gap-1.5 px-3 text-[10px] font-semibold text-primary hover:bg-primary/5 transition-all ml-2 focus-visible:ring-2 focus-visible:ring-ring rounded-base outline-none h-12">
                        <span>Limpar tudo</span>
                    </button>
                </div>
            </div>

            {/* Application List */}
            <div className="flex flex-col gap-6">
                {myApplications.map((app) => {
                    const job = jobs.find(j => j.id.toString() === app.jobId?.toString());
                    const statusConfig: any = {
                        'received': { label: 'Em análise', color: 'bg-primary/10 text-primary', pulse: true },
                        'screening': { label: 'Triagem', color: 'bg-blue-100 text-blue-700', pulse: true },
                        'technical': { label: 'Teste técnico', color: 'bg-purple-100 text-purple-700' },
                        'hr_interview': { label: 'Entrevista RH', color: 'bg-amber-100 text-amber-700' },
                        'finalist': { label: 'Finalista', color: 'bg-green-100 text-green-700' },
                        'hired': { label: 'Contratado!', color: 'bg-green-600 text-white' },
                        'rejected': { label: 'Encerrado', color: 'bg-slate-100 text-slate-500' }
                    };
                    const config = statusConfig[app.columnId] || statusConfig.received;

                    return (
                        <div key={app.id} className="group bg-card text-card-foreground rounded-lg p-6 lg:p-8 border border-border hover:border-ring transition-all duration-300 ease-in-out">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Icon/Image */}
                                <div className="shrink-0 size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 transition-transform group-hover:scale-105">
                                    <span className="material-symbols-outlined text-3xl">
                                        {job?.department?.includes('Design') ? 'draw' :
                                            job?.department?.includes('Tech') ? 'code' : 'work'}
                                    </span>
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-border/50 pb-6 mb-6">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                {job?.title || 'Vaga indisponível'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                                                <span className="text-foreground">INCI Brasil</span>
                                                <span className="size-1 rounded-full bg-border"></span>
                                                <span>Ref: {app.jobId}</span>
                                                <span className="size-1 rounded-full bg-border"></span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    <span>{job?.location} ({job?.model})</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`inline-flex h-9 items-center gap-2 px-4 rounded-full ${config.color} text-[10px] font-semibold border border-black/5`}>
                                            {config.pulse && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                                </span>
                                            )}
                                            {config.label}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <p className="text-[10px] font-semibold text-muted-foreground">Enviada em {app.applied_at || 'Recente'}</p>
                                        <button
                                            onClick={() => handleViewDetails(app.id)}
                                            className="flex items-center justify-center w-full sm:w-auto h-11 px-8 rounded-base bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-semibold transition-all duration-200 border border-border/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                                        >
                                            Acompanhar processo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {myApplications.length === 0 && (
                    <div className="border-t-2 border-dashed border-border pt-12 mt-12 bg-muted/5 rounded-lg p-10 flex flex-col items-center">
                        <div className="flex flex-col items-center justify-center text-center max-w-lg">
                            <div className="bg-card border border-border size-20 rounded-lg flex items-center justify-center mb-8 text-primary">
                                <span className="material-symbols-outlined text-4xl">inbox</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground mb-4">Candidaturas vazias</h3>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-10">Você ainda não iniciou sua jornada conosco. Explore nossas vagas abertas e encontre o desafio ideal para sua carreira.</p>
                            <button
                                onClick={() => navigate('/vagas')}
                                className="flex items-center justify-center gap-3 h-12 px-10 rounded-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 border border-border/40"
                            >
                                Ver vagas abertas
                                <span className="material-symbols-outlined text-lg">east</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </div>
    );
};

export default MyApplications;
