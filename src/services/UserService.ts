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
        console.log('Using Edge Function to update:', id);

        // Get current session to ensure we have a valid token
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new Error('No active session. Please log in again.');
        }

        // We use the Edge Function to handle both Auth (Email/Pass) and Public Profile updates securely
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

        // Return the updated local object optimistically or re-fetch
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
        console.log('Using Edge Function to create user:', user.email);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new Error('No active session.');
        }

        const { data, error } = await supabase.functions.invoke('create-user-admin', {
            body: {
                ...user,
                // Ensure we pass password if it exists in the type, or handle it
                password: user.password || 'Mudar123!' // Default temp password if not provided
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
