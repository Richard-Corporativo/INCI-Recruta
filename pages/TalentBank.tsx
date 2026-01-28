import React, { useState, useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import { Candidate, Job } from '../types';
import AdvancedSearchFilters from '../components/AdvancedSearchFilters';
import { CandidateService } from '../src/services/CandidateService';
import { useToast } from '../components/ui/Toast';

const TalentBank: React.FC = () => {
    const { candidates, isLoading: candidatesLoading, searchCandidates, refresh } = useCandidates();
    const { jobs } = useJobs();
    const { success, error: showError } = useToast();

    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isInviting, setIsInviting] = useState(false);
    const [inviteCandidate, setInviteCandidate] = useState<Candidate | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');

    const STATUS_MAP: Record<string, string> = {
        received: 'Inscrição',
        screening: 'Triagem',
        technical: 'Entrevista Téc.',
        hr_interview: 'Entrevista RH',
        manager_interview: 'Entrevista Gest.',
        finalist: 'Finalista',
        hired: 'Contratado',
        rejected: 'Reprovado'
    };

    // Extract unique skills and locations for filter options
    const allSkills = useMemo(() => {
        const skillsSet = new Set<string>();
        candidates.forEach(c => {
            if (c.skills) c.skills.forEach(s => skillsSet.add(s));
        });
        return Array.from(skillsSet).sort();
    }, [candidates]);

    const allLocations = useMemo(() => {
        const locationsSet = new Set<string>();
        candidates.forEach(c => {
            if (c.location) locationsSet.add(c.location);
        });
        return Array.from(locationsSet).sort();
    }, [candidates]);

    // Group candidates by email to avoid duplicates in the "Talent Lake"
    const uniqueProfiles = useMemo(() => {
        const grouped = new Map<string, Candidate & { applications: Candidate[] }>();

        candidates.forEach(c => {
            const email = c.email?.toLowerCase().trim();
            if (!email) return;

            if (!grouped.has(email)) {
                grouped.set(email, { ...c, applications: [c] });
            } else {
                const existing = grouped.get(email)!;
                existing.applications.push(c);
                // Keep the most recent application as the main display
                if (new Date(c.applied_at || 0) > new Date(existing.applied_at || 0)) {
                    const apps = existing.applications;
                    grouped.set(email, { ...c, applications: apps });
                }
            }
        });

        return Array.from(grouped.values());
    }, [candidates]);

    const handleOpenProfile = (id: string, e: React.MouseEvent) => {
        // Prevent opening profile when clicking specific actions
        if ((e.target as HTMLElement).closest('button')) return;
        setSelectedCandidateId(id);
        setIsDrawerOpen(true);
    };

    const handleInviteToJob = async () => {
        if (!inviteCandidate || !selectedJobId) return;
        setIsInviting(true);
        try {
            await CandidateService.updateCandidate(inviteCandidate.id, { jobId: selectedJobId, columnId: 'received' });
            success(`Candidato vinculado à vaga com sucesso!`);
            setInviteCandidate(null);
            setSelectedJobId('');
            refresh();
        } catch (e) {
            showError('Erro ao vincular candidato.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleSearch = (filters: any) => {
        searchCandidates(filters);
    };

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden transition-colors">
            <header className="bg-card border-b border-border pt-8 pb-6 px-8 shrink-0 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4">
                        <Breadcrumbs items={[{ label: 'Banco de Talentos' }]} />
                    </div>
                    <div className="flex flex-col gap-6 mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight transition-colors">Banco de Talentos</h1>
                                <p className="text-muted-foreground text-sm font-medium transition-colors">Visualize e filtre profissionais em toda a sua rede.</p>
                            </div>
                        </div>

                        <AdvancedSearchFilters
                            onSearch={handleSearch}
                            allSkills={allSkills}
                            allLocations={allLocations}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 bg-muted/20 transition-colors custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {candidatesLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
                            <p className="text-muted-foreground font-semibold">Consultando motor de busca...</p>
                        </div>
                    ) : uniqueProfiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {uniqueProfiles.map((candidate) => {
                                const activeJob = jobs.find(j => j.id.toString() === candidate.jobId?.toString());
                                return (
                                    <div
                                        key={candidate.id}
                                        onClick={(e) => handleOpenProfile(candidate.id, e)}
                                        className="group bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300 relative flex flex-col"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`size-12 rounded-xl ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-lg font-bold border-2 border-background ring-1 ring-border group-hover:scale-105 transition-transform shrink-0`}>
                                                {candidate.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{candidate.name}</h3>
                                                <p className="text-[11px] font-bold text-muted-foreground truncate uppercase tracking-tight">{candidate.role || 'Profissional'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 mb-6">
                                            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                                <span className="material-symbols-outlined text-[16px] text-primary/60">location_on</span>
                                                <span className="truncate">{candidate.location || 'Não informado'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                                                {candidate.has_resume && (
                                                    <span className="flex items-center gap-1.5 text-primary font-bold">
                                                        <span className="material-symbols-outlined text-[16px]">description</span>
                                                        CV
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {candidate.skills && candidate.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {candidate.skills.slice(0, 3).map(skill => (
                                                    <span key={skill} className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold text-muted-foreground border border-border/50 uppercase">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {candidate.skills.length > 3 && (
                                                    <span className="text-[9px] text-muted-foreground font-bold px-1 uppercase tracking-tighter">+{candidate.skills.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${candidate.columnId === 'hired' ? 'text-emerald-600' :
                                                    candidate.columnId === 'rejected' ? 'text-red-600' :
                                                        'text-muted-foreground'
                                                    }`}>
                                                    {STATUS_MAP[candidate.columnId] || 'Disponível'}
                                                </span>
                                                <span className="text-[9px] font-medium text-muted-foreground/60 truncate max-w-[120px]">
                                                    {activeJob ? `Vaga: ${activeJob.title}` : 'Sem vaga ativa'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setInviteCandidate(candidate)}
                                                className="size-8 rounded-lg bg-primary/5 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="Convidar para Vaga"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-16 text-center max-w-xl mx-auto shadow-sm">
                            <div className="size-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-muted-foreground/30 text-4xl">person_search</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Sem resultados para a busca</h3>
                            <p className="text-muted-foreground text-sm font-medium">Não encontramos talentos com estes critérios específicos.</p>
                            <button
                                onClick={() => refresh()}
                                className="mt-8 bg-primary/10 text-primary px-6 py-2 rounded-base text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2 mx-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">refresh</span>
                                Resetar Banco
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Invite to Job Modal */}
            {inviteCandidate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setInviteCandidate(null)}></div>
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        <div className="p-6 border-b border-border bg-muted/30">
                            <h3 className="text-lg font-bold text-foreground">Vincular a uma Vaga</h3>
                            <p className="text-xs text-muted-foreground font-medium mt-1">
                                O candidato <strong>{inviteCandidate.name}</strong> será movido para o pipeline da vaga selecionada.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selecione a Vaga</label>
                                <select
                                    value={selectedJobId}
                                    onChange={(e) => setSelectedJobId(e.target.value)}
                                    className="h-11 w-full px-3 bg-muted/30 border border-border rounded-base text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Escolha uma vaga ativa...</option>
                                    {jobs.filter(j => j.status === 'Ativa').map(j => (
                                        <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setInviteCandidate(null)}
                                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleInviteToJob}
                                disabled={!selectedJobId || isInviting}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-base text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {isInviting ? 'Vinculando...' : 'Confirmar Vínculo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedCandidateId && (
                <CandidateProfileDrawer
                    isOpen={isDrawerOpen}
                    candidateId={selectedCandidateId}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}
        </div>
    );
};

export default TalentBank;
