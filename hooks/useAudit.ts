import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { AuditLog } from '../types';

export const useAudit = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<AuditLog[]>(KEYS.AUDIT);
        if (data) setLogs(data);
    }, []);

    const addLog = useCallback((log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        setLogs(prev => {
            const newLog: AuditLog = {
                ...log,
                id: Math.random().toString(36).substring(2, 11),
                timestamp: new Date().toISOString()
            };
            const updated = [newLog, ...prev];
            StorageService.set(KEYS.AUDIT, updated);
            return updated;
        });
    }, []);

    return { logs, addLog };
};
