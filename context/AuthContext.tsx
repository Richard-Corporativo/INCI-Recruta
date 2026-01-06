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
        let timeoutId: NodeJS.Timeout;

        const initializeAuth = async () => {
            try {
                // Safety timeout: prevent infinite loading (only triggers if something goes wrong)
                timeoutId = setTimeout(() => {
                    if (mounted) {
                        console.warn('[AuthContext] Auth initialization timeout - forcing loading to complete');
                        setIsLoading(false);
                    }
                }, 15000); // 15 seconds max (increased from 10s)

                // Check active session
                const { data: { session } } = await supabase.auth.getSession();
                console.log('[AuthContext] Session check:', session ? 'Active session found' : 'No session');

                if (session?.user) {
                    setIsAuthenticated(true);
                    setIsEmailConfirmed(!!session.user.email_confirmed_at);

                    console.log('[AuthContext] Fetching profile for user:', session.user.id);
                    const profile = await fetchProfile(session.user.id);

                    if (mounted) {
                        if (profile) {
                            console.log('[AuthContext] Profile loaded successfully:', profile.name);
                            setUser(profile);
                        } else {
                            console.warn('[AuthContext] No profile found for user');
                        }
                    }
                } else {
                    console.log('[AuthContext] No active session');
                }
            } catch (error) {
                console.error('[AuthContext] Auth initialization error:', error);
            } finally {
                clearTimeout(timeoutId);
                if (mounted) {
                    console.log('[AuthContext] Auth initialization complete');
                    setIsLoading(false);
                }
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

                    // Clear localStorage cache if any leftovers exist
                    localStorage.removeItem('INCI_RECRUTA_CACHE');
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
        console.log('[AuthContext] Logging out and clearing cache');



        // Clear localStorage cache
        localStorage.removeItem('INCI_RECRUTA_CACHE');

        // Sign out from Supabase
        await supabase.auth.signOut();

        // Clear local state
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
