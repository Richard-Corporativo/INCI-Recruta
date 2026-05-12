'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@src/components/ui/Toast';
import { getAllCandidatesCrossTenant, CandidateWithCompany } from '@src/services/super-admin.service';

const STATUS_MAP: Record<string, string> = {
    received: 'Inscrição', screening: 'Triagem', technical: 'Entrevista Téc.',
    hr_interview: 'Entrevista RH', manager_interview: 'Entrevista Gest.',
    finalist: 'Finalista', hired: 'Contratado', rejected: 'Reprovado',
};

export default function SuperAdminTalentBank() {
    const { error: toastError } = useToast();
    const [candidates, setCandidates] = useState<CandidateWithCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            setCandidates(await getAllCandidatesCrossTenant());
        } catch {
            toastError('Erro ao carregar candidatos.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(); }, [load]);

    const filtered = candidates.filter(c =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.role || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.company_name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Banco de Talentos</h1>
                <p className="text-sm text-muted-foreground mt-1">Todos os candidatos em todas as empresas da plataforma.</p>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, e-mail, cargo ou empresa..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                    />
                </div>
                <button onClick={load} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200">
                    <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                    Atualizar
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl h-48 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
                    <Icon icon="material-symbols:person-search-rounded" className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhum candidato encontrado.</p>
                </div>
            ) : (
                <>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        {filtered.length} candidato{filtered.length !== 1 ? 's' : ''}
                        {filtered.length !== candidates.length ? ` (de ${candidates.length})` : ''}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(c => (
                            <div key={c.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:bg-accent/20 transition-colors duration-150">
                                <div className="flex items-start gap-3">
                                    <div className={`size-10 rounded-2xl ${c.avatarColor || 'bg-primary/10'} ${c.textColor || 'text-primary'} flex items-center justify-center text-sm font-semibold shrink-0`}>
                                        {c.initials || c.name?.slice(0, 2).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                                        <p className="text-[11px] text-muted-foreground truncate">{c.role || 'Candidato'}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    {c.email && (
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <Icon icon="material-symbols:mail-outline-rounded" className="size-3.5 shrink-0" />
                                            <span className="truncate">{c.email}</span>
                                        </div>
                                    )}
                                    {c.location && (
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <Icon icon="material-symbols:location-on-outline-rounded" className="size-3.5 shrink-0" />
                                            <span className="truncate">{c.location}</span>
                                        </div>
                                    )}
                                </div>

                                {c.skills && c.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {c.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold text-muted-foreground border border-border/50">{skill}</span>
                                        ))}
                                        {c.skills.length > 3 && (
                                            <span className="text-[10px] text-muted-foreground font-semibold px-1">+{c.skills.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                                        c.columnId === 'hired' ? 'text-success' :
                                        c.columnId === 'rejected' ? 'text-destructive' : 'text-muted-foreground'
                                    }`}>{STATUS_MAP[c.columnId] || 'Disponível'}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50 truncate max-w-[100px]">{c.company_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
