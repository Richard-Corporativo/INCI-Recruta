import { useState, useEffect, useCallback } from 'react';
import { RoleService } from '../src/services/RoleService';
import { Role } from '../types';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRoles = useCallback(async () => {
        setIsLoading(true);
        const data = await RoleService.getRoles();
        setRoles(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    const addRole = useCallback(async (role: Omit<Role, 'id' | 'updated_at'>) => {
        const result = await RoleService.addRole(role);
        if (result) {
            await loadRoles();
        }
    }, [loadRoles]);

    const updateRole = useCallback(async (id: string, roleData: Partial<Role>) => {
        const result = await RoleService.updateRole(id, roleData);
        if (result) {
            await loadRoles();
        }
    }, [loadRoles]);

    const deleteRole = useCallback(async (id: string) => {
        const success = await RoleService.deleteRole(id);
        if (success) {
            await loadRoles();
        }
    }, [loadRoles]);

    return { roles, addRole, updateRole, deleteRole, isLoading, refresh: loadRoles };
};
