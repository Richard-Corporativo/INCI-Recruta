import { supabase } from '../../lib/supabase';
import { Role } from '../../types';

export const RoleService = {
    async getRoles(): Promise<Role[]> {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('title');

        if (error) {
            console.error('Error fetching roles:', error);
            return [];
        }

        return data as Role[];
    },

    async addRole(role: Omit<Role, 'id' | 'updated_at'>): Promise<Role | null> {
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
            return null;
        }

        return data as Role;
    },

    async updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
        const { data, error } = await supabase
            .from('roles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating role:', error);
            return null;
        }

        return data as Role;
    },

    async deleteRole(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting role:', error);
            return false;
        }

        return true;
    }
};
