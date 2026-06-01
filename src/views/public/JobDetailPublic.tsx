'use client';

// @page JobDetailPublic | @tipo page-component | @versao 1.0.0
// > Detalhes públicos da vaga — descrição, requisitos, botão candidatar
// @calls JobService — getPublicById, useParams — job id

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from '@src/lib/router-compat';
import { JobService } from '@src/services/job.service';
import { CandidateService } from '@src/services/candidate.service';
import { useAuth } from '@src/context/AuthContext';
import { Icon } from "@iconify/react";
import { analyticsService } from '@src/services/analytics.service';
import { formatDate } from '@src/lib/formatters';

import { mapJobToDetail, getBenefitColorClass } from '@src/lib/job-helpers';

const JobDetailPublic: React.FC = () => {
    const navigate = useNavigate();
    const { slug, id } = useParams() as { slug?: string; id?: string };
    const { user, isLoading: isAuthLoading } = useAuth();
    const [job, setJob] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [isCheckingApplication, setIsCheckingApplication] = useState(false);

    const handleApply = () => {
        if (id) analyticsService.trackApplicationStart(id);
        if (slug && id) navigate(`/vagas/${slug}/${id}/candidatar`);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = job?.title ?? 'Vaga';
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // user cancelled — do nothing
            }
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            if (!id || !slug) return;
            setIsLoading(true);
            const found = await JobService.getPublicJobByIdInCompany(slug, id);
            if (found) {
                setJob(mapJobToDetail(found));
            }
            setIsLoading(false);
        };
        fetchJob();
    }, [id, slug]);

    useEffect(() => {
        if (job?.id) {
            analyticsService.trackJobClick(job.id, job.title);
        }
    }, [job?.id]);

    useEffect(() => {
        const checkApplication = async () => {
            if (!user?.id || !id) {
                setHasApplied(false);
                setIsCheckingApplication(false);
                return;
            }
            setIsCheckingApplication(true);
            try {
                const applied = await CandidateService.hasApplied(user.id, id);
                setHasApplied(applied);
            } catch (error) {
                console.error('[JobDetailPublic] Error checking application status:', error);
                setHasApplied(false);
            } finally {
                setIsCheckingApplication(false);
            }
        };
        checkApplication();
    }, [user?.id, id]);


    const isButtonLoading = isAuthLoading || isCheckingApplication;

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#FAFAFA] text-[var(--foreground)] font-semibold uppercase tracking-widest text-[10px]">Carregando detalhes da oportunidade...</div>;
    if (!job) return (
        <div className="h-screen flex items-center justify-center flex-col gap-6 bg-[#FAFAFA]">
            <h2 className="text-3xl font-semibold tracking-tight uppercase text-[var(--foreground)]">Vaga não encontrada</h2>
            <button onClick={() => navigate(slug ? `/vagas/${slug}` : '/vagas')} className="h-12 px-8 bg-primary text-white font-semibold text-[10px] uppercase tracking-widest rounded-xl">Voltar para a listagem</button>
        </div>
    );

    return (
        <main className="flex-grow w-full bg-background antialiased pb-12">
            {/* Header - Balha DS v9.1 */}
            <div className="bg-primary text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex gap-1 text-[10px] text-white/70 mb-2">
                        <Link to={slug ? `/vagas/${slug}` : '/vagas'}>Vagas</Link>
                        <Icon icon="material-symbols:chevron-right" className="size-2" />
                        {job.area && <span>{job.area}</span>}
                    </nav>
                    <h1 className="text-lg font-semibold">{job.title}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Summary Info - Linear Document Style */}
                        <div className="bg-white border border-border rounded-2xl p-8 md:p-10 flex flex-wrap items-center gap-x-12 gap-y-8">
                            {[
                                { label: 'Localização', val: job.location, icon: 'location_on' },
                                { label: 'Modelo', val: job.model, icon: 'home_work' },
                                { label: 'Contrato', val: job.contract, icon: 'contract' },
                                { label: 'Nível', val: job.level, icon: 'trending_up' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        <Icon icon={`material-symbols:${item.icon}`} className="size-3.5 text-primary/40" />
                                        {item.label}
                                    </div>
                                    <p className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-tight">{item.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description Content */}
                        <div className="space-y-16 px-2">
                            {/* Mission/Context */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Contexto e Missão</h3>
                                    <div className="h-px flex-1 bg-border/60" />
                                </div>
                                <p className="text-lg font-medium text-[var(--foreground)]/80 leading-relaxed max-w-3xl">
                                    {job.mission}
                                </p>
                            </section>

                             {/* Requirements - Technical */}
                             {job.requirements_technical && job.requirements_technical.length > 0 && (
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Requisitos Necessários</h3>
                                        <div className="h-px flex-1 bg-border/60" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.requirements_technical.map((req: string, i: number) => (
                                            <div key={i} className="flex items-start gap-4 p-5 border border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                                <Icon icon="material-symbols:check-circle" className="text-primary size-5 mt-0.5" />
                                                <span className="text-[13px] font-semibold text-[var(--foreground)]/80 leading-tight">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                             )}

                             {/* Competencies */}
                             {job.competencies && job.competencies.length > 0 && (
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Competências Comportamentais e Habilidades</h3>
                                        <div className="h-px flex-1 bg-border/60" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {job.competencies.map((comp: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 p-5 border border-border rounded-xl bg-muted/10">
                                                <Icon icon="material-symbols:psychology" className="text-primary size-5" />
                                                <span className="text-[13px] font-semibold text-[var(--foreground)]/80 leading-tight">{comp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                             )}

                             {/* Requirements - Behavioral */}
                             {job.requirements_behavioral && job.requirements_behavioral.length > 0 && (
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Requisitos Desejáveis</h3>
                                        <div className="h-px flex-1 bg-border/60" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.requirements_behavioral.map((req: string, i: number) => (
                                            <div key={i} className="flex items-start gap-4 p-5 border border-border rounded-xl bg-muted/5">
                                                <Icon icon="material-symbols:verified" className="text-primary/60 size-5 mt-0.5" />
                                                <span className="text-[13px] font-semibold text-[var(--foreground)]/70 leading-tight">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                             )}

                             {/* KPIs */}
                             {job.kpis && job.kpis.length > 0 && (
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Indicadores de Desempenho (KPIs)</h3>
                                        <div className="h-px flex-1 bg-border/60" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {job.kpis.map((kpi: string, i: number) => (
                                            <div key={i} className="flex flex-col gap-2 p-6 border border-border rounded-2xl bg-primary/5">
                                                <div className="flex items-center gap-2">
                                                    <Icon icon="material-symbols:monitoring" className="text-primary size-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Indicador</span>
                                                </div>
                                                <span className="text-[14px] font-bold text-[var(--foreground)] leading-tight">{kpi}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                             )}

                            {/* Responsibilities */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-widest">Atividades</h3>
                                    <div className="h-px flex-1 bg-border/60" />
                                </div>
                                <div className="space-y-3">
                                    {job.responsibilities.map((item: string, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-5 bg-card border border-border rounded-xl group hover:border-primary/40 transition-all">
                                            <span className="text-sm font-semibold text-[var(--foreground)]/90 uppercase tracking-tight">{item}</span>
                                            <Icon icon="material-symbols:arrow-forward" className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sidebar Action Panel */}
                    <aside className="lg:col-span-4 sticky top-24 space-y-8">
                        <div className="bg-primary text-white p-10 rounded-2xl space-y-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Inscrições</p>
                                <h3 className="text-3xl font-semibold tracking-tight uppercase leading-none">Faça sua <br/> Candidatura.</h3>
                            </div>

                            <div className="space-y-4">
                                {isButtonLoading ? (
                                    <div className="w-full h-14 bg-white/10 text-white/40 font-semibold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-white/20 cursor-default">
                                        <Icon icon="material-symbols:hourglass-empty" className="size-5 animate-spin" />
                                        Verificando...
                                    </div>
                                ) : hasApplied ? (
                                    <div className="w-full h-14 bg-white/20 text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-white/30">
                                        <Icon icon="material-symbols:check-circle" className="size-5" />
                                        Candidatura enviada
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        className="w-full h-14 bg-white text-primary font-semibold text-[11px] uppercase tracking-widest rounded-xl transition-all hover:bg-white/90 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Candidatar-se agora
                                        <Icon icon="material-symbols:arrow-forward" className="size-5" />
                                    </button>
                                )}
                                <button onClick={handleShare} className="w-full h-14 bg-white/5 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2">
                                    <Icon icon="material-symbols:share" className="size-4" />
                                    Compartilhar vaga
                                </button>
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest">
                                    <span className="text-white/40">Publicada em</span>
                                    <span className="text-white">{job.publishedAt}</span>
                                </div>
                                {job.registrationDeadline && (
                                    <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest">
                                        <span className="text-white/40">Data Limite</span>
                                    <span className="text-white">{formatDate(job.registrationDeadline)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Benefits Panel */}
                        {job.benefits.length > 0 && (
                            <div className="bg-card border border-border p-8 rounded-2xl space-y-6">
                                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Benefícios</h4>
                                <div className="grid grid-cols-1 gap-4">
                                     {job.benefits.slice(0, 10).map((benefit: any, i: number) => {
                                        const colorClass = getBenefitColorClass(benefit.colorId);
                                        return (
                                            <div key={i} className="flex items-center gap-4 text-[11px] font-semibold text-[var(--foreground)] uppercase tracking-wide">
                                                <div className={`size-10 flex items-center justify-center rounded-lg border ${colorClass}`}>
                                                    <Icon icon={benefit.icon.includes(':') ? benefit.icon : `material-symbols:${benefit.icon}`} className="size-5" />
                                                </div>
                                                {benefit.title}
                                            </div>
                                        );
                                     })}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border p-6 z-[60]">
                {isButtonLoading ? (
                    <div className="w-full h-14 bg-muted text-muted-foreground font-semibold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-border cursor-default">
                        <Icon icon="material-symbols:hourglass-empty" className="size-5 animate-spin" />
                        Verificando...
                    </div>
                ) : hasApplied ? (
                    <div className="w-full h-14 bg-muted text-foreground font-semibold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-border">
                        <Icon icon="material-symbols:check-circle" className="size-5" />
                        Candidatura enviada
                    </div>
                ) : (
                    <button
                        onClick={handleApply}
                        className="w-full h-14 bg-primary text-white font-semibold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                    >
                        Candidatar-se agora
                        <Icon icon="material-symbols:arrow-forward" className="size-5" />
                    </button>
                )}
            </div>
        </main>
    );
};

export default JobDetailPublic;
