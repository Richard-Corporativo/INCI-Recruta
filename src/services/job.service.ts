// @component Job Service | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @component JobService | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @api getJobs(): Job[], getJobById(id), createJob(job), updateJob(id, updates), deleteJob(id), syncJobsByRole(id, updates), transitionStatus(id, status, user)
// @rule Transições seguem matriz: draft → pending_approval → approved → published → archived
// @rule Apenas admin/quality podem aprovar vagas
// @calls audit.service.ts — log automático de transições
// @references types/index.ts — Job, User

// @component JobService | @tipo service | @versao 1.0.0
// > CRUD de vagas e transições de workflow com auditoria
// @api getJobs(): Job[], getJobById(id): Job, createJob(job): Job, updateJob(id, updates): Job, deleteJob(id): bool, syncJobsByRole(roleId, updates): void, transitionStatus(jobId, nextStatus, user): Job
// @state workflow_status — draft → pending_approval → approved → published → archived
// @action logChange — registra auditoria em transições
// @rule Apenas admin/quality podem aprovar vagas
// @calls src/services/audit.service.ts — log de transições
// @references src/types/index.ts — Job, User

import { supabase } from '@src/lib/supabase';
import { Job, User } from '@src/types';
import { AuditService } from '@src/services/audit.service';
import { getCurrentCompanyId } from '@src/lib/tenant';

const normalizeJobPayload = (job: Partial<Job>): Partial<Job> => ({
    ...job,
    requirements: Array.isArray(job.requirements) ? job.requirements : job.requirements,
    benefits: Array.isArray(job.benefits) ? job.benefits : job.benefits,
});

const PUBLIC_JOB_COLUMNS = 'id, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status, salary_min, salary_max, positions_count, requirements, experience_min, reports_to';
const PUBLIC_JOB_COLUMNS_WITH_PCD = `${PUBLIC_JOB_COLUMNS}, is_pcd`;

export const JobService = {
    async getJobs(): Promise<Job[]> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
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
        const fullSelect = 'id, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status, salary_min, salary_max, requirements, experience_min, reports_to, company_id, company:companies!inner(slug, status)';
        const basicSelect = 'id, title, department, location, model, contract, seniority, status, created_at, reports_to, company_id, company:companies!inner(slug, status)';

        const mapResults = (rows: any[]): Job[] =>
            rows
                .filter(r => r.company?.status === 'active')
                .map(({ company, ...rest }) => ({ ...rest, company_slug: company?.slug })) as Job[];

        let { data, error } = await supabase
            .from('jobs')
            .select(fullSelect)
            .eq('status', 'Ativa')
            .order('created_at', { ascending: false });

        // Se falhar (ex: coluna inexistente), tenta o fallback com colunas básicas
        if (error) {
            console.warn('[JobService] Erro na consulta completa de vagas (possível schema desatualizado), tentando fallback básico:', error.message);
            const retry = await supabase
                .from('jobs')
                .select(basicSelect)
                .eq('status', 'Ativa')
                .order('created_at', { ascending: false });

            if (retry.error) {
                console.error('[JobService] Erro crítico ao buscar vagas públicas:', retry.error);
                return [];
            }

            return mapResults(retry.data ?? []);
        }

        if (error) {
            console.error('[JobService] Erro crítico ao buscar vagas públicas:', error);
            return [];
        }

        return mapResults(data ?? []);
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
            .eq('status', 'active')
            .maybeSingle();

        if (companyError || !company) {
            return [];
        }

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('company_id', company.id)
            .eq('status', 'Ativa')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`[JobService] Erro ao buscar vagas da empresa ${slug}:`, error);
            return [];
        }

        return (data ?? []) as Job[];
    },

    /**
     * Busca uma vaga específica garantindo que pertence à empresa do slug.
     * Retorna null se a vaga não existe ou pertence a outra empresa.
     */
    async getPublicJobByIdInCompany(slug: string, jobId: string): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*, company:companies!inner(slug, status)')
            .eq('id', jobId)
            .eq('status', 'Ativa')
            .maybeSingle();

        if (error || !data) return null;

        const company = (data as any).company;
        if (!company || company.slug !== slug || company.status !== 'active') {
            return null;
        }

        const { company: _drop, ...job } = data as any;
        return job as Job;
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
            await AuditService.logChange('JOB', data.id, `Vaga criada: ${data.title}`, null, data);
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
            await AuditService.logChange('JOB', id, `Vaga atualizada`, null, updatesWithRevision);
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

        await AuditService.logChange('JOB', id, `Vaga excluída`, { id }, null);
        return true;
    },
    async syncJobsByRole(roleId: string, updates: Partial<Job>): Promise<void> {
        const { error } = await supabase
            .from('jobs')
            .update(updates)
            .eq('role_id', roleId);

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
            'draft': ['pending_approval', 'archived'],
            'pending_approval': ['approved', 'draft', 'archived'],
            'approved': ['published', 'archived'],
            'published': ['archived'],
            'archived': ['draft']
        };

        if (!allowedTransitions[currentStatus]?.includes(nextStatus as string)) {
            throw new Error(`Transition from ${currentStatus} to ${nextStatus} not allowed.`);
        }

        const isAdmin = ['admin', 'quality'].includes(user.role);

        if (nextStatus === 'approved' && !isAdmin) {
            throw new Error('Only Admin or Quality users can approve jobs.');
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

        const updatedJob = await this.updateJob(jobId, updates);

        if (updatedJob) {
            await AuditService.logChange(
                'job',
                jobId,
                `Workflow Transition: ${currentStatus} -> ${nextStatus}`,
                currentJob,
                updatedJob,
                'job_management'
            );
        }

        return updatedJob;
    }
};
