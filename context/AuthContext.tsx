import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../components/ui/LoadingScreen';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
    isEmailConfirmed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchProfile = useCallback(async (userId: string, retryCount = 0): Promise<User | null> => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        if (!data && retryCount < 2) {
            // Small wait for trigger to finish
            await new Promise(resolve => setTimeout(resolve, 800 * (retryCount + 1)));
            return fetchProfile(userId, retryCount + 1);
        }

        return data as User;
    }, []);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // Check active session
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setIsAuthenticated(true);
                    setIsEmailConfirmed(!!session.user.email_confirmed_at);
                    const profile = await fetchProfile(session.user.id);
                    if (mounted && profile) {
                        setUser(profile);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log('Auth State Change:', event);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                if (session?.user) {
                    setIsAuthenticated(true);
                    setIsEmailConfirmed(!!session.user.email_confirmed_at);

                    if (!user || user.id !== session.user.id) {
                        const profile = await fetchProfile(session.user.id);
                        if (mounted && profile) {
                            setUser(profile);
                        }
                    }
                } else if (event !== 'INITIAL_SESSION') {
                    setIsAuthenticated(false);
                }
            } else if (event === 'SIGNED_OUT') {
                if (mounted) {
                    setUser(null);
                    setIsAuthenticated(false);
                    setIsEmailConfirmed(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const login = useCallback(async (email: string, password: string, remember: boolean): Promise<boolean> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return !!data.user;
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const refreshProfileData = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            if (profile) {
                setUser(profile);
            }
        }
    }, [fetchProfile]);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        refreshProfile: refreshProfileData,
        isAuthenticated,
        isEmailConfirmed
    }), [user, login, logout, refreshProfileData, isAuthenticated, isEmailConfirmed]);

    if (isLoading) {
        return <LoadingScreen message="Gerenciando sessão..." />;
    }

    return (
        <AuthContext.Provider value={contextValue}>
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
