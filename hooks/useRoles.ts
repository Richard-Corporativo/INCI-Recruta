import { useState, useEffect } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { Role } from '../types';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<Role[]>(KEYS.ROLES);
        if (data) setRoles(data);
    }, []);

    const addRole = (role: Omit<Role, 'id' | 'updated_at'>) => {
        const newRole: Role = {
            ...role,
            id: Math.random().toString(36).substr(2, 9),
            updated_at: 'Hoje'
        };
        const updated = [...roles, newRole];
        setRoles(updated);
        StorageService.set(KEYS.ROLES, updated);
    };

    const updateRole = (id: string, roleData: Partial<Role>) => {
        const updated = roles.map(role =>
            role.id === id ? { ...role, ...roleData, updated_at: 'Hoje' } : role
        );
        setRoles(updated);
        StorageService.set(KEYS.ROLES, updated);
    };

    const deleteRole = (id: string) => {
        const updated = roles.filter(role => role.id !== id);
        setRoles(updated);
        StorageService.set(KEYS.ROLES, updated);
    };

    return { roles, addRole, updateRole, deleteRole };
};
