import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { RoleService } from '@src/services/role.service';
import { Role } from '@src/types';

export const useRoles = () => {
    const { company } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await RoleService.getRoles();
            setRoles(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    const addRole = useCallback(async (role: Omit<Role, 'id' | 'updated_at' | 'code'> & Partial<Pick<Role, 'code'>>): Promise<boolean> => {
        if (!company?.id) {
            console.error('[useRoles] company não carregado no contexto — não é possível criar cargo.');
            return false;
        }
        const result = await RoleService.addRole(role, company.id);
        if (result) {
            await loadRoles();
            return true;
        }
        return false;
    }, [loadRoles, company?.id]);

    const updateRole = useCallback(async (id: string, roleData: Partial<Role>): Promise<boolean> => {
        const result = await RoleService.updateRole(id, roleData);
        if (result) {
            await loadRoles();
            return true;
        }
        return false;
    }, [loadRoles]);

    const deleteRole = useCallback(async (id: string) => {
        const success = await RoleService.deleteRole(id);
        if (success) {
            await loadRoles();
        }
    }, [loadRoles]);

    return { roles, addRole, updateRole, deleteRole, isLoading, refresh: loadRoles };
};

