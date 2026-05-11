'use client';

// @component AuthContext | @tipo context | @versao 1.0.0
// > Gestão centralizada de sessão — login, logout, refresh de perfil
// @api AuthProvider, useAuth() → { user, login, logout, refreshProfile, isAuthenticated, isEmailConfirmed, isLoading }
// @state user — sessão Supabase
// @state isLoading — estado de carregamento
// @action login — autentica usuário
// @action logout — encerra sessão
// @rule Força re-fetch se user.id muda, cleanup no unmount
// @rule Fallback para metadata se DB indisponível (timeout 4s)
// @calls supabase.ts — cliente Supabase
// @references types/index.ts — User
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@src/types';
import { supabase } from '@src/lib/supabase';

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

            // Garante que temos os metadados para merge ou fallback
            let metadata = authUserMetadata;
            if (!metadata) {
                const { data } = await supabase.auth.getUser();
                metadata = data?.user?.user_metadata;
            }

            // 1. Tenta buscar na tabela pública com timeout de 4 segundos
            const fetchPromise = supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT_FETCH')), 4000)
            );

            let profileData: any = null;
            try {
                const result: any = await Promise.race([fetchPromise, timeoutPromise]);
                if (result.data) {
                    profileData = result.data;
                    console.log('[AuthContext] Perfil encontrado no banco:', profileData.name);
                }
            } catch (err) {
                console.warn('[AuthContext] Timeout ou erro ao buscar no banco, tentando fallback...', err);
            }

            if (profileData) {
                return {
                    ...profileData,
                    terms_accepted: profileData.terms_accepted ?? metadata?.terms_accepted,
                    terms_accepted_at: profileData.terms_accepted_at ?? metadata?.terms_accepted_at
                } as User;
            }

            // 2. Fallback Imediato: Auth Metadata
            console.warn('[AuthContext] Usando metadados de Auth como fallback...');

            const fallbackUser: User = {
                id: userId,
                name: metadata?.full_name || metadata?.name || 'Usuário',
                full_name: metadata?.full_name,
                company_name: metadata?.company_name,
                email: metadata?.email || '',
                role: 'candidate',
                status: metadata?.status || 'pending_approval',
                lastAccess: new Date().toISOString(),
                terms_accepted: metadata?.terms_accepted || false,
                terms_accepted_at: metadata?.terms_accepted_at
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
                                const { data: { session }, error } = await supabase.auth.getSession();
                
                // Trata erro de refresh token inválido (comum após reset de banco)
                if (error && (error.message.includes('Refresh Token') || error.status === 400)) {
                    console.warn('[AuthContext] Sessão inválida ou token expirado detectado. Fazendo logout...');
                    await supabase.auth.signOut();
                    if (mounted) setUser(null);
                    return;
                }

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
            console.log(`[AuthContext] Evento Supabase: ${event}`, session ? `Usuário: ${session.user.email}` : 'Sem sessão');

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsLoading(false);
            } else if (session?.user) {
                // Se já temos o usuário e o ID é o mesmo, apenas desliga o loading
                if (user && user.id === session.user.id) {
                    console.log('[AuthContext] Usuário já carregado, pulando fetchProfile');
                    setIsLoading(false);
                    return;
                }

                console.log('[AuthContext] Buscando perfil para sessão ativa...');
                const profile = await fetchProfile(session.user.id, session.user.user_metadata);
                if (mounted) {
                    setUser(profile);
                    setIsLoading(false);
                }
            } else {
                if (mounted) {
                    console.log('[AuthContext] Nenhuma sessão encontrada no evento');
                    setUser(null);
                    setIsLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

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
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const profile = await fetchProfile(authUser.id, authUser.user_metadata);
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
