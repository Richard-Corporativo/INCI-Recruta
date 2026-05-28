// @component RecommendationService | @tipo service | @versao 1.1.0
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
    experience_min: string | null;
    work_schedule: string | null;
    match_score: number;
    match_reasons: string[];
    job_number?: number;
}

export const RecommendationService = {
    /**
     * Retorna as vagas mais aderentes para o candidato logado.
     * @param userId    - UUID do usuário autenticado
     * @param companyId - UUID da empresa para isolamento multitenant (opcional)
     * @param limit     - Quantas vagas retornar (padrão: 3)
     */
    async getRecommendedJobs(userId: string, companyId?: string | null, limit = 3): Promise<RecommendedJob[]> {
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

            let results = data as RecommendedJob[];

            // Isolamento por tenant: se companyId fornecido, busca company_id de cada vaga e filtra
            if (companyId) {
                const jobIds = results.map(r => r.job_id);
                const { data: jobs } = await supabase
                    .from('jobs')
                    .select('id, company_id')
                    .in('id', jobIds);

                if (jobs && jobs.length > 0) {
                    const allowedIds = new Set(
                        jobs.filter(j => j.company_id === companyId).map(j => j.id)
                    );
                    results = results.filter(r => allowedIds.has(r.job_id));
                } else {
                    // Se não conseguiu verificar, retorna vazio por segurança
                    return [];
                }
            }

            // Ordena por score DESC, depois por data mais recente como desempate
            const sorted = results.sort((a, b) => {
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
     * @param companyId                - UUID da empresa para isolamento multitenant (opcional)
     * @param limit                    - Quantas vagas retornar (padrão: 3)
     * @param excludeUserApplicationsId - UUID do usuário para excluir vagas já candidatadas (opcional)
     */
    async getRecentJobs(companyId?: string | null, limit = 3, excludeUserApplicationsId?: string): Promise<RecommendedJob[]> {
        try {
            const today = new Date().toISOString().split('T')[0];
            let query = supabase
                .from('jobs')
                .select('id, title, department, location, model, contract, seniority, salary_min, salary_max, urgency, created_at, registration_deadline, company_id, experience_min, work_schedule')
                .eq('status', 'Ativa')
                .eq('workflow_status', 'published')
                .or(`registration_deadline.is.null,registration_deadline.gte.${today}`);

            if (companyId) {
                query = query.eq('company_id', companyId);
            }

            if (excludeUserApplicationsId) {
                // Busca IDs de vagas já candidatadas
                const { data: apps } = await supabase
                    .from('candidates')
                    .select('job_id')
                    .eq('user_id', excludeUserApplicationsId)
                    .not('job_id', 'is', null);

                if (apps && apps.length > 0) {
                    // Formato correto para PostgREST: array de UUIDs
                    const appliedIds = apps.map(a => a.job_id).filter(Boolean);
                    query = query.not('id', 'in', `(${appliedIds.join(',')})`);
                }
            }

            const { data, error } = await query
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
                experience_min: j.experience_min ?? null,
                work_schedule: j.work_schedule ?? null,
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
