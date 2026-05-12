// @component CandidateService | @tipo service | @versao 1.0.0
// > CRUD candidatos, Kanban, avatares, currículos, busca avançada
// @api getCandidates(), getCandidatesByJob(jobId), getJobForecast(jobId), uploadAvatar(file, id), downloadAvatar(id), getAvatarUrl(id), uploadResume(file, id), downloadResume(id), hasResume(id), deleteResume(id), addCandidate(c, file?), updateCandidate(id, updates), recordStageEntry(), recordStageTransition(), getStageHistory(id), getAverageStageDurations(), deleteCandidate(id), addFeedback(id, fb), searchCandidates(filters), saveDiversityData(id, data)
// @state candidate — mapeamento DB snake_case → TS camelCase
// @rule Avatar max 2MB (image), Resume max 5MB (PDF)
// @rule Invoca notify-talent-bank para candidaturas espontâneas
// @calls audit.service.ts — log de transições
// @references types/index.ts — Candidate, KanbanColumnId

import { supabase } from '@src/lib/supabase';
import { Candidate, KanbanColumnId } from '@src/types';
import { AuditService } from '@src/services/audit.service';
import { getCurrentCompanyId } from '@src/lib/tenant';

/** Resolve company_id de uma vaga (para candidaturas e logs vinculados). */
async function getCompanyIdFromJob(jobId: string | number | null | undefined): Promise<string | null> {
    if (!jobId) return null;
    const { data } = await supabase
        .from('jobs')
        .select('company_id')
        .eq('id', jobId)
        .maybeSingle();
    return (data?.company_id as string) ?? null;
}

/** Resolve company_id a partir do candidate_id (para uploads/feedbacks/stage_history). */
async function getCompanyIdFromCandidate(candidateId: string): Promise<string | null> {
    const { data } = await supabase
        .from('candidates')
        .select('company_id')
        .eq('id', candidateId)
        .maybeSingle();
    return (data?.company_id as string) ?? null;
}

// Helper: DB snake_case → TS camelCase
const mapDbToCandidate = (dbCandidate: Record<string, unknown>): Candidate => ({
    id: dbCandidate.id as string,
    jobId: dbCandidate.job_id as string | undefined,
    name: dbCandidate.name as string,
    email: dbCandidate.email as string,
    phone: dbCandidate.phone as string,
    location: dbCandidate.location as string,
    linkedin: dbCandidate.linkedin as string | undefined,
    portfolio: dbCandidate.portfolio as string | undefined,
    resumeName: dbCandidate.resume_name as string | undefined,
    has_resume: dbCandidate.has_resume as boolean | undefined,
    has_avatar: dbCandidate.has_avatar as boolean | undefined,
    columnId: dbCandidate.column_id as KanbanColumnId,
    initials: dbCandidate.initials as string,
    avatar: dbCandidate.avatar_url as string | undefined,
    avatarColor: (dbCandidate.avatar_color as string) || 'bg-primary',
    textColor: (dbCandidate.text_color as string) || 'text-white',
    applied_at: dbCandidate.applied_at as string | undefined,
    user_id: dbCandidate.user_id as string | undefined,
    feedbacks: (dbCandidate.feedbacks as Candidate['feedbacks']) || [],
    skills: (dbCandidate.skills as string[]) || [],
    languages: (dbCandidate.languages as string[]) || [],
    education: (dbCandidate.education as Candidate['education']) || [],
    experience: (dbCandidate.experience as Candidate['experience']) || [],
    pretension_min: dbCandidate.pretension_min as number | undefined,
    pretension_max: dbCandidate.pretension_max as number | undefined,
    availability: dbCandidate.availability as string | undefined,
    search_status: dbCandidate.search_status as string | undefined,
    desired_work_model: dbCandidate.desired_work_model as 'Presencial' | 'Híbrido' | 'Remoto' | undefined,
    competencies: (dbCandidate.competencies as string[]) || [],
    currentStageEntry: (dbCandidate.current_stage_entry as string) || (dbCandidate.applied_at as string),
    terms_accepted: dbCandidate.terms_accepted as boolean | undefined,
    terms_accepted_at: dbCandidate.terms_accepted_at as string | undefined
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

    async getCandidatesApplicants(): Promise<Candidate[]> {
        const { data, error } = await supabase
            .from('candidates')
            .select('*, feedbacks(*)')
            .not('job_id', 'is', null)
            .order('applied_at', { ascending: false });

        if (error) {
            console.error('Error fetching applicants:', error);
            return [];
        }

        return (data || []).map(mapDbToCandidate);
    },

    async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
        const { data, error } = await supabase.rpc('get_candidates_with_stage_entry', { p_job_id: jobId });

        if (error) {
            console.error(`Error fetching candidates for job ${jobId}:`, error);
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
        const averages = await CandidateService.getAverageStageDurations();
        const candidates = await CandidateService.getCandidatesByJob(jobId);

        const stageOrder: KanbanColumnId[] = ['received', 'screening', 'technical', 'hr_interview', 'manager_interview', 'finalist', 'hired'];

        let totalEstimatedSeconds = 0;
        let candidatesToFinish = 0;

        candidates.forEach(c => {
            if (c.columnId === 'hired' || c.columnId === 'rejected') return;

            const currentIdx = stageOrder.indexOf(c.columnId);
            if (currentIdx === -1) return;

            candidatesToFinish++;
            for (let i = currentIdx; i < stageOrder.indexOf('hired'); i++) {
                const stage = stageOrder[i];
                totalEstimatedSeconds += (averages[stage] || (3 * 24 * 3600));
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
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('Tamanho da imagem excede 2MB');
        }
        if (!file.type.startsWith('image/')) {
            throw new Error('Apenas arquivos de imagem são permitidos');
        }

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${candidateId}/avatar.${fileExt}`;

            // 1. Upload para o Storage (Bucket: avatars)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Atualiza metadados na tabela
            const companyId = await getCompanyIdFromCandidate(candidateId);
            const { error: dbError } = await supabase
                .from('candidate_avatars')
                .upsert({
                    candidate_id: candidateId,
                    company_id: companyId,
                    file_path: filePath,
                    file_name: file.name,
                    mime_type: file.type,
                    file_size: file.size,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'candidate_id' });

            if (dbError) throw dbError;

            return await this.getAvatarUrl(candidateId);
        } catch (error) {
            console.error('Error in uploadAvatar:', error);
            return null;
        }
    },

    async downloadAvatar(candidateId: string): Promise<{ blob: Blob; fileName: string } | null> {
        const { data: dbData, error: dbError } = await supabase
            .from('candidate_avatars')
            .select('file_path, file_name, mime_type, file_data')
            .eq('candidate_id', candidateId)
            .single();

        if (dbError || !dbData) return null;

        try {
            // Tenta primeiro pelo Storage
            if (dbData.file_path) {
                const { data: storageData, error: storageError } = await supabase.storage
                    .from('avatars')
                    .download(dbData.file_path);

                if (!storageError && storageData) {
                    return { blob: storageData, fileName: dbData.file_name };
                }
            }

            // Fallback para dados em BYTEA (migração)
            if (dbData.file_data) {
                const hexString = dbData.file_data as unknown as string;
                const hex = hexString.startsWith('\\x') ? hexString.slice(2) : hexString;
                const bytes = new Uint8Array(hex.length / 2);
                for (let i = 0; i < hex.length; i += 2) {
                    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
                }
                const blob = new Blob([bytes], { type: dbData.mime_type });
                return { blob, fileName: dbData.file_name };
            }

            return null;
        } catch (e) {
            console.error('Error converting avatar data:', e);
            return null;
        }
    },

    async getAvatarUrl(candidateId: string): Promise<string | null> {
        const { data: dbData } = await supabase
            .from('candidate_avatars')
            .select('file_path')
            .eq('candidate_id', candidateId)
            .single();

        if (dbData?.file_path) {
            const { data, error } = await supabase.storage
                .from('avatars')
                .createSignedUrl(dbData.file_path, 3600); // URL válida por 1 hora

            if (!error && data) return data.signedUrl;
        }

        // Se não tiver path ou falhar, tenta o download via blob (para dados legados)
        const result = await this.downloadAvatar(candidateId);
        if (!result) return null;
        return URL.createObjectURL(result.blob);
    },

    async uploadResume(file: File, candidateId: string): Promise<boolean> {
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Tamanho do arquivo excede 5MB');
        }
        if (file.type !== 'application/pdf') {
            throw new Error('Apenas arquivos PDF são permitidos');
        }

        try {
            const filePath = `${candidateId}/resume.pdf`;

            // 1. Upload para o Storage (Bucket: resumes)
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Atualiza metadados na tabela
            const companyId = await getCompanyIdFromCandidate(candidateId);
            const { error: dbError } = await supabase
                .from('candidate_resumes')
                .upsert({
                    candidate_id: candidateId,
                    company_id: companyId,
                    file_path: filePath,
                    file_name: file.name,
                    mime_type: file.type,
                    file_size: file.size,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'candidate_id' });

            if (dbError) throw dbError;
            return true;
        } catch (error) {
            console.error('Error processing resume file:', error);
            return false;
        }
    },

    async downloadResume(candidateId: string): Promise<{ blob: Blob; fileName: string } | null> {
        const { data: dbData, error: dbError } = await supabase
            .from('candidate_resumes')
            .select('file_path, file_name, mime_type, file_data')
            .eq('candidate_id', candidateId)
            .single();

        if (dbError || !dbData) return null;

        try {
            // Tenta primeiro pelo Storage
            if (dbData.file_path) {
                const { data: storageData, error: storageError } = await supabase.storage
                    .from('resumes')
                    .download(dbData.file_path);

                if (!storageError && storageData) {
                    return { blob: storageData, fileName: dbData.file_name };
                }
            }

            // Fallback para dados em BYTEA
            if (dbData.file_data) {
                const hexString = dbData.file_data as unknown as string;
                const hex = hexString.startsWith('\\x') ? hexString.slice(2) : hexString;
                const bytes = new Uint8Array(hex.length / 2);
                for (let i = 0; i < hex.length; i += 2) {
                    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
                }
                const blob = new Blob([bytes], { type: dbData.mime_type });
                return { blob, fileName: dbData.file_name };
            }

            return null;
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
        // Candidatura: company_id vem da vaga. Banco de talentos: sem company (visível só a super_admin).
        const companyId = candidate.jobId ? await getCompanyIdFromJob(candidate.jobId) : null;

        const dbPayload = {
            job_id: candidate.jobId || null,
            company_id: companyId,
            name: candidate.name || null,
            email: candidate.email || null,
            phone: candidate.phone || null,
            location: candidate.location || null,
            linkedin: candidate.linkedin || null,
            portfolio: candidate.portfolio || null,
            resume_name: candidate.resumeName || null,
            user_id: candidate.user_id || null,
            column_id: candidate.columnId || 'received',
            avatar_color: candidate.avatarColor || 'bg-primary',
            text_color: candidate.textColor || 'text-white',
            initials: candidate.initials || null,
            pretension_min: candidate.pretension_min || null,
            pretension_max: candidate.pretension_max || null,
            availability: candidate.availability || null
        };

        // Tarefa 3: Sem log de payload com dados pessoais (e-mail, telefone etc.)
        // Tarefa 4: Verificar candidatura duplicada antes de inserir
        if (dbPayload.user_id && dbPayload.job_id) {
            const { count } = await supabase
                .from('candidates')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', dbPayload.user_id as string)
                .eq('job_id', dbPayload.job_id as string);

            if ((count ?? 0) > 0) {
                throw new Error('Você já se candidatou a esta vaga.');
            }
        }

        const { data, error } = await supabase
            .from('candidates')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            if (error.code === '23505' && dbPayload.user_id && dbPayload.job_id) {
                throw new Error('Você já se candidatou a esta vaga.');
            }

            console.error('[CandidateService] Error adding candidate:', error.code, error.hint);
            throw error;
        }

        const newCandidate = mapDbToCandidate(data);

        await AuditService.logChange('CANDIDATE', newCandidate.id, `Candidato adicionado: ${newCandidate.name}`, null, newCandidate);

        await CandidateService.recordStageEntry(newCandidate.id, newCandidate.columnId);

        if (!candidate.jobId) {
            console.log('[CandidateService] Spontaneous registration detected, triggering HR notification...');
            supabase.functions.invoke('notify-talent-bank', {
                body: { candidate: newCandidate }
            }).catch(err => {
                console.warn('[CandidateService] Failed to trigger HR notification:', err);
            });
        }

        if (resumeFile) {
            const uploadSuccess = await CandidateService.uploadResume(resumeFile, newCandidate.id);
            if (!uploadSuccess) {
                console.error('Failed to upload resume, rolling back candidate creation');
                await supabase.from('candidates').delete().eq('id', newCandidate.id);
                throw new Error('Falha ao fazer upload do currículo');
            }
        }

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
                })
                .eq('id', candidate.user_id);
        }

        return newCandidate;
    },

    async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
        const dbPayload: Record<string, unknown> = { ...updates };

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

        if ('skills' in updates) dbPayload.skills = updates.skills;
        if ('languages' in updates) dbPayload.languages = updates.languages;
        if ('education' in updates) dbPayload.education = updates.education;
        if ('experience' in updates) dbPayload.experience = updates.experience;
        if ('feedbacks' in dbPayload) delete dbPayload.feedbacks;

        const { data: currentCandidate } = await supabase
            .from('candidates')
            .select('column_id')
            .eq('id', id)
            .single();

        const isStageChanging = updates.columnId && currentCandidate && currentCandidate.column_id !== updates.columnId;

        if (isStageChanging && updates.columnId === 'hired') {
            dbPayload.hired_at = new Date().toISOString();
        }

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

        if (isStageChanging) {
            await AuditService.logChange('CANDIDATE', id, `Candidato movido para etapa: ${updates.columnId}`, { column_id: currentCandidate.column_id }, { column_id: updates.columnId });
        } else {
            await AuditService.logChange('CANDIDATE', id, `Cadastro de candidato atualizado`, null, updates);
        }

        if (isStageChanging) {
            await CandidateService.recordStageTransition(id, currentCandidate.column_id, updates.columnId as string);
        }

        return updatedCandidate;
    },

    async recordStageEntry(candidateId: string, stageId: string) {
        const companyId = await getCompanyIdFromCandidate(candidateId);
        await supabase
            .from('candidate_stage_history')
            .insert([{
                candidate_id: candidateId,
                company_id: companyId,
                stage_id: stageId,
                entry_time: new Date().toISOString()
            }]);
    },

    async recordStageTransition(candidateId: string, oldStage: string, newStage: string) {
        const now = new Date();

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
        const { data, error } = await supabase
            .from('candidates')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (data) {
            await AuditService.logChange('CANDIDATE', id, `Candidato removido do sistema`, data, null);
        }

        if (error) {
            console.error(`[CandidateService] Error deleting candidate ${id}:`, error);
            return false;
        }

        if (!data || data.length === 0) {
            console.warn('[CandidateService] No records deleted. Possible RLS restriction.');
            return false;
        }

        return true;
    },

    async addFeedback(candidateId: string, feedback: Record<string, unknown>): Promise<boolean> {
        const companyId = await getCompanyIdFromCandidate(candidateId);
        const dbPayload = {
            candidate_id: candidateId,
            company_id: companyId,
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

    async getAllSkills(): Promise<string[]> {
        const { data, error } = await supabase.rpc('get_all_skills');
        if (error) {
            console.error('Error fetching all skills:', error);
            return [];
        }
        return (data as string[]) || [];
    },

    async getAllLocations(): Promise<string[]> {
        const { data, error } = await supabase.rpc('get_all_locations');
        if (error) {
            console.error('Error fetching all locations:', error);
            return [];
        }
        return (data as string[]) || [];
    },

    async saveDiversityData(candidateId: string, data: { gender?: string; race?: string; isPcd?: boolean }): Promise<boolean> {
        try {
            const companyId = await getCompanyIdFromCandidate(candidateId);
            const { error } = await supabase
                .from('candidate_demographics')
                .upsert({
                    candidate_id: candidateId,
                    company_id: companyId,
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

