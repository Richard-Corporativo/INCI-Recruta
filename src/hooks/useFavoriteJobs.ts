// @hook useFavoriteJobs | @tipo hook | @versao 2.0.0
// > Gerencia vagas salvas pelo candidato — persiste no Supabase (candidate_saved_jobs)
// > com fallback para localStorage durante carregamento inicial
// @rule Só funciona para usuários autenticados
// @rule IDs são strings UUID das vagas

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { supabase } from '@src/lib/supabase';

export const useFavoriteJobs = () => {
    const { user, isAuthenticated } = useAuth();
    // Extrai apenas o ID para evitar re-renders causados por objeto user instável
    const userId = user?.id ?? null;

    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
    // Ref para evitar fetch duplicado durante montagem
    const fetchedForUser = useRef<string | null>(null);

    // Busca os favoritos do banco quando o userId muda
    useEffect(() => {
        // Se não há usuário ou já buscamos para este usuário, sai
        if (!userId) {
            setFavoriteIds([]);
            fetchedForUser.current = null;
            return;
        }
        if (fetchedForUser.current === userId) return;

        let cancelled = false;
        const fetchFavorites = async () => {
            setIsLoadingFavorites(true);
            try {
                const { data, error } = await supabase
                    .from('candidate_saved_jobs')
                    .select('job_id')
                    .eq('user_id', userId);

                if (cancelled) return;

                if (error) {
                    // Tabela pode ainda não existir: fallback para localStorage
                    console.warn('[useFavoriteJobs] Supabase error, using localStorage fallback:', error.message);
                    try {
                        const stored = localStorage.getItem(`saved_jobs_${userId}`);
                        setFavoriteIds(stored ? JSON.parse(stored) : []);
                    } catch {
                        setFavoriteIds([]);
                    }
                } else {
                    const ids = (data || []).map((row: { job_id: string }) => row.job_id);
                    setFavoriteIds(ids);
                    fetchedForUser.current = userId;
                }
            } catch (e) {
                if (!cancelled) {
                    console.error('[useFavoriteJobs] Erro ao buscar favoritos:', e);
                    setFavoriteIds([]);
                }
            } finally {
                if (!cancelled) setIsLoadingFavorites(false);
            }
        };

        fetchFavorites();
        return () => { cancelled = true; };
    }, [userId]); // Apenas userId como dependência — não o objeto user

    const toggleFavorite = useCallback(async (jobId: string) => {
        if (!userId) return;

        const isCurrentlyFav = favoriteIds.includes(jobId);

        // Optimistic update: atualiza UI imediatamente
        setFavoriteIds(prev =>
            isCurrentlyFav ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );

        try {
            if (isCurrentlyFav) {
                const { error } = await supabase
                    .from('candidate_saved_jobs')
                    .delete()
                    .eq('user_id', userId)
                    .eq('job_id', jobId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('candidate_saved_jobs')
                    .insert({ user_id: userId, job_id: jobId });

                if (error) throw error;
            }
        } catch (error) {
            console.error('[useFavoriteJobs] Erro ao salvar no banco, revertendo:', error);
            // Reverte o optimistic update em caso de erro
            setFavoriteIds(prev =>
                isCurrentlyFav ? [...prev, jobId] : prev.filter(id => id !== jobId)
            );
        }
    }, [userId, favoriteIds]);

    const isFavorite = useCallback((jobId: string) => favoriteIds.includes(jobId), [favoriteIds]);

    return { favoriteIds, toggleFavorite, isFavorite, isLoadingFavorites };
};
