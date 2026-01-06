import React, { useState, useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import { Candidate } from '../types';

const TalentBank: React.FC = () => {
    const { candidates, isLoading: candidatesLoading } = useCandidates();
    const { jobs } = useJobs();
    const [search, setSearch] = useState('');
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Deduplicate candidates by email, keeping only the most recent application
    const uniqueCandidates = useMemo(() => {
        const candidatesByEmail = new Map<string, Candidate>();

        candidates.forEach(candidate => {
            const existing = candidatesByEmail.get(candidate.email);
            if (!existing || new Date(candidate.applied_at || 0) > new Date(existing.applied_at || 0)) {
                candidatesByEmail.set(candidate.email, candidate);
            }
        });

        return Array.from(candidatesByEmail.values());
    }, [candidates]);

    const filteredCandidates = useMemo(() => {
        return uniqueCandidates.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.role && c.role.toLowerCase().includes(search.toLowerCase()))
        );
    }, [uniqueCandidates, search]);

    const handleOpenProfile = (id: string) => {
        setSelectedCandidateId(id);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden transition-colors">
            <header className="bg-card border-b border-border pt-8 pb-6 px-8 shrink-0 transition-colors">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4">
                        <Breadcrumbs items={[{ label: 'Banco de Talentos' }]} />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight transition-colors">Banco de Talentos</h1>
                            <p className="text-muted-foreground text-sm font-medium transition-colors">Visualize todos os profissionais cadastrados em sua rede.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email ou cargo..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-muted/50 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 hover:border-ring transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 bg-muted/20 transition-colors">
                <div className="max-w-7xl mx-auto">
                    {candidatesLoading ? (
                        <div className="text-center py-20 text-muted-foreground font-semibold">Carregando talentos...</div>
                    ) : filteredCandidates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCandidates.map((candidate) => {
                                const job = jobs.find(j => j.id.toString() === candidate.jobId?.toString());
                                return (
                                    <div
                                        key={candidate.id}
                                        onClick={() => handleOpenProfile(candidate.id)}
                                        className="group bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={`size-14 rounded-2xl ${candidate.avatarColor} ${candidate.textColor} flex items-center justify-center text-xl font-bold border-2 border-background ring-1 ring-border group-hover:scale-105 transition-transform`}>
                                                {candidate.initials}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">{candidate.name}</h3>
                                                <p className="text-xs font-semibold text-muted-foreground truncate transition-colors">{candidate.role || 'Candidato'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                <span className="truncate">{candidate.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                <span className="material-symbols-outlined text-[16px]">mail</span>
                                                <span className="truncate">{candidate.email}</span>
                                            </div>
                                            {candidate.summary && (
                                                <p className="text-[11px] text-muted-foreground/80 line-clamp-3 italic leading-relaxed pt-2 border-t border-border/50">
                                                    "{candidate.summary}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    {candidate.columnId === 'hired' ? 'Contratado' :
                                                        candidate.columnId === 'rejected' ? 'Reprovado' :
                                                            candidate.columnId === 'withdrawn' ? 'Desistência' : 'Em processo'}
                                                </span>
                                                {candidate.match && (
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                        {candidate.match} Match
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-semibold text-muted-foreground/60 transition-colors">
                                                {job ? `Vaga: ${job.title}` : 'Sem vaga ativa'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-lg p-16 text-center max-w-xl mx-auto shadow-sm">
                            <span className="material-symbols-outlined text-muted-foreground/30 text-6xl mb-6">person_search</span>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum talento encontrado</h3>
                            <p className="text-muted-foreground text-sm font-medium">Ajuste seus filtros de busca para encontrar profissionais.</p>
                            <button
                                onClick={() => setSearch('')}
                                className="mt-8 text-primary font-bold text-xs hover:underline flex items-center gap-2 mx-auto outline-none transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                                Limpar busca
                            </button>
                        </div>
                    )}
                </div>
            </main>

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
