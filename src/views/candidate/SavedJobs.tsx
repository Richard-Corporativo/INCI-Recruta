'use client';

// @page SavedJobs | @tipo page-component | @versao 2.0.0
// > Vagas salvas pelo candidato — lidas diretamente do hook useFavoriteJobs (Supabase)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@src/lib/router-compat';
import { useFavoriteJobs } from '@src/hooks/useFavoriteJobs';
import { supabase } from '@src/lib/supabase';
import { JobService } from '@src/services/job.service';
import { Icon } from "@iconify/react";
import JobCardCompact from '@src/components/public/JobCardCompact';
import { Job } from '@src/types';
import { PublicJob } from '@src/components/public/JobCardPublic';
import { parseDate } from '@src/lib/formatters';

const mapJobToPublic = (job: Job): PublicJob => ({
    id: job.id.toString(),
    title: job.title,
    department: job.department?.trim() || 'Área não informada',
    location: job.location,
    model: job.model,
    contract: job.contract,
    seniority: job.seniority || 'Não definida',
    tags: [job.model, job.contract].filter(Boolean),
    isUrgent: job.urgency === 'Alta',
    urgencyLevel: job.urgency,
    isNew: (parseDate(job.created_at)?.getTime() ?? 0) > Date.now() - (7 * 24 * 60 * 60 * 1000),
    createdAt: job.created_at,
    deadline: job.registration_deadline,
    status: job.status
});

const SavedJobs: React.FC = () => {
    const navigate = useNavigate();
    const { favoriteIds, isLoadingFavorites } = useFavoriteJobs();

    const [savedJobs, setSavedJobs] = useState<PublicJob[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    // Guarda quais IDs já foram buscados para evitar refetch desnecessário
    const lastFetchedKey = useRef<string>('');

    useEffect(() => {
        // Ainda carregando os favoritos do banco → aguarda
        if (isLoadingFavorites) return;

        // Gera uma chave estável baseada nos IDs ordenados
        const currentKey = [...favoriteIds].sort().join(',');

        // Se os IDs não mudaram, não refaz o fetch
        if (currentKey === lastFetchedKey.current) return;
        lastFetchedKey.current = currentKey;

        // Se não há favoritos, limpa e sai
        if (favoriteIds.length === 0) {
            setSavedJobs([]);
            return;
        }

        let cancelled = false;
        const fetchJobs = async () => {
            setIsLoadingJobs(true);
            try {
                // Performance: busca SOMENTE as vagas pelos IDs salvos — sem getJobs() global
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .in('id', favoriteIds)
                    .eq('status', 'Ativa');

                if (cancelled) return;
                if (error) throw error;

                setSavedJobs((data || []).map(mapJobToPublic));
            } catch (error) {
                console.error('[SavedJobs] Erro ao buscar vagas salvas:', error);
            } finally {
                if (!cancelled) setIsLoadingJobs(false);
            }
        };

        fetchJobs();
        return () => { cancelled = true; };
    }, [favoriteIds, isLoadingFavorites]);


    const isLoading = isLoadingFavorites || isLoadingJobs;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8 relative max-w-3xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Portal de Vagas
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Vagas Favoritas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie as oportunidades que você marcou como interesse.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/vagas')}
                    className="h-12 px-8 bg-primary text-primary-foreground text-sm font-semibold rounded-md transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center gap-3 shrink-0"
                >
                    <Icon icon="material-symbols:search" className="size-5" />
                    Explorar Vagas
                </button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-muted/50 rounded-2xl border border-border animate-pulse" />
                        ))}
                    </div>
                ) : savedJobs.length > 0 ? (
                    <div className="grid gap-4">
                        {savedJobs.map(job => (
                            <JobCardCompact
                                key={job.id}
                                job={job}
                                isSelected={false}
                                onSelect={async (id) => {
                                    const slug = await JobService.getCompanySlugForJob(id);
                                    navigate(slug ? `/vagas/${slug}/${id}` : '/vagas');
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-border border-dashed bg-muted/10 rounded-3xl">

                        <h3 className="text-xl font-semibold tracking-tight mb-2">Nenhuma vaga salva.</h3>
                        <p className="text-muted-foreground text-[11px] max-w-xs font-semibold tracking-wide leading-relaxed">
                            Explore as oportunidades disponíveis e clique na estrela para guardar as que te interessam.
                        </p>
                        <button
                            onClick={() => navigate('/vagas')}
                            className="mt-8 h-11 px-8 bg-primary text-primary-foreground text-xs font-semibold tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95"
                        >
                            <i className="fa-duotone fa-solid fa-star" style={{ fontSize: '14px', color: 'var(--primary)', marginRight: '4px' }}></i>
                            Ver oportunidades
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
