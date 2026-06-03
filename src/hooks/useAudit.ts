'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/supabase';
import { auditService, AuditLog as ServiceLog } from '@src/services/audit.service';
import { AuditLog } from '@src/types';
import { useAuth } from '@src/context/AuthContext';

function mapLog(log: ServiceLog): AuditLog {
    return {
        id: log.id,
        user_id: log.user_id,
        user_name: log.user?.name || 'Sistema',
        company_id: log.company_id,
        action: log.action,
        category: log.category || log.details?.category,
        timestamp: log.created_at,
        details: auditService.formatDetails(log.details),
        entity_type: log.resource_type,
        entity_id: log.resource_id,
        job_id: log.job_id,
        old_value: log.details?.old,
        new_value: log.details?.new,
        user: log.user
    };
}

export const useAudit = () => {
    const { company } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadLogs = useCallback(async () => {
        setIsLoading(true);
        const data = await auditService.getLogs();
        setLogs(data.map(mapLog));
        setIsLoading(false);
        return data;
    }, []);

    useEffect(() => {
        let cancelled = false;
        // Subscription criada ANTES do fetch — elimina race window e usa companyId confiável do contexto
        const subscription = auditService.subscribeToLogs((newLog) => {
            if (!cancelled) setLogs(prev => [mapLog(newLog), ...prev].slice(0, 100));
        }, company?.id);

        loadLogs();

        return () => {
            cancelled = true;
            supabase.removeChannel(subscription);
        };
    }, [loadLogs, company?.id]);

    const addLog = useCallback(async (params: any) => {
        await auditService.log(params);
    }, []);

    return { logs, addLog, isLoading, refresh: loadLogs };
};

