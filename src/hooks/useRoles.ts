import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { RoleService } from '@src/services/role.service';
import { Role } from '@src/types';

export const useRoles = () => {
    const { company } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await RoleService.getRoles();
            setRoles(data);
        } catch (err) {
            setError('Não foi possível carregar os cargos. Tente novamente.');
            console.error('[useRoles] loadRoles error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    const addRole = useCallback(async (role: Omit<Role, 'id' | 'updated_at' | 'code'> & Partial<Pick<Role, 'code'>>): Promise<boolean> => {
        if (!company?.id) {
            setError('Empresa não identificada. Recarregue a página.');
            return false;
        }
        setError(null);
        const result = await RoleService.addRole(role, company.id);
        if (result) {
            await loadRoles();
            return true;
        }
        setError('Não foi possível criar o cargo. Tente novamente.');
        return false;
    }, [loadRoles, company?.id]);

    const updateRole = useCallback(async (id: string, roleData: Partial<Role>): Promise<boolean> => {
        setError(null);
        const result = await RoleService.updateRole(id, roleData);
        if (result) {
            await loadRoles();
            return true;
        }
        setError('Não foi possível atualizar o cargo. Tente novamente.');
        return false;
    }, [loadRoles]);

    const deleteRole = useCallback(async (id: string): Promise<boolean> => {
        setError(null);
        const success = await RoleService.deleteRole(id);
        if (success) {
            await loadRoles();
            return true;
        }
        setError('Não foi possível excluir o cargo. Tente novamente.');
        return false;
    }, [loadRoles]);

    return { roles, addRole, updateRole, deleteRole, isLoading, error, refresh: loadRoles };
};

