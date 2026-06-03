// @component NotificationService | @tipo service | @versao 1.0.0
// > CRUD de notificações in-app para candidatos
// @api create, getForUser, getUnreadCount, markRead, markAllRead

import { supabase } from '@src/lib/supabase';
import { CandidateNotification } from '@src/types';

type CreatePayload = Omit<CandidateNotification, 'id' | 'read' | 'created_at'>;

export const NotificationService = {
    async create(payload: CreatePayload): Promise<void> {
        const { error } = await supabase
            .from('candidate_notifications')
            .insert(payload);
        if (error) {
            console.warn('[NotificationService] Falha ao criar notificação:', error.message);
        }
    },

    async getForUser(userId: string, limit = 20): Promise<CandidateNotification[]> {
        const { data, error } = await supabase
            .from('candidate_notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) {
            console.warn('[NotificationService] Falha ao buscar notificações:', error.message);
            return [];
        }
        return (data ?? []) as CandidateNotification[];
    },

    async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('candidate_notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);
        if (error) return 0;
        return count ?? 0;
    },

    async markRead(id: string): Promise<void> {
        const { error } = await supabase
            .from('candidate_notifications')
            .update({ read: true })
            .eq('id', id);
        if (error) console.warn('[NotificationService] markRead falhou:', error.message);
    },

    async markAllRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from('candidate_notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);
        if (error) console.warn('[NotificationService] markAllRead falhou:', error.message);
    },

    async markReadByJob(userId: string, jobId: string): Promise<void> {
        const { error } = await supabase
            .from('candidate_notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('job_id', jobId)
            .eq('read', false);
        if (error) console.warn('[NotificationService] markReadByJob falhou:', error.message);
    },
};
