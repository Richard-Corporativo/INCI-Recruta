import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Role } from '../types';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<Role[]>(KEYS.ROLES);
        if (data) setRoles(data);
    }, []);

    const addRole = useCallback((role: Omit<Role, 'id' | 'updated_at'>) => {
        setRoles(prev => {
            const newRole: Role = {
                ...role,
                id: Math.random().toString(36).substring(2, 11),
                updated_at: 'Hoje'
            };
            const updated = [...prev, newRole];
            StorageService.set(KEYS.ROLES, updated);
            return updated;
        });
    }, []);

    const updateRole = useCallback((id: string, roleData: Partial<Role>) => {
        setRoles(prev => {
            const updated = prev.map(role =>
                role.id === id ? { ...role, ...roleData, updated_at: 'Hoje' } : role
            );
            StorageService.set(KEYS.ROLES, updated);
            return updated;
        });
    }, []);

    const deleteRole = useCallback((id: string) => {
        setRoles(prev => {
            const updated = prev.filter(role => role.id !== id);
            StorageService.set(KEYS.ROLES, updated);
            return updated;
        });
    }, []);

    return { roles, addRole, updateRole, deleteRole };
};
