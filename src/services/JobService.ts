import { supabase } from '../../lib/supabase';
import { Job, User } from '../../types';
import { AuditService } from './AuditService';

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

        // Map decimal strings to numbers if needed, though supabase-js handles logical types usually
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
            console.error('Error creating job:', error);
            throw error;
        }

        return data as Job;
    },

    async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating job ${id}:`, error);
            throw error;
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

        // 1. Define allowed transitions
        const allowedTransitions: Record<string, string[]> = {
            'draft': ['pending_approval', 'archived'],
            'pending_approval': ['approved', 'draft', 'archived'],
            'approved': ['published', 'archived'],
            'published': ['archived'],
            'archived': ['draft'] // Allow re-opening if needed
        };

        if (!allowedTransitions[currentStatus]?.includes(nextStatus as string)) {
            throw new Error(`Transition from ${currentStatus} to ${nextStatus} not allowed.`);
        }

        // 2. Role-based validation
        const isAdmin = ['admin', 'quality'].includes(user.role);

        if (nextStatus === 'approved' && !isAdmin) {
            throw new Error('Only Admin or Quality users can approve jobs.');
        }

        if (nextStatus === 'published' && !isAdmin && !user.custom_permissions?.close_job) {
            // Basic check: if you can't manage job closing you probably shouldn't be publishing without approval
            // But usually publishing requires approved state.
        }

        // 3. Update the job
        const updates: Partial<Job> = { workflow_status: nextStatus };

        // Map to legacy fields for compatibility
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

        // 4. Audit the change
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
