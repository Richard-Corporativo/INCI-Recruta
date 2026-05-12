// @component RecommendationService | @tipo service | @versao 1.0.0
// > Busca recomendações de vagas via RPC determinística do Supabase
// @api getRecommendedJobs(userId) → RecommendedJob[] (top 3 por padrão)
// @rule Usa somente dados estruturados — zero LLM, zero PDF
// @rule Fallback para vagas recentes quando perfil sem dados suficientes
// @calls supabase.rpc('get_recommended_jobs_for_candidate')
// @references src/types/index.ts — Job

import { supabase } from '@src/lib/supabase';

export interface RecommendedJob {
    job_id: string;
    title: string;
    department: string;
    location: string;
    model: string;
    contract: string;
    seniority: string;
    salary_min: number | null;
    salary_max: number | null;
    urgency: string;
    created_at: string;
    registration_deadline: string | null;
    match_score: number;
    match_reasons: string[];
}

export const RecommendationService = {
    /**
     * Retorna as vagas mais aderentes para o candidato logado.
     * @param userId - UUID do usuário autenticado
     * @param limit  - Quantas vagas retornar (padrão: 3)
     */
    async getRecommendedJobs(userId: string, limit = 3): Promise<RecommendedJob[]> {
        try {
            const { data, error } = await supabase
                .rpc('get_recommended_jobs_for_candidate', { p_user_id: userId });

            if (error) {
                console.warn('[RecommendationService] Erro RPC, retornando vazio:', error.message);
                return [];
            }

            if (!data || data.length === 0) {
                return [];
            }

            // Ordena por score DESC, depois por data mais recente como desempate
            const sorted = (data as RecommendedJob[]).sort((a, b) => {
                if (b.match_score !== a.match_score) return b.match_score - a.match_score;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            return sorted.slice(0, limit);
        } catch (err) {
            console.error('[RecommendationService] Exceção inesperada:', err);
            return [];
        }
    },

    /**
     * Fallback: vagas ativas recentes quando candidato não tem perfil suficiente.
     * @param limit - Quantas vagas retornar (padrão: 3)
     */
    async getRecentJobs(limit = 3): Promise<RecommendedJob[]> {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('id, title, department, location, model, contract, seniority, salary_min, salary_max, urgency, created_at, registration_deadline')
                .eq('status', 'Ativa')
                .eq('workflow_status', 'published')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error || !data) return [];

            return data.map((j: any) => ({
                job_id: j.id.toString(),
                title: j.title,
                department: j.department,
                location: j.location,
                model: j.model,
                contract: j.contract,
                seniority: j.seniority || '',
                salary_min: j.salary_min,
                salary_max: j.salary_max,
                urgency: j.urgency,
                created_at: j.created_at,
                registration_deadline: j.registration_deadline ?? null,
                match_score: 0,
                match_reasons: [],
            }));
        } catch (err) {
            console.error('[RecommendationService] Erro no fallback:', err);
            return [];
        }
    },

    /**
     * Verifica se o candidato tem dados suficientes para recomendação.
     * Critério mínimo: ao menos skills OU localização preenchidos.
     */
    hasEnoughProfile(candidate: {
        skills?: string[];
        location?: string;
        availability?: string;
    }): boolean {
        const hasSkills = Array.isArray(candidate.skills) && candidate.skills.length > 0;
        const hasLocation = !!candidate.location && candidate.location.trim() !== '';
        return hasSkills || hasLocation;
    },
};
