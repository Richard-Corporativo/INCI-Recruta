'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { getAllJobsCrossTenant, getAllCandidatesCrossTenant, JobWithCompany, CandidateWithCompany } from '@src/services/super-admin.service';

function StatCard({ icon, label, value, sub, color = 'primary' }: {
    icon: string; label: string; value: number | string; sub?: string; color?: string;
}) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
            <div className={`size-10 rounded-xl bg-${color}/10 flex items-center justify-center shrink-0`}>
                <Icon icon={icon} className={`size-5 text-${color}`} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight mt-0.5">{value}</p>
                {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
            </div>
        </div>
    );
}

export default function SuperAdminOverview() {
    const { error: toastError } = useToast();
    const [jobs, setJobs] = useState<JobWithCompany[]>([]);
    const [candidates, setCandidates] = useState<CandidateWithCompany[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const [jobsResult, candidatesResult] = await Promise.all([
                getAllJobsCrossTenant({ page: 1, pageSize: 500 }),
                getAllCandidatesCrossTenant({ page: 1, pageSize: 500 }),
            ]);
            setJobs(jobsResult.data);
            setTotalJobs(jobsResult.total);
            setCandidates(candidatesResult.data);
            setTotalCandidates(candidatesResult.total);
        } catch {
            toastError('Erro ao carregar analytics.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(); }, [load]);

    const activeJobs = jobs.filter(j => j.status === 'Ativa').length;
    const pausedJobs = jobs.filter(j => j.status === 'Pausada').length;
    const hiredCandidates = candidates.filter(c => c.columnId === 'hired').length;
    const conversionRate = totalCandidates > 0
        ? ((hiredCandidates / totalCandidates) * 100).toFixed(1)
        : '0.0';

    const jobsByCompany = jobs.reduce((acc: Record<string, { name: string; count: number; active: number }>, j) => {
        const key = j.company_id ?? 'unknown';
        if (!acc[key]) acc[key] = { name: j.company_name, count: 0, active: 0 };
        acc[key].count++;
        if (j.status === 'Ativa') acc[key].active++;
        return acc;
    }, {});

    const topCompanies = Object.values(jobsByCompany)
        .sort((a, b) => b.active - a.active)
        .slice(0, 8);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard Global</h1>
                <p className="text-sm text-muted-foreground mt-1">Analytics consolidado de todas as empresas na plataforma.</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 h-28 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="material-symbols:work-rounded" label="Total de Vagas" value={totalJobs} sub={`${activeJobs} ativas · ${pausedJobs} pausadas`} />
                    <StatCard icon="material-symbols:group-rounded" label="Candidaturas" value={totalCandidates} sub={`${hiredCandidates} contratados`} />
                    <StatCard icon="material-symbols:trending-up-rounded" label="Taxa de Conversão" value={`${conversionRate}%`} sub="candidatura → contratação" />
                    <StatCard icon="material-symbols:business-center-rounded" label="Empresas Ativas" value={topCompanies.length} sub="com pelo menos 1 vaga" />
                </div>
            )}

            {!isLoading && topCompanies.length > 0 && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="material-symbols:leaderboard-rounded" className="size-4 text-primary" />
                            </div>
                            <h2 className="text-sm font-semibold text-foreground">Empresas por Vagas Ativas</h2>
                        </div>
                        <button onClick={load} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200">
                            <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                            Atualizar
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-accent/30">
                                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Empresa</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vagas Ativas</th>
                                    <th className="text-center px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total de Vagas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {topCompanies.map((company, idx) => (
                                    <tr key={idx} className="hover:bg-accent/20 transition-colors duration-150">
                                        <td className="px-5 py-3 font-semibold text-foreground text-sm">{company.name}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 text-[10px] font-bold">
                                                {company.active}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center text-sm font-semibold text-foreground">{company.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isLoading && jobs.length > 0 && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon icon="material-symbols:pie-chart-outline-rounded" className="size-4 text-primary" />
                        </div>
                        <h2 className="text-sm font-semibold text-foreground">Distribuição de Status — Vagas</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Ativas', value: jobs.filter(j => j.status === 'Ativa').length, color: 'text-success bg-success/10 border-success/20' },
                            { label: 'Pausadas', value: jobs.filter(j => j.status === 'Pausada').length, color: 'text-warning bg-warning/10 border-warning/20' },
                            { label: 'Rascunhos', value: jobs.filter(j => j.status === 'Rascunho').length, color: 'text-primary bg-primary/10 border-primary/20' },
                            { label: 'Encerradas', value: jobs.filter(j => j.status === 'Encerrada').length, color: 'text-muted-foreground bg-muted border-border' },
                        ].map(item => (
                            <div key={item.label} className={`rounded-2xl border px-4 py-4 text-center ${item.color}`}>
                                <p className="text-3xl font-semibold">{item.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
