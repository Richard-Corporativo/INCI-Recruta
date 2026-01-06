import { supabase } from '../../lib/supabase';
import { Job } from '../../types';

export const JobService = {
    async getJobs(): Promise<Job[]> {
        // First get all jobs
        const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (jobsError) {
            console.error('Error fetching jobs:', jobsError);
            return [];
        }

        // Then get candidate counts for each job
        const jobsWithCounts = await Promise.all(
            (jobsData || []).map(async (job) => {
                const { count, error } = await supabase
                    .from('candidates')
                    .select('*', { count: 'exact', head: true })
                    .eq('job_id', job.id);

                console.log(`[JobService] Job "${job.title}" (ID: ${job.id}): ${count} candidates`, error);

                return {
                    ...job,
                    candidates_count: count || 0
                };
            })
        );

        return jobsWithCounts as Job[];
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
    }
};
