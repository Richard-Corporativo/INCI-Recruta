import { supabase } from '../../lib/supabase';
import { Job } from '../../types';

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
    }
};
