import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService, KEYS } from '../lib/storage';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('recruitSys_token') || sessionStorage.getItem('recruitSys_token');
        if (token) {
            const userId = localStorage.getItem('recruitSys_user_id') || sessionStorage.getItem('recruitSys_user_id');
            if (userId) {
                const users = StorageService.get<User[]>(KEYS.USERS);
                const currentUser = users?.find(u => u.id === userId);
                if (currentUser) {
                    if (currentUser.status === 'suspended') {
                        logout();
                    } else {
                        setUser(currentUser);
                        setIsAuthenticated(true);
                    }
                } else {
                    // Token exists but user not found (storage cleared?)
                    logout();
                }
            } else {
                logout();
            }
        }
    }, []);

    const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
        StorageService.initialize();
        const users = StorageService.get<User[]>(KEYS.USERS) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            if (foundUser.status === 'suspended') {
                throw new Error('Conta suspensa');
            }

            const token = 'mock_token_' + Math.random().toString(36).substr(2);
            const storage = remember ? localStorage : sessionStorage;

            storage.setItem('recruitSys_token', token);
            storage.setItem('recruitSys_user_id', foundUser.id);

            setUser(foundUser);
            setIsAuthenticated(true);
            return true;
        }

        return false;
    };

    const logout = () => {
        localStorage.removeItem('recruitSys_token');
        localStorage.removeItem('recruitSys_user_id');
        sessionStorage.removeItem('recruitSys_token');
        sessionStorage.removeItem('recruitSys_user_id');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
