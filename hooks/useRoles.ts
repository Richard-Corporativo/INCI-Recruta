import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Role } from '../types';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRoles = useCallback(async () => {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('title');

        if (error) {
            console.error('Error loading roles:', error);
        } else if (data) {
            setRoles(data as Role[]);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    const addRole = useCallback(async (role: Omit<Role, 'id' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('roles')
            .insert([{
                ...role,
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding role:', error);
        } else {
            loadRoles();
        }
    }, [loadRoles]);

    const updateRole = useCallback(async (id: string, roleData: Partial<Role>) => {
        const { error } = await supabase
            .from('roles')
            .update({
                ...roleData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating role:', error);
        } else {
            loadRoles();
        }
    }, [loadRoles]);

    const deleteRole = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting role:', error);
        } else {
            loadRoles();
        }
    }, [loadRoles]);

    return { roles, addRole, updateRole, deleteRole, isLoading };
};
