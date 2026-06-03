import { supabase } from '@src/lib/supabase';
import { PublicJobNotification } from '@src/types';

export const PublicNotificationService = {
    async getRecent(limit = 10): Promise<PublicJobNotification[]> {
        const { data, error } = await supabase
            .from('public_job_notifications')
            .select('id, job_id, company_id, title, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn('[PublicNotificationService] Falha ao buscar notificações:', error.message);
            return [];
        }
        return data ?? [];
    },
};
