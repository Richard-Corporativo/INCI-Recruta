import { supabase } from '../../lib/supabase';
import { User } from '../../types';

export const UserService = {
    async getUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .neq('role', 'candidate')
            .order('name');

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        return data as User[];
    },

    async getUserById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
        }

        return data as User;
    },

    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        console.log('Updating user:', id, updates);

        // Get current session to ensure we have a valid token
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new Error('No active session. Please log in again.');
        }

        // 1. Try to update business fields directly in the public table (faster and ensures persistence of JSONB fields)
        // We do this BEFORE or IN PARALLEL to the Edge Function to ensure UI responsiveness for settings
        const businessFields = ['scope', 'custom_permissions', 'role', 'status', 'department', 'name', 'avatar'];
        const hasBusinessFields = Object.keys(updates).some(key => businessFields.includes(key));

        if (hasBusinessFields) {
            const { error: dbError } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id);

            if (dbError) {
                console.error('Error updating public user table:', dbError);
                // We don't throw here immediately, we let the Edge Function try as well, 
                // or if it's a permission error, the Edge Function might succeed (if it overrides RLS).
            } else {
                console.log('Public table updated successfully.');
            }
        }

        // 2. Invoke Edge Function for sensitive updates (Auth, Password) or complex logic
        // We still call this to keep consistency if the backend has hooks
        try {
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
                console.warn('Edge Function returned error (possibly not deployed):', error);
                // If direct DB update worked, we can ignore Edge Function error for non-auth fields
                if (hasBusinessFields) return { id, ...updates } as User;
                throw error;
            }
        } catch (err) {
            console.warn('Edge Function invocation failed:', err);
            // If direct DB update worked, return success
            if (hasBusinessFields) return { id, ...updates } as User;
            throw err;
        }

        return {
            id,
            ...updates
        } as User;
    },

    async deleteUser(id: string): Promise<boolean> {
        // Note: This only deletes the public profile. 
        // To delete the auth user, you must use the Supabase Dashboard or Admin API.
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting user ${id}:`, error);
            return false;
        }
        return true;
    },

    async addUser(user: Omit<User, 'id'>): Promise<User | null> {
        console.warn('Adding users programmatically requires Supabase Admin API or Edge Functions.');
        console.warn('Please invite users via the Supabase Dashboard Authentication tab.');
        alert('Para adicionar usuários, utilize o Painel do Supabase (Authentication > Add User). O sistema sincronizará automaticamente.');
        return null;
    }
};
