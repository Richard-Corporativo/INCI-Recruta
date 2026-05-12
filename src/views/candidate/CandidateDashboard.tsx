'use client';

// @page CandidateDashboard | @tipo page-component | @versao 4.0.0
// > Dashboard candidato — Balha v10: grid 2-col cards, horizontal scroll ações, CTA sticky
// @calls useCandidateData, useNavigate

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@src/lib/router-compat';
import { useCandidateData } from '@src/hooks/useCandidateData';
import { useRecommendedJobs } from '@src/hooks/useRecommendedJobs';
import { useAuth } from '@src/context/AuthContext';
import { Skeleton } from '@src/components/atoms/Skeleton/Skeleton';
import { Icon } from "@iconify/react";
import RecommendedJobsBlock from '@src/components/candidate/RecommendedJobsBlock';
import { CandidateService } from '@src/services/candidate.service';
import { JobService } from '@src/services/job.service';
import { useToast } from '@src/components/ui/Toast';
import { formatDate } from '@src/lib/formatters';

const COMPLETENESS_FIELD_LABELS: Record<string, string> = {
    name: 'Nome completo',
    phone: 'Telefone',
    location: 'Cidade / UF',
    summary: 'Resumo profissional',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfólio',
    has_resume: 'Currículo (PDF)',
    avatar: 'Foto de perfil',
};

const COMPLETENESS_FIELD_ICONS: Record<string, string> = {
    phone: 'material-symbols:call',
    summary: 'material-symbols:description',
    linkedin: 'mdi:linkedin',
    github: 'mdi:github',
    portfolio: 'material-symbols:language',
    has_resume: 'material-symbols:picture-as-pdf',
    avatar: 'material-symbols:account-circle',
};

interface ProfileModalProps {
    completeness: number;
    missingFields: string[];
    onComplete: () => void;
    onDismiss: () => void;
}

const ProfileCompletenessModal: React.FC<ProfileModalProps> = ({ completeness, missingFields, onComplete, onDismiss }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Header: ícone + título + fechar na mesma linha */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-foreground leading-tight tracking-tight">Complete seu perfil</h2>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Candidatos com perfil completo têm mais chances de serem encontrados por recrutadores.</p>
                </div>
                <button onClick={onDismiss} className="size-8 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0">
                    <Icon icon="material-symbols:close" className="size-5" />
                </button>
            </div>

            {/* Barra de progresso */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Progresso</span>
                    <span className="text-sm font-bold text-primary tabular-nums">{completeness}%</span>
                </div>
                <div className="h-2 bg-border/40 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${completeness}%` }}
                    />
                </div>
            </div>

            {/* Campos faltando com scroll */}
            {missingFields.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Campos Pendentes</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        <div className="flex flex-wrap gap-2">
                            {missingFields.map(f => (
                                <div 
                                    key={f} 
                                    className="h-8 px-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-medium text-foreground/80 flex items-center gap-2 transition-all hover:bg-muted hover:border-border"
                                >
                                    {COMPLETENESS_FIELD_ICONS[f] && (
                                        <Icon icon={COMPLETENESS_FIELD_ICONS[f]} className="size-3.5 text-primary/70" />
                                    )}
                                    {COMPLETENESS_FIELD_LABELS[f] ?? f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={onComplete}
                    className="flex-1 h-10 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                    Completar Perfil
                </button>
                <button
                    onClick={onDismiss}
                    className="h-10 px-4 border border-border text-xs font-semibold text-muted-foreground rounded-xl hover:bg-muted transition-all duration-200 ease-in-out"
                >
                    Agora não
                </button>
            </div>
        </div>
    </div>
);

const CandidateDashboard: React.FC = () => {
    const { currentCandidate, isLoading, completeness } = useCandidateData();
    const { isAuthenticated } = useAuth();
    const { error } = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [showCompletenessModal, setShowCompletenessModal] = useState(false);

    const { recommendations, isLoading: isLoadingRecs } = useRecommendedJobs({
        candidate: currentCandidate,
        limit: 3,
    });

    const handleDownloadResume = async () => {
        if (!currentCandidate?.id) return;
        try {
            const result = await CandidateService.downloadResume(currentCandidate.id);
            if (result) {
                const url = URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                error('Currículo não encontrado.');
            }
        } catch (err) {
            console.error('Download error:', err);
            error('Erro ao baixar currículo.');
        }
    };

    useEffect(() => {
        if (currentCandidate && completeness < 100) {
            const seen = sessionStorage.getItem('profile_modal_seen');
            if (!seen) setShowCompletenessModal(true);
        }
    }, [currentCandidate, completeness]);

    const handleModalComplete = useCallback(() => {
        sessionStorage.setItem('profile_modal_seen', '1');
        setShowCompletenessModal(false);
        navigate('/candidate/settings');
    }, [navigate]);

    const handleModalDismiss = useCallback(() => {
        sessionStorage.setItem('profile_modal_seen', '1');
        setShowCompletenessModal(false);
    }, []);

    useEffect(() => {
        if (currentCandidate) {
            setFormData({
                name: currentCandidate.name,
                role: currentCandidate.role || 'Candidato',
                location: currentCandidate.location,
                email: currentCandidate.email,
                phone: currentCandidate.phone,
                summary: currentCandidate.summary || '',
                linkedin: currentCandidate.linkedin || '',
                github: currentCandidate.github || '',
                portfolio: currentCandidate.portfolio || '',
                resumeName: currentCandidate.resumeName || 'Nenhum currículo anexado',
                lastUpdate: formatDate(currentCandidate.applied_at, undefined, 'Sem atualização registrada'),
                pretension_min: currentCandidate.pretension_min,
                pretension_max: currentCandidate.pretension_max,
                availability: currentCandidate.availability
            });
        }
    }, [currentCandidate]);

    if (isLoading) return (
        <div className="w-full animate-pulse space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
            </div>
        </div>
    );

    // Só mostramos o estado "vazio" se não houver nenhum registro de candidato no banco
    if (!currentCandidate && !isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon icon="material-symbols:person-add-outline" className="size-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Seu perfil ainda não foi criado</h2>
                <p className="text-muted-foreground max-w-sm">
                    Complete suas informações para que recrutadores possam encontrar você e para se candidatar às melhores vagas.
                </p>
            </div>
            <button
                onClick={() => navigate('/candidate/settings')}
                className="h-12 px-8 bg-secondary text-secondary-foreground text-sm font-semibold rounded-md transition-all hover:bg-secondary/90 active:scale-[0.98] flex items-center gap-3"
            >
                <Icon icon="material-symbols:edit-square" className="size-5" />
                Configurar Meu Perfil
            </button>
        </div>
    );

    const links = [
        { name: 'LinkedIn', icon: 'mdi:linkedin', value: formData?.linkedin },
        { name: 'GitHub', icon: 'mdi:github', value: formData?.github },
        { name: 'Portfólio', icon: 'material-symbols:language', value: formData?.portfolio }
    ].filter(l => l.value);

    const missingFields = (['name', 'phone', 'location', 'summary', 'linkedin', 'github', 'portfolio', 'has_resume', 'avatar'] as const)
        .filter(f => !currentCandidate?.[f as keyof typeof currentCandidate]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8 relative">

            {showCompletenessModal && (
                <ProfileCompletenessModal
                    completeness={completeness}
                    missingFields={missingFields}
                    onComplete={handleModalComplete}
                    onDismiss={handleModalDismiss}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Portal de Vagas
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Meu Perfil
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visão consolidada para recrutadores.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/candidate/settings')}
                    className="h-12 px-8 bg-primary text-primary-foreground text-sm font-semibold rounded-md transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center gap-3 shrink-0"
                >
                    <Icon icon="material-symbols:edit-square" className="size-5" />
                    Completar Perfil
                </button>
            </div>

            {/* Completude — compact, minimalist & centralized */}
            {completeness < 100 && (
                <div className="flex justify-center -mt-1">
                    <div className="w-full max-w-lg bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold tabular-nums">{completeness}%</span>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-foreground">Perfil incompleto</p>
                                <p className="text-[10px] text-muted-foreground leading-tight">Melhore seu perfil para ter prioridade.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 grow max-w-[140px]">
                            <div className="flex-1 bg-border/40 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${completeness}%` }} />
                            </div>
                            <button 
                                onClick={() => navigate('/candidate/settings')}
                                className="text-[10px] font-bold text-primary hover:underline whitespace-nowrap"
                            >
                                Completar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid 2-col de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card: Identidade */}
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold shrink-0">
                            {(formData?.name || formData?.email || 'C').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h2 className="text-xl font-semibold text-foreground truncate">{formData?.name || formData?.email || 'Candidato'}</h2>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span>{formData?.role}</span>
                                {formData?.location && (
                                    <>
                                        <span className="size-1 rounded-full bg-border" />
                                        <span className="flex items-center gap-1">
                                            <Icon icon="material-symbols:location-on" className="size-3.5" />
                                            {formData?.location}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'E-mail', val: formData?.email, icon: 'mail' },
                            { label: 'Telefone', val: formData?.phone, icon: 'call' },
                            { label: 'Pretensão Salarial', val: formData?.pretension_min ? `R$ ${formData.pretension_min.toLocaleString()}${formData.pretension_max ? ` — R$ ${formData.pretension_max.toLocaleString()}` : ''}` : 'Não informada', icon: 'payments' },
                            { label: 'Disponibilidade', val: formData?.availability || 'Imediata', icon: 'event-available' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon icon={`material-symbols:${item.icon}`} className="size-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-semibold text-foreground truncate">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card: Resumo (accordion) */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowSummary(!showSummary)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Icon icon="material-symbols:article" className="size-5 text-secondary" />
                            <span className="text-sm font-semibold text-foreground">Sobre mim</span>
                        </div>
                        <Icon
                            icon="material-symbols:expand-more"
                            className={`size-5 text-muted-foreground transition-transform duration-200 ${showSummary ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {showSummary && (
                        <div className="px-6 pb-6 border-t border-border pt-4">
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {formData?.summary || 'Nenhuma biografia preenchida. Atualize seu perfil para aumentar a visibilidade com recrutadores.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Card: Links + Currículo */}
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4">
                    {/* CV */}
                    <div 
                        className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-lg transition-colors" 
                        onClick={handleDownloadResume}
                        title="Baixar currículo"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center">
                                <Icon icon="material-symbols:picture-as-pdf" className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{formData?.resumeName}</p>
                                <p className="text-[10px] text-muted-foreground">PDF</p>
                            </div>
                        </div>
                        <Icon icon="material-symbols:download" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Links sociais */}
                    {links.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                            {links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.value.startsWith('http') ? link.value : `https://${link.value}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-9 px-4 rounded-md border border-border bg-card flex items-center gap-2 text-[11px] font-semibold text-foreground hover:bg-muted transition-all"
                                >
                                    <Icon icon={link.icon} className="size-4" />
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Vagas recomendadas */}
            <RecommendedJobsBlock
                recommendations={recommendations}
                isLoading={isLoadingRecs}
                isAuthenticated={isAuthenticated}
                onJobClick={async (jobId) => {
                    const slug = await JobService.getCompanySlugForJob(jobId);
                    navigate(slug ? `/vagas/${slug}/${jobId}` : '/vagas');
                }}
            />

            {/* Horizontal scroll: Ações rápidas */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Ações rápidas</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
                    <button
                        onClick={() => navigate('/candidate/applications')}
                        className="snap-start shrink-0 min-w-[200px] bg-card border border-border rounded-lg p-5 flex items-center gap-4 hover:bg-muted transition-colors text-left"
                    >
                        <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:business-center" className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Minhas Candidaturas</p>
                            <p className="text-[10px] text-muted-foreground">Acompanhe seus processos</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/vagas')}
                        className="snap-start shrink-0 min-w-[200px] bg-card border border-border rounded-lg p-5 flex items-center gap-4 hover:bg-muted transition-colors text-left"
                    >
                        <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:search" className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Explorar Vagas</p>
                            <p className="text-[10px] text-muted-foreground">Encontre novas oportunidades</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/candidate/settings')}
                        className="snap-start shrink-0 min-w-[200px] bg-card border border-border rounded-lg p-5 flex items-center gap-4 hover:bg-muted transition-colors text-left"
                    >
                        <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:edit-square" className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Editar Perfil</p>
                            <p className="text-[10px] text-muted-foreground">Atualize seus dados</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
