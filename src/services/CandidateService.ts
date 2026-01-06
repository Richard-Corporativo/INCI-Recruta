import { supabase } from '../../lib/supabase';
import { Candidate } from '../../types';

// Helper to map database fields (snake_case) to TypeScript interface (camelCase)
const mapDbToCandidate = (dbCandidate: any): Candidate => ({
    id: dbCandidate.id,
    jobId: dbCandidate.job_id,
    name: dbCandidate.name,
    email: dbCandidate.email,
    phone: dbCandidate.phone,
    location: dbCandidate.location,
    linkedin: dbCandidate.linkedin,
    portfolio: dbCandidate.portfolio,
    resume_url: dbCandidate.resume_url,
    columnId: dbCandidate.column_id,
    initials: dbCandidate.initials,
    avatarColor: dbCandidate.avatar_color || 'bg-primary',
    textColor: dbCandidate.text_color || 'text-white',
    applied_at: dbCandidate.applied_at,
    user_id: dbCandidate.user_id,
    feedbacks: dbCandidate.feedbacks || []
});

export const CandidateService = {
    async getCandidates(): Promise<Candidate[]> {
        const { data, error } = await supabase
            .from('candidates')
            .select('*, feedbacks(*)')
            .order('applied_at', { ascending: false });

        if (error) {
            console.error('Error fetching candidates:', error);
            return [];
        }

        return (data || []).map(mapDbToCandidate);
    },

    async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
        const { data, error } = await supabase
            .from('candidates')
            .select('*, feedbacks(*)')
            .eq('job_id', jobId)
            .order('applied_at', { ascending: false });

        if (error) {
            console.error(`Error fetching candidates for job ${jobId}:`, error);
            return [];
        }

        return (data || []).map(mapDbToCandidate);
    },

    async uploadResume(file: File, candidateEmail: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${candidateEmail}_${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { data, error } = await supabase.storage
            .from('recruit-docs') // Assuming 'recruit-docs' is the bucket name
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading resume:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('recruit-docs')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async addCandidate(candidate: Omit<Candidate, 'id' | 'applied_at'>): Promise<Candidate | null> {
        const dbPayload: any = {
            job_id: candidate.jobId,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            location: candidate.location,
            linkedin: candidate.linkedin,
            portfolio: candidate.portfolio,
            resume_url: (candidate as any).resume_url,
            user_id: candidate.user_id,
            column_id: candidate.columnId || 'received',
            avatar_color: candidate.avatarColor,
            text_color: candidate.textColor
        };

        const { data, error } = await supabase
            .from('candidates')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding candidate:', error);
            throw error;
        }

        return mapDbToCandidate(data);
    },

    async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
        const dbPayload: any = { ...updates };

        // Map camelCase to snake_case and delete original camelCase keys
        if ('jobId' in updates) {
            dbPayload.job_id = updates.jobId;
            delete dbPayload.jobId;
        }
        if ('columnId' in updates) {
            dbPayload.column_id = updates.columnId;
            delete dbPayload.columnId;
        }
        if ('avatarColor' in updates) {
            dbPayload.avatar_color = updates.avatarColor;
            delete dbPayload.avatarColor;
        }
        if ('textColor' in updates) {
            dbPayload.text_color = updates.textColor;
            delete dbPayload.textColor;
        }
        if ('applied_at' in dbPayload) delete dbPayload.applied_at;
        if ('feedbacks' in dbPayload) delete dbPayload.feedbacks;

        const { data, error } = await supabase
            .from('candidates')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating candidate ${id}:`, error);
            throw error;
        }

        return mapDbToCandidate(data);
    },

    async deleteCandidate(id: string): Promise<boolean> {
        console.log(`[CandidateService] Attempting to delete candidate: ${id}`);
        // Add select() to ensure we get data back which confirms deletion under RLS
        const { data, error } = await supabase
            .from('candidates')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error(`[CandidateService] Error deleting candidate ${id}:`, error);
            return false;
        }

        if (!data || data.length === 0) {
            console.warn(`[CandidateService] No records deleted for id ${id}. Possible RLS restriction.`);
            return false;
        }

        console.log(`[CandidateService] Successfully deleted candidate: ${id}`);
        return true;
    },

    async addFeedback(candidateId: string, feedback: any): Promise<boolean> {
        const dbPayload = {
            candidate_id: candidateId,
            rating: feedback.rating,
            strengths: feedback.strengths || feedback.content,
            concerns: feedback.concerns,
            recommendation: feedback.recommendation,
            stage: feedback.stage
        };

        const { error } = await supabase
            .from('feedbacks')
            .insert([dbPayload]);

        if (error) {
            console.error('Error adding feedback:', error);
            return false;
        }
        return true;
    }
};
