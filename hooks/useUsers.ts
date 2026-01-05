import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../src/services/UserService';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user: currentUser, refreshProfile } = useAuth();

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        const data = await UserService.getUsers();
        setUsers(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const addUser = useCallback(async (user: Omit<User, 'id'>) => {
        await UserService.addUser(user);
        await loadUsers(); // Refresh to show new user
    }, [loadUsers]);

    const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
        await UserService.updateUser(id, updates);
        await loadUsers();
        // If we updated our own profile, refresh the Auth context
        if (currentUser && id === currentUser.id) {
            await refreshProfile();
        }
    }, [loadUsers, currentUser, refreshProfile]);

    const deleteUser = useCallback(async (id: string) => {
        await UserService.deleteUser(id);
        await loadUsers();
    }, [loadUsers]);

    return { users, isLoading, addUser, updateUser, deleteUser, refresh: loadUsers };
};
