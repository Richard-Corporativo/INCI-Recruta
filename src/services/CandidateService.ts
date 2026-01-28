import { supabase } from '../../lib/supabase';
import { Candidate, KanbanColumnId } from '../../types';

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
    has_avatar: dbCandidate.has_avatar,
    columnId: dbCandidate.column_id,
    initials: dbCandidate.initials,
    avatar: dbCandidate.avatar_url,
    avatarColor: dbCandidate.avatar_color || 'bg-primary',
    textColor: dbCandidate.text_color || 'text-white',
    applied_at: dbCandidate.applied_at,
    user_id: dbCandidate.user_id,
    feedbacks: dbCandidate.feedbacks || [],
    skills: dbCandidate.skills || [],
    languages: dbCandidate.languages || [],
    education: dbCandidate.education || [],
    experience: dbCandidate.experience || [],
    pretension_min: dbCandidate.pretension_min,
    pretension_max: dbCandidate.pretension_max,
    availability: dbCandidate.availability,
    search_status: dbCandidate.search_status,
    competencies: dbCandidate.competencies || [],
    currentStageEntry: dbCandidate.current_stage_entry || dbCandidate.applied_at
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
        const { data, error } = await supabase.rpc('get_candidates_with_stage_entry', { p_job_id: jobId });

        if (error) {
            console.error(`Error fetching candidates for job ${jobId}:`, error);
            // Fallback to standard fetch if RPC fails (e.g. migration hasn't run yet)
            const { data: fallbackData } = await supabase
                .from('candidates')
                .select('*, feedbacks(*)')
                .eq('job_id', jobId)
                .order('applied_at', { ascending: false });

            return (fallbackData || []).map(mapDbToCandidate);
        }

        return (data || []).map(mapDbToCandidate);
    },

    async getJobForecast(jobId: string) {
        // 1. Get average durations for all stages
        const averages = await CandidateService.getAverageStageDurations();

        // 2. Get current candidates and their stages
        const candidates = await CandidateService.getCandidatesByJob(jobId);

        // 3. For each candidate, estimate time to finish
        // Standard flow
        const stageOrder: KanbanColumnId[] = ['received', 'screening', 'technical', 'hr_interview', 'manager_interview', 'finalist', 'hired'];

        let totalEstimatedSeconds = 0;
        let candidatesToFinish = 0;

        candidates.forEach(c => {
            if (c.columnId === 'hired' || c.columnId === 'rejected') return;

            const currentIdx = stageOrder.indexOf(c.columnId);
            if (currentIdx === -1) return;

            candidatesToFinish++;
            // Sum up averages of remaining stages
            for (let i = currentIdx; i < stageOrder.indexOf('hired'); i++) {
                const stage = stageOrder[i];
                totalEstimatedSeconds += (averages[stage] || (3 * 24 * 3600)); // Default 3 days if no data
            }
        });

        if (candidatesToFinish === 0) return null;

        const averageTimeToClose = totalEstimatedSeconds / candidatesToFinish;
        const estimatedClosingDate = new Date();
        estimatedClosingDate.setSeconds(estimatedClosingDate.getSeconds() + averageTimeToClose);

        return {
            estimatedClosingDate: estimatedClosingDate.toISOString(),
            averageTimeToCloseDays: Math.round(averageTimeToClose / (24 * 3600))
        };
    },

    async uploadAvatar(file: File, candidateId: string): Promise<string | null> {
        // Validation: 2MB limit as requested
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('Tamanho da imagem excede 2MB');
        }
        if (!file.type.startsWith('image/')) {
            throw new Error('Apenas arquivos de imagem são permitidos');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            // Convert to hex string for Postgres BYTEA: \xDEADBEEF...
            const hex = '\\x' + Array.from(buffer)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const { error } = await supabase
                .from('candidate_avatars')
                .upsert({
                    candidate_id: candidateId,
                    file_data: hex,
                    file_name: file.name,
                    mime_type: file.type,
                    file_size: file.size
                }, { onConflict: 'candidate_id' });

            if (error) {
                console.error('Error uploading avatar to DB:', error);
                return null;
            }

            // Return a Data URL for immediate use in the UI
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error in uploadAvatar:', error);
            return null;
        }
    },

    async downloadAvatar(candidateId: string): Promise<{ blob: Blob; fileName: string } | null> {
        const { data, error } = await supabase
            .from('candidate_avatars')
            .select('file_data, file_name, mime_type')
            .eq('candidate_id', candidateId)
            .single();

        if (error || !data) return null;

        try {
            const hexString = data.file_data as unknown as string;
            const hex = hexString.startsWith('\\x') ? hexString.slice(2) : hexString;

            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
            }

            const blob = new Blob([bytes], { type: data.mime_type });
            return { blob, fileName: data.file_name };
        } catch (e) {
            console.error('Error converting avatar data:', e);
            return null;
        }
    },

    async getAvatarUrl(candidateId: string): Promise<string | null> {
        const result = await this.downloadAvatar(candidateId);
        if (!result) return null;
        return URL.createObjectURL(result.blob);
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
            job_id: candidate.jobId || null,
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

        // 1.5 Record initial stage history
        await CandidateService.recordStageEntry(newCandidate.id, newCandidate.columnId);

        // 2. Trigger HR notification if it's a Talent Bank registration (no jobId)
        if (!candidate.jobId) {
            console.log('[CandidateService] Spontaneous registration detected, triggering HR notification...');
            supabase.functions.invoke('notify-talent-bank', {
                body: { candidate: newCandidate }
            }).catch(err => {
                console.warn('[CandidateService] Failed to trigger HR notification:', err);
            });
        }

        // 3. Upload Resume if provided
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
        if ('feedbacks' in dbPayload) delete dbPayload.feedbacks;

        // SLA: Check if stage is changing
        const { data: currentCandidate } = await supabase
            .from('candidates')
            .select('column_id')
            .eq('id', id)
            .single();

        const isStageChanging = updates.columnId && currentCandidate && currentCandidate.column_id !== updates.columnId;

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

        const updatedCandidate = mapDbToCandidate(data);

        // SLA: If stage changed, record the transition
        if (isStageChanging) {
            await CandidateService.recordStageTransition(id, currentCandidate.column_id, updates.columnId as string);
        }

        return updatedCandidate;
    },

    async recordStageEntry(candidateId: string, stageId: string) {
        await supabase
            .from('candidate_stage_history')
            .insert([{
                candidate_id: candidateId,
                stage_id: stageId,
                entry_time: new Date().toISOString()
            }]);
    },

    async recordStageTransition(candidateId: string, oldStage: string, newStage: string) {
        const now = new Date();

        // 1. Close previous stage
        const { data: lastStage } = await supabase
            .from('candidate_stage_history')
            .select('*')
            .eq('candidate_id', candidateId)
            .eq('stage_id', oldStage)
            .is('exit_time', null)
            .order('entry_time', { ascending: false })
            .limit(1)
            .single();

        if (lastStage) {
            const entryTime = new Date(lastStage.entry_time);
            const durationSeconds = Math.floor((now.getTime() - entryTime.getTime()) / 1000);

            await supabase
                .from('candidate_stage_history')
                .update({
                    exit_time: now.toISOString(),
                    duration_seconds: durationSeconds
                })
                .eq('id', lastStage.id);
        }

        // 2. Open new stage
        await CandidateService.recordStageEntry(candidateId, newStage);
    },

    async getStageHistory(candidateId: string) {
        const { data, error } = await supabase
            .from('candidate_stage_history')
            .select('*')
            .eq('candidate_id', candidateId)
            .order('entry_time', { ascending: true });

        return error ? [] : data;
    },

    async getAverageStageDurations() {
        // Average duration per stage across all candidates
        const { data, error } = await supabase
            .from('candidate_stage_history')
            .select('stage_id, duration_seconds')
            .not('duration_seconds', 'is', null);

        if (error || !data) return {};

        const totals: Record<string, { sum: number; count: number }> = {};
        data.forEach(item => {
            if (!totals[item.stage_id]) totals[item.stage_id] = { sum: 0, count: 0 };
            totals[item.stage_id].sum += item.duration_seconds;
            totals[item.stage_id].count += 1;
        });

        const averages: Record<string, number> = {};
        Object.keys(totals).forEach(stage => {
            averages[stage] = Math.round(totals[stage].sum / totals[stage].count);
        });

        return averages;
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
    },

    async searchCandidates(filters: {
        query?: string;
        skills?: string[];
        competencies?: string[];
        minSalary?: number;
        maxSalary?: number;
        location?: string;
        availability?: string;
        status?: string;
    }): Promise<Candidate[]> {
        const { data, error } = await supabase.rpc('search_candidates', {
            p_search_query: filters.query || null,
            p_skills: filters.skills && filters.skills.length > 0 ? filters.skills : null,
            p_competencies: filters.competencies && filters.competencies.length > 0 ? filters.competencies : null,
            p_min_salary: filters.minSalary || null,
            p_max_salary: filters.maxSalary || null,
            p_location: filters.location || null,
            p_availability: filters.availability || null,
            p_search_status: filters.status || null
        });

        if (error) {
            console.error('Error searching candidates:', error);
            return [];
        }

        return (data || []).map(mapDbToCandidate);
    },

    async saveDiversityData(candidateId: string, data: { gender?: string; race?: string; isPcd?: boolean }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('candidate_demographics')
                .upsert({
                    candidate_id: candidateId,
                    gender: data.gender || 'prefer_not_to_say',
                    race: data.race || 'prefer_not_to_say',
                    is_pcd: data.isPcd
                }, { onConflict: 'candidate_id' });

            if (error) {
                console.error('Error saving diversity data:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Exception saving diversity data:', err);
            return false;
        }
    }
};
