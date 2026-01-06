import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
    isEmailConfirmed: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchProfile = useCallback(async (userId: string, authUserMetadata?: any): Promise<User | null> => {
        try {
            console.log(`[AuthContext] fetchProfile iniciado para: ${userId}`);

            // 1. Tenta buscar na tabela pública com timeout de 4 segundos
            const fetchPromise = supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT_FETCH')), 4000)
            );

            let profileData = null;
            try {
                const result: any = await Promise.race([fetchPromise, timeoutPromise]);
                if (result.data) {
                    profileData = result.data;
                    console.log('[AuthContext] Perfil encontrado no banco:', profileData.name);
                }
            } catch (err) {
                console.warn('[AuthContext] Timeout ou erro ao buscar no banco, tentando fallback...');
            }

            if (profileData) return profileData as User;

            // 2. Fallback Imediato: Auth Metadata (sem novas requisições se possível)
            console.warn('[AuthContext] Usando metadados de Auth como fallback...');

            // Se não recebemos metadata, tentamos pegar a sessão atual rapidinho
            let metadata = authUserMetadata;
            if (!metadata) {
                const { data } = await supabase.auth.getUser();
                metadata = data?.user?.user_metadata;
            }

            const fallbackUser: User = {
                id: userId,
                name: metadata?.name || 'Usuário',
                email: metadata?.email || '', // Email geralmente está no metadata ou authUser
                role: (metadata?.role as any) || 'admin',
                status: 'active',
                lastAccess: new Date().toISOString()
            };

            console.log('[AuthContext] Fallback construído:', fallbackUser.name, `[${fallbackUser.role}]`);
            return fallbackUser;

        } catch (e: any) {
            console.error('[AuthContext] Erro crítico no fetchProfile:', e.message);
            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && mounted) {
                    const profile = await fetchProfile(session.user.id, session.user.user_metadata);
                    if (mounted) setUser(profile);
                }
            } catch (err) {
                console.error('[AuthContext] Erro na inicialização:', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log(`[AuthContext] Evento Supabase: ${event}`);

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsLoading(false);
            } else if (session?.user) {
                // Evita loader infinito se já temos o usuário certo
                if (!user || user.id !== session.user.id) {
                    const profile = await fetchProfile(session.user.id, session.user.user_metadata);
                    if (mounted) {
                        setUser(profile);
                        setIsLoading(false);
                    }
                } else {
                    setIsLoading(false);
                }
            } else {
                if (mounted) {
                    setUser(null);
                    setIsLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile, user]); // Adicionei user aqui para o skip logic

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        // Não setamos isLoading total aqui para não travar a tela de login inteira, 
        // deixamos o componente de Login gerenciar seu próprio estado de botão
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                const profile = await fetchProfile(data.user.id, data.user.user_metadata);
                setUser(profile);
            }
            return !!data.user;
        } catch (error) {
            throw error;
        }
    }, [fetchProfile]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setUser(null);
        try {
            await supabase.auth.signOut();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const profile = await fetchProfile(session.user.id, session.user.user_metadata);
            setUser(profile);
        }
    }, [fetchProfile]);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isEmailConfirmed: true,
        isLoading
    }), [user, login, logout, refreshProfile, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
