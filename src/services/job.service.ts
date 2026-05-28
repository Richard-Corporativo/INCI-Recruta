// @component Job Service | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @component JobService | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @api getJobs(): Job[], getJobById(id), createJob(job), updateJob(id, updates), deleteJob(id), syncJobsByRole(id, updates), transitionStatus(id, status, user)
// @rule Transições seguem matriz: draft → published|pending_approval → published|approved → published → archived
// @rule Apenas owner/admin/quality podem aprovar e publicar vagas
// @calls audit.service.ts — log automático de transições
// @references types/index.ts — Job, User

// @component JobService | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @api getJobs(): Job[], getJobById(id): Job, createJob(job): Job, updateJob(id, updates): Job, deleteJob(id): bool, syncJobsByRole(roleId, updates): void, transitionStatus(jobId, nextStatus, user): Job
// @state workflow_status — draft → published|pending_approval → published|approved → published → archived
// @action logChange — registra auditoria em transições
// @rule Apenas owner/admin/quality podem aprovar e publicar vagas
// @calls src/services/audit.service.ts — log de transições
// @references src/types/index.ts — Job, User

import { supabase } from '@src/lib/supabase';
import { Job, User } from '@src/types';
import { AuditService } from '@src/services/audit.service';
import { getCurrentCompanyId } from '@src/lib/tenant';

const JOB_APPROVER_ROLES = ['owner', 'admin', 'quality'] as const;

const normalizeJobPayload = (job: Partial<Job>): Partial<Job> => {
    const normalized = { ...job };

    // Converte requirements de Array para String (banco espera TEXT)
    if (Array.isArray(normalized.requirements)) {
        normalized.requirements = normalized.requirements.join('\n');
    }

    // Garante que benefícios e novos campos JSONB sejam enviados corretamente
    const jsonFields: (keyof Job)[] = [
        'benefits',
        'requirements_technical',
        'requirements_behavioral',
        'kpis',
        'competencies',
        'sla_settings'
    ];

    jsonFields.forEach(field => {
        if (normalized[field] !== undefined) {
            normalized[field] = normalized[field] as any;
        }
    });

    // Trata datas vazias para evitar erro de formato no Postgres
    if (normalized.registration_deadline === '') {
        delete normalized.registration_deadline;
    }

    return normalized;
};

const PUBLIC_JOB_COLUMNS = 'id, job_number, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status, salary_min, salary_max, positions_count, requirements, experience_min, reports_to, context, mission, responsibilities, requirements_technical, requirements_behavioral, kpis, competencies, role_code, work_schedule';

export const JobService = {
    async getJobs(): Promise<Job[]> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) {
            console.warn('[JobService] getJobs: sem company_id — retornando lista vazia.');
            return [];
        }

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }

        return data as Job[];
    },

    /**
     * Busca apenas vagas ativas com colunas reduzidas para o portal público (Performance)
     * Inclui campos enriquecidos quando o schema real já tiver essas colunas.
     */
    async getPublicJobs(): Promise<Job[]> {
        const fullSelect = `${PUBLIC_JOB_COLUMNS}, company_id, company:companies!inner(name, slug, status)`;

        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('jobs')
            .select(fullSelect)
            .eq('status', 'Ativa')
            .in('company.status', ['active', 'trial'])
            .or(`registration_deadline.is.null,registration_deadline.gte.${today}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[JobService] Erro ao buscar vagas públicas:', error);
            return [];
        }

        const results = (data ?? []).map((job: any) => ({ 
            ...job, 
            company_slug: Array.isArray(job.company) ? job.company[0]?.slug : job.company?.slug,
            company_name: Array.isArray(job.company) ? job.company[0]?.name : job.company?.name
        })) as Job[];

        console.log(`[JobService] getPublicJobs retornou ${results.length} vagas.`);
        return results;
    },


    /**
     * Lista vagas ativas de uma empresa específica (landing /vagas/[slug]).
     * Depende de RLS: jobs.status='Ativa' + companies.status='active'.
     */
    async getPublicJobsByCompanySlug(slug: string): Promise<Job[]> {
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('slug', slug)
            .in('status', ['active', 'trial'])
            .maybeSingle();

        if (companyError || !company) {
            return [];
        }

        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('jobs')
            .select(`${PUBLIC_JOB_COLUMNS}, company_id, company:companies(name, slug, status)`)
            .eq('company_id', company.id)
            .eq('status', 'Ativa')
            .or(`registration_deadline.is.null,registration_deadline.gte.${today}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`[JobService] Erro ao buscar vagas da empresa ${slug}:`, error);
            return [];
        }

        return (data || []).map((job: any) => ({
            ...job,
            company_slug: Array.isArray(job.company) ? job.company[0]?.slug : job.company?.slug,
            company_name: Array.isArray(job.company) ? job.company[0]?.name : job.company?.name
        })) as Job[];
    },

    /**
     * Busca uma vaga específica garantindo que pertence à empresa do slug.
     * Retorna null se a vaga não existe ou pertence a outra empresa.
     */
    async getPublicJobByIdInCompany(slug: string, jobId: string): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select(`*, company:companies(name, slug, status)`)
            .eq('id', jobId)
            .eq('status', 'Ativa')
            .maybeSingle();

        if (error || !data) return null;

        const job = data as any;
        if (job.company?.slug !== slug) return null;

        const companyStatus = Array.isArray(job.company) ? job.company[0]?.status : job.company?.status;
        if (!companyStatus || !['active', 'trial'].includes(companyStatus)) return null;

        return {
            ...job,
            company_slug: Array.isArray(job.company) ? job.company[0]?.slug : job.company?.slug,
            company_name: Array.isArray(job.company) ? job.company[0]?.name : job.company?.name
        } as Job;
    },

    /**
     * Resolve o slug da empresa de uma vaga, para uso em navegação multi-tenant.
     */
    async getCompanySlugForJob(jobId: string | number): Promise<string | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select('company:companies(slug)')
            .eq('id', jobId)
            .maybeSingle();

        if (error || !data) return null;
        return ((data as any).company?.slug as string) ?? null;
    },

    async getJobById(id: string): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching job ${id}:`, error);
            return null;
        }

        return data as Job;
    },

    async createJob(job: Omit<Job, 'id' | 'created_at' | 'candidates_count'>): Promise<Job | null> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) {
            throw new Error('Usuário sem empresa vinculada não pode criar vagas.');
        }

        const payload = { ...normalizeJobPayload(job), company_id: companyId };

        const { data, error } = await supabase
            .from('jobs')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('[JobService] Error creating job:', error);
            throw error;
        }

        if (data) {
            await AuditService.logChange('JOB', data.id, `Vaga criada: ${data.title}`, null, data, 'job_management', data.id);
        }

        return data as Job;
    },

    async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
        const currentJob = await this.getJobById(id);
        const updatesWithRevision = normalizeJobPayload({
            ...updates,
            revision: (currentJob?.revision ?? 0) + 1
        });

        let { data, error } = await supabase
            .from('jobs')
            .update(updatesWithRevision)
            .eq('id', id)
            .select()
            .single();

        if (error?.code === 'PGRST204' && error.message.includes("'revision'")) {
            const { revision: _revision, ...updatesWithoutRevision } = updatesWithRevision;
            const retry = await supabase
                .from('jobs')
                .update(updatesWithoutRevision)
                .eq('id', id)
                .select()
                .single();

            data = retry.data;
            error = retry.error;
        }

        if (error) {
            console.error(`Error updating job ${id}:`, error);
            throw error;
        }

        if (data) {
            void AuditService.logChange('JOB', id, `Vaga atualizada`, null, updatesWithRevision, 'job_management', id).catch((auditError) => {
                console.warn('[JobService] Auditoria de atualização não bloqueante falhou:', auditError);
            });
        }

        return data as Job;
    },

    async deleteJob(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting job ${id}:`, error);
            return false;
        }

        await AuditService.logChange('JOB', id, `Vaga excluída`, { id }, null, 'job_management', id);
        return true;
    },
    async syncJobsByRole(roleId: string, updates: Partial<Job>): Promise<void> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) {
            console.warn('[JobService] syncJobsByRole: sem company_id — operação ignorada.');
            return;
        }

        const { error } = await supabase
            .from('jobs')
            .update(updates)
            .eq('role_id', roleId)
            .eq('company_id', companyId);

        if (error) {
            console.error('Error syncing jobs with role:', error);
        }
    },

    async transitionStatus(
        jobId: string,
        nextStatus: Job['workflow_status'],
        user: User
    ): Promise<Job | null> {
        const currentJob = await this.getJobById(jobId);
        if (!currentJob) throw new Error('Job not found');

        const currentStatus = currentJob.workflow_status || 'draft';

        const allowedTransitions: Record<string, string[]> = {
            'draft': ['published', 'pending_approval', 'archived'],
            'pending_approval': ['published', 'approved', 'draft', 'archived'],
            'approved': ['published', 'archived'],
            'published': ['archived'],
            'archived': ['draft']
        };

        if (!allowedTransitions[currentStatus]?.includes(nextStatus as string)) {
            throw new Error(`Transition from ${currentStatus} to ${nextStatus} not allowed.`);
        }

        const canApproveJob = JOB_APPROVER_ROLES.includes(user.role as typeof JOB_APPROVER_ROLES[number]);

        if ((nextStatus === 'approved' || nextStatus === 'published') && !canApproveJob) {
            throw new Error('Apenas Owner, Admin ou Qualidade podem aprovar e publicar vagas.');
        }

        const updates: Partial<Job> = { workflow_status: nextStatus };

        if (nextStatus === 'published') {
            updates.status = 'Ativa';
            updates.approval_status = 'Aprovado';
        } else if (nextStatus === 'pending_approval') {
            updates.approval_status = 'Pendente';
        } else if (nextStatus === 'approved') {
            updates.approval_status = 'Aprovado';
        } else if (nextStatus === 'archived') {
            updates.status = 'Encerrada';
        } else if (nextStatus === 'draft') {
            updates.status = 'Rascunho';
            updates.approval_status = 'Rascunho';
        }

        const updatesWithRevision = normalizeJobPayload({
            ...updates,
            revision: (currentJob.revision ?? 0) + 1
        });

        let { data: updatedJob, error } = await supabase
            .from('jobs')
            .update(updatesWithRevision)
            .eq('id', jobId)
            .select()
            .single();

        if (error?.code === 'PGRST204' && error.message.includes("'revision'")) {
            const { revision: _revision, ...updatesWithoutRevision } = updatesWithRevision;
            const retry = await supabase
                .from('jobs')
                .update(updatesWithoutRevision)
                .eq('id', jobId)
                .select()
                .single();

            updatedJob = retry.data;
            error = retry.error;
        }

        if (error) {
            console.error(`Error transitioning job ${jobId}:`, error);
            throw error;
        }

        if (updatedJob) {
            void AuditService.logChange(
                'JOB',
                jobId,
                `Workflow Transition: ${currentStatus} -> ${nextStatus}`,
                currentJob,
                updatedJob,
                'job_management',
                jobId
            ).catch((auditError) => {
                console.warn('[JobService] Auditoria de workflow não bloqueante falhou:', auditError);
            });
        }

        return updatedJob as Job | null;
    }
};
