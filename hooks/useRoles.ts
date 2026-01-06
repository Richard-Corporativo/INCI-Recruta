import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Role } from '../types';

export const useRoles = () => {
    const queryClient = useQueryClient();

    const { data: roles = [], isLoading, error } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('roles')
                .select('*')
                .order('title');

            if (error) throw error;
            return data as Role[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    const addRole = useMutation({
        mutationFn: async (role: Omit<Role, 'id' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('roles')
                .insert([{
                    ...role,
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onMutate: async (newRole) => {
            await queryClient.cancelQueries({ queryKey: ['roles'] });
            const previousRoles = queryClient.getQueryData(['roles']);

            // Optimistic update
            const optimisticRole = { ...newRole, id: 'temp-' + Date.now(), updated_at: new Date().toISOString() } as Role;
            queryClient.setQueryData(['roles'], (old: Role[] | undefined) => [...(old || []), optimisticRole].sort((a, b) => a.title.localeCompare(b.title)));

            return { previousRoles };
        },
        onError: (_err, _newRole, context) => {
            if (context?.previousRoles) {
                queryClient.setQueryData(['roles'], context.previousRoles);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    const updateRole = useMutation({
        mutationFn: async ({ id, ...roleData }: { id: string } & Partial<Role>) => {
            const { error } = await supabase
                .from('roles')
                .update({
                    ...roleData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
        },
        onMutate: async ({ id, ...roleData }) => {
            await queryClient.cancelQueries({ queryKey: ['roles'] });
            const previousRoles = queryClient.getQueryData<Role[]>(['roles']);

            // Optimistic update
            if (previousRoles) {
                queryClient.setQueryData(['roles'], previousRoles.map(role =>
                    role.id === id ? { ...role, ...roleData } : role
                ));
            }

            return { previousRoles };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousRoles) {
                queryClient.setQueryData(['roles'], context.previousRoles);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    const deleteRole = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('roles')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['roles'] });
            const previousRoles = queryClient.getQueryData<Role[]>(['roles']);

            // Optimistic update
            if (previousRoles) {
                queryClient.setQueryData(['roles'], previousRoles.filter(role => role.id !== id));
            }

            return { previousRoles };
        },
        onError: (_err, _id, context) => {
            if (context?.previousRoles) {
                queryClient.setQueryData(['roles'], context.previousRoles);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });

    return {
        roles,
        addRole: addRole.mutate,
        updateRole: (id: string, data: Partial<Role>) => updateRole.mutate({ id, ...data }),
        deleteRole: deleteRole.mutate,
        isLoading
    };
};
