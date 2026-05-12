// @component RoleService | @tipo service | @versao 1.0.0
// > CRUD do catálogo de cargos
// @api getRoles(), addRole(role), updateRole(id, updates), deleteRole(id)
// @rule Atualiza updated_at automaticamente em create/update
// @references types/index.ts — Role

import { supabase } from '@src/lib/supabase';
import { Role } from '@src/types';

const createFallbackRoleCode = () => `#WEB-${Date.now().toString(36).toUpperCase()}`;

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

    async getRoleById(id: string): Promise<Role | null> {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching role:', error);
            return null;
        }

        return data as Role;
    },

    async addRole(role: Omit<Role, 'id' | 'updated_at' | 'code'> & Partial<Pick<Role, 'code'>>, companyId: string): Promise<Role | null> {
        const { data, error } = await supabase
            .from('roles')
            .insert([{
                ...role,
                company_id: companyId,
                code: role.code || createFallbackRoleCode(),
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


