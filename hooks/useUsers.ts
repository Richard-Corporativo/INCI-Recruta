import { useState, useEffect } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { User } from '../types';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        StorageService.initialize();
        const data = StorageService.get<User[]>(KEYS.USERS);
        if (data) setUsers(data);
    }, []);

    const addUser = (user: Omit<User, 'id' | 'lastAccess'>) => {
        const data = StorageService.get<User[]>(KEYS.USERS) || [];
        const newUser: User = {
            ...user,
            id: Math.random().toString(36).substr(2, 9),
            lastAccess: 'Nunca'
        };
        const updated = [...data, newUser];
        setUsers(updated);
        StorageService.set(KEYS.USERS, updated);
    };

    const updateUser = (id: string, updates: Partial<User>) => {
        const data = StorageService.get<User[]>(KEYS.USERS) || [];
        const updated = data.map(u => (u.id === id ? { ...u, ...updates } : u));
        setUsers(updated);
        StorageService.set(KEYS.USERS, updated);
    };

    const deleteUser = (id: string) => {
        const data = StorageService.get<User[]>(KEYS.USERS) || [];
        const updated = data.filter(u => u.id !== id);
        setUsers(updated);
        StorageService.set(KEYS.USERS, updated);
    };

    return { users, addUser, updateUser, deleteUser };
};
