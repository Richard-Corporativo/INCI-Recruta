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
import { User, Company } from '@src/types';
import { supabase } from '@src/lib/supabase';
import { clearTenantCache, primeTenantCache } from '@src/lib/tenant';

interface AuthContextType {
    user: User | null;
    company: Company | null;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
    isEmailConfirmed: boolean;
    isLoading: boolean;
    isSuperAdmin: boolean;
    isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadCompany = useCallback(async (userId: string, metadata?: any): Promise<Company | null> => {
        try {
            let { data: member } = await supabase
                .from('company_members')
                .select('company_id, role, status')
                .eq('user_id', userId)
                .eq('status', 'active')
                .maybeSingle();

            // Self-service: usuário acabou de confirmar email e empresa ainda não foi criada
            // super_admin não tem empresa própria — pula o bootstrap
            if (metadata?.role === 'super_admin') return null;

            if (!member?.company_id && metadata?.pending_company_creation && metadata?.company_name) {
                console.log('[AuthContext] Bootstrap de empresa pendente — chamando create_company_with_owner');
                const { data: newCompany, error: rpcError } = await supabase.rpc('create_company_with_owner', {
                    p_name: metadata.company_name,
                    p_cnpj: metadata.cnpj || null
                });

                // Limpa a flag independente do resultado para não tentar novamente
                await supabase.auth.updateUser({
                    data: { ...metadata, pending_company_creation: false }
                });

                if (rpcError) {
                    if (rpcError.code !== 'P0001') {
                        console.error('[AuthContext] Falha ao criar empresa no bootstrap:', rpcError);
                        return null;
                    }
                    // P0001 = usuário já vinculado — busca empresa existente abaixo
                } else {
                    return (newCompany as Company) ?? null;
                }
            }

            if (!member?.company_id) {
                // Tenta buscar membro sem filtro de status (pode estar pending/inactive)
                const { data: anyMember } = await supabase
                    .from('company_members')
                    .select('company_id, role, status')
                    .eq('user_id', userId)
                    .maybeSingle();
                if (!anyMember?.company_id) return null;
                member = anyMember;
            }

            const { data: comp } = await supabase
                .from('companies')
                .select('*')
                .eq('id', member!.company_id)
                .maybeSingle();

            return (comp as Company) ?? null;
        } catch (e) {
            console.warn('[AuthContext] loadCompany falhou:', e);
            return null;
        }
    }, []);

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
                    // Garante que name e role nunca ficam nulos — usa metadata como fallback
                    name: profileData.name || metadata?.full_name || metadata?.name || 'Usuário',
                    role: profileData.role || (metadata?.role as User['role']) || 'candidate',
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
                // Usa o role do metadata (definido no signup) como fallback — nunca 'candidate' fixo
                role: (metadata?.role as User['role']) || 'candidate',
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
                    const comp = await loadCompany(session.user.id, session.user.user_metadata);
                    primeTenantCache(session.user.id, comp?.id ?? null);
                    if (mounted) {
                        setUser(profile);
                        setCompany(comp);
                    }
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
                setCompany(null);
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
                const comp = await loadCompany(session.user.id);
                primeTenantCache(session.user.id, comp?.id ?? null);
                if (mounted) {
                    setUser(profile);
                    setCompany(comp);
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
    }, [fetchProfile, loadCompany]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        // Não setamos isLoading total aqui para não travar a tela de login inteira, 
        // deixamos o componente de Login gerenciar seu próprio estado de botão
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                const profile = await fetchProfile(data.user.id, data.user.user_metadata);
                const comp = await loadCompany(data.user.id, data.user.user_metadata);
                primeTenantCache(data.user.id, comp?.id ?? null);
                setUser(profile);
                setCompany(comp);
            }
            return !!data.user;
        } catch (error) {
            throw error;
        }
    }, [fetchProfile, loadCompany]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setUser(null);
        setCompany(null);
        clearTenantCache();
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
            const comp = await loadCompany(authUser.id, authUser.user_metadata);
            primeTenantCache(authUser.id, comp?.id ?? null);
            setUser(profile);
            setCompany(comp);
        }
    }, [fetchProfile, loadCompany]);

    const value = useMemo(() => ({
        user,
        company,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isEmailConfirmed: true,
        isLoading,
        isSuperAdmin: user?.role === 'super_admin',
        isOwner: user?.role === 'owner'
    }), [user, company, login, logout, refreshProfile, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
