'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { getAllJobsCrossTenant, JobWithCompany } from '@src/services/super-admin.service';

export default function SuperAdminJobs() {
    const { error: toastError } = useToast();
    const [jobs, setJobs] = useState<JobWithCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todas');

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            setJobs(await getAllJobsCrossTenant());
        } catch {
            toastError('Erro ao carregar vagas.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(); }, [load]);

    const filtered = jobs.filter(j => {
        const matchSearch = !search ||
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.department.toLowerCase().includes(search.toLowerCase()) ||
            j.company_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'Todas' || j.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusColors: Record<string, string> = {
        'Ativa': 'bg-success/10 text-success border-success/20',
        'Pausada': 'bg-warning/10 text-warning border-warning/20',
        'Rascunho': 'bg-primary/10 text-primary border-primary/20',
        'Encerrada': 'bg-muted text-muted-foreground border-border',
    };

    const urgencyColors: Record<string, string> = {
        'Alta': 'bg-destructive/10 text-destructive border-destructive/20',
        'Média': 'bg-warning/10 text-warning border-warning/20',
        'Baixa': 'bg-muted text-muted-foreground border-border',
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Hub de Oportunidades</h1>
                <p className="text-sm text-muted-foreground mt-1">Todas as vagas publicadas em todas as empresas.</p>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Buscar por título, departamento ou empresa..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                    />
                </div>
                <div className="flex gap-1">
                    {['Todas', 'Ativa', 'Pausada', 'Rascunho', 'Encerrada'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                                statusFilter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                            }`}>{s}</button>
                    ))}
                </div>
                <button onClick={load} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200">
                    <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                    Atualizar
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl h-44 animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
                    <Icon icon="material-symbols:description-outline-rounded" className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhuma vaga encontrada.</p>
                </div>
            ) : (
                <>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        {filtered.length} vaga{filtered.length !== 1 ? 's' : ''}
                        {filtered.length !== jobs.length ? ` (de ${jobs.length})` : ''}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(job => (
                            <div key={job.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:bg-accent/20 transition-colors duration-150">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{job.title}</p>
                                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{job.department}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <span className={`h-5 px-2 rounded text-[10px] font-semibold flex items-center border ${statusColors[job.status] ?? 'bg-muted text-muted-foreground border-border'}`}>
                                            {job.status}
                                        </span>
                                        <span className={`h-5 px-2 rounded text-[10px] font-semibold flex items-center border ${urgencyColors[job.urgency] ?? 'bg-muted text-muted-foreground border-border'}`}>
                                            {job.urgency}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                                    {job.location && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:location-on-rounded" className="size-3.5 text-primary/60" />
                                            {job.location}
                                        </div>
                                    )}
                                    {job.seniority && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:trending-up-rounded" className="size-3.5 text-primary/60" />
                                            {job.seniority}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                        <Icon icon="material-symbols:group-rounded" className="size-3.5 text-primary/60" />
                                        {job.candidates_count} candidato{job.candidates_count !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border mt-auto">
                                    <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50">{job.company_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
