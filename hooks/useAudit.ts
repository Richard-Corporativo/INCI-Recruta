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
                user_name: log.user_email || 'Sistema'
            })) as AuditLog[]);
        }
        setIsLoading(false);
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
                user_email: session?.user?.email || 'Sistema'
            }]);

        if (error) {
            console.error('Error adding audit log:', error);
        } else {
            loadLogs(); // Refresh list
        }
    }, [loadLogs]);

    return { logs, addLog, isLoading };
};
