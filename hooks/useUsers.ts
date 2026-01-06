import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../src/services/UserService';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export const useUsers = () => {
    const queryClient = useQueryClient();
    const { user: currentUser, refreshProfile } = useAuth();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: UserService.getUsers,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });

    const addUserMutation = useMutation({
        mutationFn: (user: Omit<User, 'id'>) => UserService.addUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => UserService.updateUser(id, updates),
        onMutate: async ({ id, updates }) => {
            // Cancel outdated queries
            await queryClient.cancelQueries({ queryKey: ['users'] });

            // Snapshot previous value
            const previousUsers = queryClient.getQueryData<User[]>(['users']);

            // Optimistically update to the new value
            if (previousUsers) {
                queryClient.setQueryData<User[]>(['users'], old =>
                    old?.map(u => u.id === id ? {
                        ...u, ...updates,
                        // Merging nested objects (scope, permissions) carefully
                        scope: updates.scope ? { ...u.scope, ...updates.scope } : u.scope,
                        custom_permissions: updates.custom_permissions ? { ...u.custom_permissions, ...updates.custom_permissions } : u.custom_permissions
                    } : u)
                );
            }

            return { previousUsers };
        },
        onError: (err, variables, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
        },
        onSuccess: async (_, { id }) => {
            // We still invalidate to ensure consistency eventually
            await queryClient.invalidateQueries({ queryKey: ['users'] });

            if (currentUser && id === currentUser.id) {
                await refreshProfile();
            }
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => UserService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return {
        users,
        isLoading,
        error,
        addUser: addUserMutation.mutateAsync,
        updateUser: (id: string, updates: Partial<User>) => updateUserMutation.mutateAsync({ id, updates }),
        deleteUser: deleteUserMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    };
};
