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
     */
    async getPublicJobs(): Promise<Job[]> {
        const { data, error } = await supabase
            .from('jobs')
            .select('id, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status')
            .eq('status', 'Ativa')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[JobService] Error fetching public jobs:', error);
            return [];
        }

        return data as Job[];
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
        const { data, error } = await supabase
            .from('jobs')
            .insert([job])
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
        const updatesWithRevision = {
            ...updates,
            revision: (currentJob?.revision ?? 0) + 1
        };

        const { data, error } = await supabase
            .from('jobs')
            .update(updatesWithRevision)
            .eq('id', id)
            .select()
            .single();

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
    async syncJobsByRole(roleId: string, updates: { title: string, department: string }): Promise<void> {
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


