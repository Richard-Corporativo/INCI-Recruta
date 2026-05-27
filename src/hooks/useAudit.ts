'use client';

import { useState, useEffect, useCallback } from 'react';
import { auditService, AuditLog as ServiceLog } from '@src/services/audit.service';
import { AuditLog } from '@src/types';

export const useAudit = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const mapLog = (log: ServiceLog): AuditLog => ({
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
    });

    const loadLogs = useCallback(async () => {
        setIsLoading(true);
        const data = await auditService.getLogs();
        setLogs(data.map(mapLog));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadLogs();
        
        // Setup real-time subscription
        const subscription = auditService.subscribeToLogs((newLog) => {
            setLogs(prev => [mapLog(newLog), ...prev].slice(0, 100)); // Keep last 100
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadLogs]);

    const addLog = useCallback(async (params: any) => {
        await auditService.log(params);
        // List will be updated via real-time subscription
    }, []);

    return { logs, addLog, isLoading, refresh: loadLogs };
};

