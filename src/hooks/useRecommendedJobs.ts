// @hook useRecommendedJobs | @tipo hook | @versao 1.0.0
// > Busca as 3 vagas mais aderentes ao candidato logado
// @rule Usa RPC determinística do Supabase — zero LLM
// @rule Fallback para vagas recentes quando perfil incompleto ou não logado
// @rule Candidato sem login recebe lista vazia (o componente decide o que exibir)
// @calls recommendation.service.ts

import { useState, useEffect } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { RecommendationService, RecommendedJob } from '@src/services/recommendation.service';
import { Candidate } from '@src/types';

interface UseRecommendedJobsOptions {
    /** Perfil do candidato atual (para checar se tem dados suficientes) */
    candidate?: Candidate | null;
    /** Quantas vagas retornar */
    limit?: number;
}

interface UseRecommendedJobsResult {
    recommendations: RecommendedJob[];
    isLoading: boolean;
    isFallback: boolean; // true = mostrando vagas recentes, não personalizadas
    hasEnoughProfile: boolean;
    refresh: () => void;
}

export const useRecommendedJobs = ({
    candidate,
    limit = 3,
}: UseRecommendedJobsOptions = {}): UseRecommendedJobsResult => {
    const { user, isAuthenticated } = useAuth();

    const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const [refreshToken, setRefreshToken] = useState(0);

    const hasEnoughProfile = candidate
        ? RecommendationService.hasEnoughProfile(candidate)
        : false;

    useEffect(() => {
        let cancelled = false;

        const fetch = async () => {
            setIsLoading(true);
            try {
                // Cenário 1: não autenticado → retorna vazio (JobsList usa vagas recentes)
                if (!isAuthenticated || !user?.id) {
                    if (!cancelled) {
                        setRecommendations([]);
                        setIsFallback(false);
                    }
                    return;
                }

                // Cenário 2: perfil insuficiente → sem recomendações (bloco fica oculto)
                if (!hasEnoughProfile) {
                    if (!cancelled) {
                        setRecommendations([]);
                        setIsFallback(false);
                    }
                    return;
                }

                // Cenário 3: autenticado + perfil suficiente → RPC personalizada
                const recs = await RecommendationService.getRecommendedJobs(user.id, null, limit);

                if (!cancelled) {
                    if (recs.length === 0) {
                        // RPC sem resultado → fallback
                        const recent = await RecommendationService.getRecentJobs(null, limit);
                        setRecommendations(recent);
                        setIsFallback(true);
                    } else {
                        setRecommendations(recs);
                        setIsFallback(false);
                    }
                }
            } catch (err) {
                console.error('[useRecommendedJobs] Erro:', err);
                if (!cancelled) {
                    setRecommendations([]);
                    setIsFallback(false);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetch();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user?.id, hasEnoughProfile, limit, refreshToken]);

    const refresh = () => setRefreshToken(t => t + 1);

    return { recommendations, isLoading, isFallback, hasEnoughProfile, refresh };
};
