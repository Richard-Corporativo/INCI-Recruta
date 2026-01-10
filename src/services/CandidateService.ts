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
    resumeName: dbCandidate.resume_name,
    has_resume: dbCandidate.has_resume,
    columnId: dbCandidate.column_id,
    initials: dbCandidate.initials,
    avatarColor: dbCandidate.avatar_color || 'bg-primary',
    textColor: dbCandidate.text_color || 'text-white',
    applied_at: dbCandidate.applied_at,
    user_id: dbCandidate.user_id,
    feedbacks: dbCandidate.feedbacks || [],
    skills: dbCandidate.skills || [],
    languages: dbCandidate.languages || [],
    education: dbCandidate.education || [],
    experience: dbCandidate.experience || []
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

    async uploadResume(file: File, candidateId: string): Promise<boolean> {
        // Validation
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Tamanho do arquivo excede 5MB');
        }
        if (file.type !== 'application/pdf') {
            throw new Error('Apenas arquivos PDF são permitidos');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            // Convert to hex string for Postgres BYTEA: \xDEADBEEF...
            const hex = '\\x' + Array.from(buffer) // Double backslash for JS string escaping
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const { error } = await supabase
                .from('candidate_resumes')
                .upsert({
                    candidate_id: candidateId,
                    file_data: hex,
                    file_name: file.name,
                    mime_type: file.type,
                    file_size: file.size
                });

            if (error) {
                console.error('Error uploading resume:', error);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error processing resume file:', error);
            return false;
        }
    },

    async downloadResume(candidateId: string): Promise<{ blob: Blob; fileName: string } | null> {
        const { data, error } = await supabase
            .from('candidate_resumes')
            .select('file_data, file_name, mime_type')
            .eq('candidate_id', candidateId)
            .single();

        if (error || !data) return null;

        try {
            // Postgres returns BYTEA as hex string: \xDEADBEEF...
            const hexString = data.file_data as unknown as string;
            // Remove \x prefix
            const hex = hexString.startsWith('\\x') ? hexString.slice(2) : hexString;

            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
            }

            const blob = new Blob([bytes], { type: data.mime_type });
            return { blob, fileName: data.file_name };
        } catch (e) {
            console.error('Error converting resume data:', e);
            return null;
        }
    },

    async hasResume(candidateId: string): Promise<boolean> {
        const { count, error } = await supabase
            .from('candidate_resumes')
            .select('*', { count: 'exact', head: true })
            .eq('candidate_id', candidateId);

        return !error && (count || 0) > 0;
    },

    async deleteResume(candidateId: string): Promise<boolean> {
        const { error } = await supabase
            .from('candidate_resumes')
            .delete()
            .eq('candidate_id', candidateId);
        return !error;
    },

    async addCandidate(candidate: Omit<Candidate, 'id' | 'applied_at'>, resumeFile?: File): Promise<Candidate | null> {
        const dbPayload: any = {
            job_id: candidate.jobId,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            location: candidate.location,
            linkedin: candidate.linkedin,
            portfolio: candidate.portfolio,
            resume_name: candidate.resumeName,
            // resume_url removed
            user_id: candidate.user_id,
            column_id: candidate.columnId || 'received',
            avatar_color: candidate.avatarColor,
            text_color: candidate.textColor
        };

        // 1. Insert Candidate
        const { data, error } = await supabase
            .from('candidates')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding candidate:', error);
            throw error;
        }

        const newCandidate = mapDbToCandidate(data);

        // 2. Upload Resume if provided
        if (resumeFile) {
            const uploadSuccess = await CandidateService.uploadResume(resumeFile, newCandidate.id);
            if (!uploadSuccess) {
                console.error('Failed to upload resume, rolling back candidate creation');
                // Rollback
                await supabase.from('candidates').delete().eq('id', newCandidate.id);
                throw new Error('Falha ao fazer upload do currículo');
            }
        }

        // Sync with public.users profile if user_id exists
        if (candidate.user_id) {
            await supabase
                .from('users')
                .update({
                    name: candidate.name,
                    phone: candidate.phone,
                    location: candidate.location,
                    linkedin: candidate.linkedin,
                    portfolio: candidate.portfolio,
                    resume_name: candidate.resumeName,
                    // resume_url removed
                })
                .eq('id', candidate.user_id);
        }

        return newCandidate;
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
        if ('resumeName' in updates) {
            dbPayload.resume_name = updates.resumeName;
            delete dbPayload.resumeName;
        }
        // resume_url removed from updates handling

        // Ensure array/json fields are passed correctly
        if ('skills' in updates) dbPayload.skills = updates.skills;
        if ('languages' in updates) dbPayload.languages = updates.languages;
        if ('education' in updates) dbPayload.education = updates.education;
        if ('experience' in updates) dbPayload.experience = updates.experience;
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
