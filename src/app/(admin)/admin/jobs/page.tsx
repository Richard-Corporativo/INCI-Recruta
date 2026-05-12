'use client';
import { Icon } from "@iconify/react";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import ConfirmationModal from '@src/components/shared/ConfirmationModal';
import { useJobs } from '@src/hooks/useJobs';
import { useAuth } from '@src/context/AuthContext';
import { useCandidates } from '@src/hooks/useCandidates';
import { useUsers } from '@src/hooks/useUsers';
import { useDebounce } from '@src/hooks/useDebounce';
import { useQuickView } from '@src/context/QuickViewContext';
import { formatDate } from '@src/lib/formatters';

const JobsPage: React.FC = () => {
    const router = useRouter();
    const { jobs, deleteJob, isLoading } = useJobs();
    const { candidates } = useCandidates();
    const { users } = useUsers();
    const { user } = useAuth();
    const { openQuickView } = useQuickView();

    const [jobToDelete, setJobToDelete] = useState<string | number | null>(null);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todas');
    const [managerFilter, setManagerFilter] = useState('all');

    const debouncedSearchTerm = useDebounce(searchInputValue, 300);

    const isAdmin = user?.role === 'admin' || user?.role === 'recruiter' || user?.role === 'quality';

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = !debouncedSearchTerm ||
                job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                job.department.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'Todas' || job.status === statusFilter;
            let matchesManager = true;
            if (!isAdmin) matchesManager = job.manager_id === user?.id;
            else if (managerFilter !== 'all') matchesManager = job.manager_id === managerFilter;
            return matchesSearch && matchesStatus && matchesManager;
        });
    }, [jobs, debouncedSearchTerm, statusFilter, managerFilter, isAdmin, user]);

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: 'Vagas' }]} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Hub de Oportunidades</h1>
                    <p className="text-sm text-muted-foreground mt-1">{filteredJobs.length} vagas encontradas</p>
                </div>
                <Link href="/admin/jobs/new" className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0">
                    <Icon icon="material-symbols:add-circle" className="size-5" />
                    Publicar vaga
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center flex-wrap">
                <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">Status</span>
                    {['Todas', 'Ativa', 'Pausada', 'Encerrada', 'Rascunho'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`h-8 px-3 rounded-2xl text-xs font-semibold transition-all ${
                                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
                            }`}>{s}</button>
                    ))}
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">Gestor</span>
                    <select value={managerFilter} onChange={e => setManagerFilter(e.target.value)}
                        className="h-8 px-3 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                        disabled={!isAdmin}>
                        <option value="all">Todos</option>
                        {users.filter(u => u.role === 'manager' || u.role === 'admin').map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-px h-6 bg-border" />
                <input type="text" placeholder="Buscar vaga..." value={searchInputValue} onChange={e => setSearchInputValue(e.target.value)}
                    className="h-8 px-3 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 w-48" />
            </div>

            {/* Grid de cards */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
                    <Icon icon="material-symbols:work" className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">Nenhuma vaga encontrada</h3>
                    <p className="text-sm text-muted-foreground mb-6">Ajuste os filtros ou crie uma nova vaga.</p>
                    <Link href="/admin/jobs/new" className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2">
                        <Icon icon="material-symbols:add" className="size-5" /> Criar vaga
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
                    {filteredJobs.map((job) => {
                        const jobCandidatesCount = candidates.filter(c => c.jobId?.toString() === job.id.toString()).length;
                        return (
                            <div key={job.id} role="listitem" onClick={() => router.push(`/admin/jobs/${job.id}/kanban`)}
                                className="bg-card border border-border rounded-2xl p-5 hover:bg-muted transition-colors cursor-pointer flex flex-col gap-3 group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{job.title}</h3>
                                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{job.department} / {job.location}</p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        <span className={`h-5 px-2 rounded text-[10px] font-semibold flex items-center border ${
                                            job.status === 'Ativa' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' :
                                            job.status === 'Pausada' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                                            job.status === 'Rascunho' ? 'bg-blue-500/10 text-blue-600 border-blue-200' :
                                            'bg-slate-500/10 text-slate-600 border-slate-200'
                                        }`}>{job.status}</span>
                                        <span className={`h-5 px-2 rounded text-[10px] font-semibold flex items-center border ${
                                            job.urgency === 'Alta' ? 'bg-red-500/10 text-red-600 border-red-200' :
                                            job.urgency === 'Média' ? 'bg-orange-500/10 text-orange-600 border-orange-200' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>{job.urgency}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-border/40">
                                    {job.location && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:location-on" className="size-3.5 text-primary/60" />
                                            {job.location}
                                        </div>
                                    )}
                                    {job.seniority && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:trending-up" className="size-3.5 text-primary/60" />
                                            {job.seniority}
                                        </div>
                                    )}
                                    {job.positions_count && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:group" className="size-3.5 text-primary/60" />
                                            {job.positions_count} {job.positions_count === 1 ? 'vaga' : 'vagas'}
                                        </div>
                                    )}
                                    {job.reports_to && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                            <Icon icon="material-symbols:supervisor-account" className="size-3.5 text-primary/60" />
                                            {job.reports_to}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/80">
                                        <Icon icon="material-symbols:people" className="size-3.5 text-primary/60" />
                                        {jobCandidatesCount} {jobCandidatesCount === 1 ? 'candidato' : 'candidatos'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 pt-2 border-t border-border mt-auto">
                                    <button onClick={e => { e.stopPropagation(); openQuickView('job', job); }}
                                        className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Visualizar">
                                        <Icon icon="material-symbols:visibility" className="size-4" />
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); router.push(`/admin/jobs/${job.id}/kanban`); }}
                                        className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Kanban">
                                        <Icon icon="material-symbols:view-kanban" className="size-4" />
                                    </button>
                                    <Link href={`/admin/jobs/${job.id}/edit`} onClick={e => e.stopPropagation()}
                                        className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                                        <Icon icon="material-symbols:edit" className="size-4" />
                                    </Link>
                                    <button onClick={e => { e.stopPropagation(); setJobToDelete(job.id); }}
                                        className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-error hover:bg-error/10 transition-colors ml-auto" title="Excluir">
                                        <Icon icon="material-symbols:delete" className="size-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!jobToDelete}
                onClose={() => setJobToDelete(null)}
                onConfirm={() => { if (jobToDelete) { deleteJob(jobToDelete); setJobToDelete(null); } }}
                title="Excluir Vaga"
                message="Tem certeza que deseja excluir esta vaga? Todos os dados associados serão removidos permanentemente."
                confirmLabel="Excluir Vaga"
                type="danger"
            />
        </div>
    );
};

export default JobsPage;
