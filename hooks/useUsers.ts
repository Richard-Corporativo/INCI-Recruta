import { useState, useEffect, useCallback } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { User } from '../types';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            StorageService.initialize();

            // --> otimizado: Simulando latência de rede para feedback visual (Fake Loading)
            await new Promise(resolve => setTimeout(resolve, 800));

            const data = StorageService.get<User[]>(KEYS.USERS);
            if (data) setUsers(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const addUser = useCallback((user: Omit<User, 'id' | 'lastAccess'>) => {
        setUsers(prev => {
            const newUser: User = {
                ...user,
                id: Math.random().toString(36).substring(2, 11),
                lastAccess: 'Nunca'
            };
            const updated = [...prev, newUser];
            StorageService.set(KEYS.USERS, updated);
            return updated;
        });
    }, []);

    const updateUser = useCallback((id: string, updates: Partial<User>) => {
        setUsers(prev => {
            const updated = prev.map(u => (u.id === id ? { ...u, ...updates } : u));
            StorageService.set(KEYS.USERS, updated);
            return updated;
        });
    }, []);

    const deleteUser = useCallback((id: string) => {
        setUsers(prev => {
            const updated = prev.filter(u => u.id !== id);
            StorageService.set(KEYS.USERS, updated);
            return updated;
        });
    }, []);

    return { users, isLoading, addUser, updateUser, deleteUser };
};
