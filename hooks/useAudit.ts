import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AuditLog } from '../types';

export const useAudit = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadLogs = useCallback(async () => {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading audit logs:', error);
        } else {
            setLogs(data.map(log => ({
                id: log.id,
                action: log.action,
                details: log.details || '',
                timestamp: log.created_at,
                user_name: log.user_email || 'Sistema',
                entity_type: log.entity_type,
                entity_id: log.entity_id,
                affected_user_id: log.affected_user_id,
                affected_user_name: log.affected_user_name,
                reason: log.reason,
                category: log.category,
                old_value: log.old_value,
                new_value: log.new_value
            })) as AuditLog[]);
        }
        setIsLoading(false);
    }, []);

    const getLogsByEntity = useCallback(async (entityType: string, entityId: string) => {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading entity logs:', error);
            return [];
        }

        return data.map(log => ({
            id: log.id,
            action: log.action,
            details: log.details || '',
            timestamp: log.created_at,
            user_name: log.user_name || log.user_email || 'Sistema',
            entity_type: log.entity_type,
            entity_id: log.entity_id,
            affected_user_id: log.affected_user_id,
            affected_user_name: log.affected_user_name,
            reason: log.reason,
            category: log.category,
            old_value: log.old_value,
            new_value: log.new_value
        })) as AuditLog[];
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const addLog = useCallback(async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const { data: { session } } = await supabase.auth.getSession();

        const { error } = await supabase
            .from('audit_logs')
            .insert([{
                action: log.action,
                details: log.details,
                user_id: session?.user?.id,
                user_name: session?.user?.user_metadata?.name || session?.user?.email || 'Sistema',
                entity_type: log.entity_type,
                entity_id: log.entity_id,
                affected_user_id: log.affected_user_id,
                affected_user_name: log.affected_user_name,
                reason: log.reason,
                category: log.category,
                old_value: log.old_value,
                new_value: log.new_value
            }]);

        if (error) {
            console.error('Error adding audit log:', error);
        } else {
            loadLogs(); // Refresh list
        }
    }, [loadLogs]);

    return { logs, addLog, getLogsByEntity, isLoading };
};
