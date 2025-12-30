import { useState, useEffect } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { AuditLog } from '../types';

export const useAudit = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<AuditLog[]>(KEYS.AUDIT);
        if (data) setLogs(data);
    }, []);

    const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const data = StorageService.get<AuditLog[]>(KEYS.AUDIT) || [];
        const newLog: AuditLog = {
            ...log,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString()
        };
        const updated = [newLog, ...data];
        setLogs(updated);
        StorageService.set(KEYS.AUDIT, updated);
    };

    return { logs, addLog };
};
