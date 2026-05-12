'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserService } from '@src/services/user.service';
import { useAuth } from '@src/context/AuthContext';
import { User } from '@src/types';

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
        await loadUsers();
    }, [loadUsers]);

    const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
        await UserService.updateUser(id, updates);
        await loadUsers();
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

