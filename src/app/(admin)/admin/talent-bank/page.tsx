'use client';
import { Icon } from "@iconify/react";

import React, { useState, useMemo } from 'react';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useCandidates } from '@src/hooks/useCandidates';
import { useJobs } from '@src/hooks/useJobs';
import CandidateProfileDrawer from '@src/components/admin/kanban/CandidateProfileDrawer';
import { Candidate, Job } from '@src/types';
import AdvancedSearchFilters from '@src/components/admin/AdvancedSearchFilters';
import { CandidateService } from '@src/services/candidate.service';
import Toast from '@src/components/shared/Toast';

const TalentBankPage: React.FC = () => {
    const { candidates, isLoading: candidatesLoading, allSkills, allLocations, searchCandidates, refresh } = useCandidates();
    const { jobs } = useJobs();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isInviting, setIsInviting] = useState(false);
    const [inviteCandidate, setInviteCandidate] = useState<Candidate | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');

    const STATUS_MAP: Record<string, string> = {
        received: 'Inscrição', screening: 'Triagem', technical: 'Entrevista Téc.',
        hr_interview: 'Entrevista RH', manager_interview: 'Entrevista Gest.',
        finalist: 'Finalista', hired: 'Contratado', rejected: 'Reprovado'
    };


    const uniqueProfiles = useMemo(() => {
        const grouped = new Map<string, Candidate & { applications: Candidate[] }>();
        candidates.forEach((c: Candidate) => {
            const email = c.email?.toLowerCase().trim();
            if (!email) return;
            if (!grouped.has(email)) grouped.set(email, { ...c, applications: [c] });
            else {
                const existing = grouped.get(email)!;
                existing.applications.push(c);
                if (new Date(c.applied_at || 0) > new Date(existing.applied_at || 0)) {
                    const apps = existing.applications;
                    grouped.set(email, { ...c, applications: apps });
                }
            }
        });
        return Array.from(grouped.values());
    }, [candidates]);

    const handleOpenProfile = (id: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        setSelectedCandidateId(id);
        setIsDrawerOpen(true);
    };

    const handleInviteToJob = async () => {
        if (!inviteCandidate || !selectedJobId) return;
        setIsInviting(true);
        try {
            await CandidateService.updateCandidate(inviteCandidate.id, { jobId: selectedJobId, columnId: 'received' });
            setToast({ message: 'Candidato vinculado à vaga com sucesso!', type: 'success' });
            setInviteCandidate(null); setSelectedJobId(''); refresh();
        } catch { setToast({ message: 'Erro ao vincular candidato.', type: 'error' }); }
        finally { setIsInviting(false); }
    };

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: 'Banco de Talentos' }]} />
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">Banco de Talentos</h1>
                <p className="text-sm text-muted-foreground">Visualize e filtre profissionais em toda a sua rede.</p>
            </div>

            <AdvancedSearchFilters onSearch={searchCandidates} allSkills={allSkills} allLocations={allLocations} />

            {candidatesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm text-muted-foreground font-semibold">Consultando...</p>
                </div>
            ) : uniqueProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
                    {uniqueProfiles.map((candidate) => {
                        const activeJob = jobs.find(j => j.id.toString() === candidate.jobId?.toString());
                        return (
                            <div key={candidate.id} role="listitem"
                                onClick={(e) => handleOpenProfile(candidate.id, e)}
                                className="bg-card border border-border rounded-2xl p-5 hover:bg-muted transition-colors cursor-pointer flex flex-col gap-3 group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`size-10 rounded-2xl ${candidate.avatarColor || 'bg-foreground'} ${candidate.textColor || 'text-background'} flex items-center justify-center text-sm font-semibold shrink-0`}>
                                        {candidate.initials || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{candidate.name}</h3>
                                        <p className="text-[11px] text-muted-foreground truncate">{candidate.role || 'Profissional'}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <Icon icon="material-symbols:location-on" className="size-3.5 text-muted-foreground/60" />
                                        <span className="truncate">{candidate.location || 'Não informado'}</span>
                                    </div>
                                    {candidate.has_resume && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                                            <Icon icon="material-symbols:description" className="size-3.5" />CV
                                        </span>
                                    )}
                                </div>

                                {candidate.skills && candidate.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {candidate.skills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold text-muted-foreground border border-border/50">{skill}</span>
                                        ))}
                                        {candidate.skills.length > 3 && (
                                            <span className="text-[10px] text-muted-foreground font-semibold px-1">+{candidate.skills.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                                        candidate.columnId === 'hired' ? 'text-success' :
                                        candidate.columnId === 'rejected' ? 'text-error' : 'text-muted-foreground'
                                    }`}>{STATUS_MAP[candidate.columnId] || 'Disponível'}</span>
                                    <button onClick={() => setInviteCandidate(candidate)}
                                        className="size-8 rounded-2xl bg-primary/5 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                        title="Convidar para Vaga">
                                        <Icon icon="material-symbols:person-add" className="size-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center max-w-xl mx-auto">
                    <Icon icon="material-symbols:person-search" className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sem resultados</h3>
                    <p className="text-sm text-muted-foreground mb-6">Não encontramos talentos com estes critérios.</p>
                    <button onClick={() => refresh()} className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2">
                        <Icon icon="material-symbols:refresh" className="size-5" />Recarregar Página
                    </button>
                </div>
            )}

            {/* Modal Invite */}
            {inviteCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-foreground">Vincular a uma Vaga</h3>
                        <p className="text-xs text-muted-foreground">O candidato <strong>{inviteCandidate.name}</strong> será movido para o pipeline da vaga.</p>
                        <select value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}
                            className="w-full h-11 px-3 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="">Escolha uma vaga ativa...</option>
                            {jobs.filter((j: Job) => j.status === 'Ativa').map((j: Job) => (
                                <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setInviteCandidate(null)} className="h-10 px-5 rounded-2xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-all">Cancelar</button>
                            <button onClick={handleInviteToJob} disabled={!selectedJobId || isInviting}
                                className="h-10 px-5 rounded-2xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                                {isInviting ? 'Vinculando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedCandidateId && (
                <CandidateProfileDrawer isOpen={isDrawerOpen} candidateId={selectedCandidateId} onClose={() => setIsDrawerOpen(false)} />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default TalentBankPage;
