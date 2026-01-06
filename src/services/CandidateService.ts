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
    summary: dbCandidate.summary,
    role: dbCandidate.role,
    github: dbCandidate.github,
    avatar: dbCandidate.avatar,
    notification_preferences: dbCandidate.notification_preferences || { email: true },
    experiences: dbCandidate.experiences || [],
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
            text_color: candidate.textColor,
            summary: candidate.summary,
            experiences: candidate.experiences,
            github: candidate.github,
            role: candidate.role,
            avatar: candidate.avatar,
            notification_preferences: candidate.notification_preferences,
            applied_at: new Date().toISOString() // Always refresh applied_at on re-apply
        };

        // Check if there is an existing application for this user and job
        if (candidate.user_id && candidate.jobId) {
            const { data: existing } = await supabase
                .from('candidates')
                .select('id')
                .eq('user_id', candidate.user_id)
                .eq('job_id', candidate.jobId)
                .maybeSingle();

            if (existing) {
                console.log(`[CandidateService] Found existing application ${existing.id}. Updating instead of inserting.`);
                const { data: updated, error: updateError } = await supabase
                    .from('candidates')
                    .update(dbPayload)
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (updateError) throw updateError;
                return mapDbToCandidate(updated);
            }
        }

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

    async withdrawApplication(id: string): Promise<boolean> {
        console.log(`[CandidateService] Attempting to withdraw application: ${id}`);
        const { data, error } = await supabase
            .from('candidates')
            .update({ column_id: 'withdrawn' })
            .eq('id', id)
            .select();

        if (error) {
            console.error(`[CandidateService] Error withdrawing application ${id}:`, error);
            return false;
        }

        if (!data || data.length === 0) {
            console.warn(`[CandidateService] No records updated for id ${id}. Possible RLS restriction.`);
            return false;
        }

        console.log(`[CandidateService] Successfully withdrawn application: ${id}`);
        return true;
    },

    async deleteCandidate(id: string): Promise<boolean> {
        console.log(`[CandidateService] Attempting to delete candidate: ${id}`);
        const { data, error } = await supabase
            .from('candidates')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error(`[CandidateService] Error deleting candidate ${id}:`, error);
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
    },

    async getCandidateData(userId: string): Promise<{ currentCandidate: Candidate | null, jobs: any[], myApplications: Candidate[] }> {
        // 1. Fetch Active Jobs
        const { data: activeJobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'Ativa');

        // 2. Fetch base profile (without job_id)
        const { data: baseProfile } = await supabase
            .from('candidates')
            .select('*, feedbacks(*)')
            .eq('user_id', userId)
            .is('job_id', null)
            .maybeSingle();

        // 3. Fetch all job applications
        const { data: applications, error: appsError } = await supabase
            .from('candidates')
            .select('*, feedbacks(*)')
            .eq('user_id', userId)
            .not('job_id', 'is', null)
            .order('applied_at', { ascending: false });

        if (appsError) throw appsError;

        let currentCandidate: Candidate | null = null;
        let myApplications: Candidate[] = [];

        if (baseProfile) {
            currentCandidate = mapDbToCandidate(baseProfile);
        }

        if (applications && applications.length > 0) {
            myApplications = applications.map(mapDbToCandidate);
        }

        return {
            currentCandidate,
            jobs: activeJobs || [],
            myApplications
        };
    },

    async upsertCandidateByUserId(userId: string, updates: Partial<Candidate>): Promise<void> {
        const dbPayload: any = {
            ...updates,
            user_id: userId,
            updated_at: new Date().toISOString()
        };

        // Calculate initials if name is present
        if (updates.name) {
            dbPayload.initials = updates.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        }

        // Map camelCase to snake_case
        const mapKeys: { [key: string]: string } = {
            jobId: 'job_id',
            columnId: 'column_id',
            avatarColor: 'avatar_color',
            textColor: 'text_color'
        };

        Object.keys(mapKeys).forEach(key => {
            if (key in dbPayload) {
                dbPayload[mapKeys[key]] = dbPayload[key];
                delete dbPayload[key];
            }
        });

        // Remove non-db fields
        const forbiddenKeys = ['id', 'applied_at', 'feedbacks', 'completeness', 'resumeName', 'time'];
        forbiddenKeys.forEach(key => {
            if (key in dbPayload) delete dbPayload[key];
        });

        // Find base profile (record without job_id)
        const { data: existingProfile } = await supabase
            .from('candidates')
            .select('id')
            .eq('user_id', userId)
            .is('job_id', null)
            .maybeSingle();

        if (existingProfile) {
            // Update existing base profile
            const { error } = await supabase
                .from('candidates')
                .update(dbPayload)
                .eq('id', existingProfile.id);

            if (error) {
                console.error('[CandidateService] Error updating profile:', error);
                throw error;
            }
        } else {
            // Insert new base profile (without job_id)
            const { error } = await supabase
                .from('candidates')
                .insert({ ...dbPayload, job_id: null });

            if (error) {
                console.error('[CandidateService] Error inserting profile:', error);
                throw error;
            }
        }
    }
};
