// @component InterviewService | @tipo service | @versao 1.0.0
// > CRUD de entrevistas e gerenciamento de agenda
// @api getInterviews(), getInterviewsByCandidate(candidateId), addInterview(data), updateInterview(id, updates), deleteInterview(id)
// @calls audit.service.ts — log de agendamentos

import { supabase } from '@src/lib/supabase';
import { Interview } from '@src/types';
import { AuditService } from '@src/services/audit.service';
import { getCurrentCompanyId } from '@src/lib/tenant';

export const InterviewService = {
    /** Busca todas as entrevistas da empresa logada */
    async getInterviews(): Promise<Interview[]> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return [];

        const { data, error } = await supabase
            .from('interviews')
            .select(`
                *,
                candidates(name),
                jobs(title),
                users!interviewer_id(name)
            `)
            .eq('company_id', companyId)
            .order('starts_at', { ascending: true });

        if (error) {
            console.error('[InterviewService] Error fetching interviews:', error.message, error.code);
            return [];
        }

        return (data || []).map(row => ({
            ...row,
            candidate_name: row.candidates?.name,
            job_title: row.jobs?.title,
            interviewer_name: row.users?.name
        }));
    },

    /** Busca entrevistas de um candidato específico */
    async getInterviewsByCandidate(candidateId: string): Promise<Interview[]> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return [];

        const { data, error } = await supabase
            .from('interviews')
            .select(`
                *,
                jobs(title),
                users!interviewer_id(name)
            `)
            .eq('candidate_id', candidateId)
            .eq('company_id', companyId)
            .order('starts_at', { ascending: true });

        if (error) {
            console.error('[InterviewService] Error fetching candidate interviews:', error.message, error.code);
            return [];
        }

        return (data || []).map(row => ({
            ...row,
            job_title: row.jobs?.title,
            interviewer_name: row.users?.name
        }));
    },

    /** Adiciona uma nova entrevista */
    async addInterview(interview: Omit<Interview, 'id' | 'company_id' | 'created_at' | 'updated_at'>): Promise<Interview | null> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) throw new Error('Empresa não identificada.');

        const payload = {
            ...interview,
            company_id: companyId
        };

        const { data, error } = await supabase
            .from('interviews')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('[InterviewService] Error adding interview:', error.message, error.code);
            throw error;
        }

        const newInterview = data as Interview;

        const stageFromType: Record<string, string> = {
            'Entrevista RH': 'hr_interview',
            'Entrevista Técnica': 'technical',
            'Apresentação de Case': 'technical',
            'Entrevista Gestor': 'manager_interview',
        };
        const targetColumnId = newInterview.stage || stageFromType[newInterview.type ?? ''];
        if (newInterview.candidate_id && targetColumnId) {
            const { error: moveError } = await supabase
                .from('candidates')
                .update({ column_id: targetColumnId })
                .eq('id', newInterview.candidate_id);
            if (moveError) {
                console.error('[InterviewService] Falha ao mover candidato no kanban:', moveError.message, moveError.code);
            }
        }

        const dateStr = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            timeZone: 'America/Sao_Paulo'
        }).format(new Date(newInterview.starts_at));
        const timeStr = new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit', minute: '2-digit', hour12: false,
            timeZone: 'America/Sao_Paulo'
        }).format(new Date(newInterview.starts_at));
        const locationStr = newInterview.location ? ` — ${newInterview.location}` : '';

        await AuditService.logChange(
            'CANDIDATE',
            newInterview.candidate_id,
            `${newInterview.type} agendada para ${dateStr} às ${timeStr}${locationStr}`,
            null,
            null,
            'interview_scheduled',
            newInterview.job_id?.toString()
        );

        return newInterview;
    },

    /** Atualiza uma entrevista existente */
    async updateInterview(id: string, updates: Partial<Interview>): Promise<Interview | null> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) throw new Error('Empresa não identificada.');

        const { data, error } = await supabase
            .from('interviews')
            .update(updates)
            .eq('id', id)
            .eq('company_id', companyId)
            .select()
            .single();

        if (error) {
            console.error('[InterviewService] Error updating interview:', error.message, error.code);
            throw error;
        }

        return data as Interview;
    },

    /** Remove uma entrevista */
    async deleteInterview(id: string): Promise<boolean> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return false;

        const { error } = await supabase
            .from('interviews')
            .delete()
            .eq('id', id)
            .eq('company_id', companyId);

        if (error) {
            console.error('[InterviewService] Error deleting interview:', error.message, error.code);
            return false;
        }

        return true;
    }
};
