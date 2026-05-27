// @component UserService | @tipo service | @versao 1.0.0
// > Gestão de usuários admin via Edge Functions
// @api getUsers(), getUserById(id), updateUser(id, updates), deleteUser(id), addUser(user)
// @rule Create/Update via Edge Functions com auth session token
// @calls supabase.functions.invoke — create-user-admin, update-user-admin
// @references types/index.ts — User

import { supabase } from '@src/lib/supabase';
import { getCurrentCompanyId } from '@src/lib/tenant';
import { User } from '@src/types';

export const UserService = {
    async getUsers(): Promise<User[]> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return [];

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('company_id', companyId)
            .neq('role', 'candidate')
            .neq('role', 'super_admin')
            .order('name');

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        return data as User[];
    },

    async getUserById(id: string): Promise<User | null> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .eq('company_id', companyId)
            .single();

        if (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
        }

        return data as User;
    },

    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        console.log('Using Edge Function to update:', id);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new Error('No active session. Please log in again.');
        }

        const { data, error } = await supabase.functions.invoke('update-user-admin', {
            body: {
                id,
                ...updates
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        if (error) {
            console.error(`Error updating user ${id}:`, error);
            throw error;
        }

        console.log('Update success:', data);

        return {
            id,
            ...updates
        } as User;
    },

    async deleteUser(id: string): Promise<boolean> {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return false;

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .eq('company_id', companyId);

        if (error) {
            console.error(`Error deleting user ${id}:`, error);
            return false;
        }
        return true;
    },

    async addUser(user: Omit<User, 'id'>): Promise<User | null> {
        console.log('Using Edge Function to create user:', user.email);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new Error('No active session.');
        }

        const { data, error } = await supabase.functions.invoke('create-user-admin', {
            body: {
                ...user,
                password: user.password,
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        if (error) {
            console.error('Error creating user:', error);
            throw error;
        }

        return data as User;
    }
};


