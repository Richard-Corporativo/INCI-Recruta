'use client';

// @page CandidateLogin | @tipo page-component | @versao 3.3.0
// > Login candidato — Balha DS v9.5.0 (Semantic Tokens)
// > Seguindo a configuração de cores do usuário.

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useNavigate } from '@src/lib/router-compat';
import { useAuth } from '@src/hooks/useAuth';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";
import { getSafeNextPath, withNextParam } from '@src/lib/navigation';

const CandidateLogin: React.FC = () => {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const isCompanyView = searchParams?.get('type') === 'company';
    const nextPath = getSafeNextPath(
        searchParams?.get('next'),
        isCompanyView ? '/admin/dashboard' : '/candidate/dashboard'
    );
    
    const { login } = useAuth();
    const { error: toastError, info } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    useEffect(() => {
        setUserNotFound(false);
    }, [email]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUserNotFound(false);

        try {
            // 1. Autentica primeiro
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                if (authError.message?.toLowerCase().includes('invalid') || authError.message?.toLowerCase().includes('credentials')) {
                    setUserNotFound(true);
                    toastError('Email não encontrado ou senha incorreta.');
                } else {
                    toastError('Senha incorreta ou erro na autenticação.');
                }
                setIsLoading(false);
                return;
            }

            if (!authData.user) {
                toastError('Erro inesperado ao autenticar.');
                setIsLoading(false);
                return;
            }

            // 2. Agora autenticado — lê o role do banco (RLS funciona)
            const { data: profile } = await supabase
                .from('users')
                .select('id, role')
                .eq('id', authData.user.id)
                .maybeSingle();

            const companyRoles = ['owner', 'admin', 'manager', 'recruiter', 'quality', 'dp'];
            const role = profile?.role ?? authData.user.user_metadata?.role ?? 'candidate';
            const isSuperAdmin = role === 'super_admin';
            const isUserCompany = companyRoles.includes(role) || isSuperAdmin;

            // 3. Valida portal vs role
            if (isCompanyView && !isUserCompany) {
                await supabase.auth.signOut();
                toastError('Esta é uma conta de Candidato. Por favor, utilize o portal de candidatos.');
                setIsLoading(false);
                return;
            }

            if (!isCompanyView && isUserCompany) {
                info('Sua conta é corporativa. Redirecionando para o portal da empresa...');
            }

            // 4. Carrega perfil completo no contexto e navega
            const success = await login(email, password, false);
            if (success) {
                if (isSuperAdmin) navigate('/super-admin/dashboard');
                else if (isUserCompany) navigate('/admin/dashboard');
                else navigate(nextPath);
            }
        } catch (err: any) {
            toastError('Senha incorreta ou erro na autenticação.');
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
        try {
            const dest = isCompanyView ? '/admin/dashboard' : nextPath;
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${window.location.origin}${dest}` }
            });
            if (error) toastError('Erro ao conectar.');
        } catch {
            toastError('Erro inesperado.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Unified Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to="/vagas" className="outline-none group">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-5 w-auto object-contain"
                    />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest mb-2 border ${
                            isCompanyView 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-accent text-accent-foreground border-border'
                        }`}>
                            {isCompanyView ? 'Portal da Empresa' : 'Acesso ao Perfil'}
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            {isCompanyView ? 'Acesso' : 'Acesse sua'} <br />
                            <span className="text-primary">{isCompanyView ? 'Corporativo' : 'conta'}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            {isCompanyView 
                                ? 'Gerencie suas vagas e encontre os melhores talentos.'
                                : 'Acompanhe suas vagas e gerencie seu perfil profissional.'
                            }
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        {/* Social Auth */}
                        <div className="space-y-3">
                            <button
                                onClick={() => handleSocialLogin('linkedin_oidc')}
                                className="w-full h-12 bg-background border border-border rounded-md flex items-center justify-center gap-3 hover:bg-accent transition-all active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.204 24 24 23.227 24 22.271V1.729C24 .774 23.204 0 22.225 0zM7.12 20.452H3.558V8.995H7.12v11.457zM5.341 7.433a2.064 2.064 0 110-4.128 2.064 2.064 0 010 4.128zM20.451 20.452h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.559V8.995h3.415v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.291z" fill="#0A66C2"/>
                                </svg>
                                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Continuar com LinkedIn</span>
                            </button>
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="w-full h-12 bg-background border border-border rounded-md flex items-center justify-center gap-3 hover:bg-accent transition-all active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                </svg>
                                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Continuar com Google</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">ou use seu e-mail</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="seu@exemplo.com"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Senha</label>
                                        <Link to={isCompanyView ? "/recuperar-senha?type=company" : "/recuperar-senha"} className="text-[10px] font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest">
                                            Esqueci
                                        </Link>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {userNotFound && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in zoom-in duration-300">
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-relaxed">
                                        Não encontramos sua conta. <br/>
                                        <Link to={isCompanyView ? "/cadastro/empresa" : withNextParam("/cadastro/candidato", nextPath)} className="underline decoration-primary/30 hover:decoration-primary transition-all">
                                            Deseja criar um perfil agora?
                                        </Link>
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm group"
                            >
                                {isLoading ? (
                                    <Icon icon="svg-spinners:ring-resize" className="size-6" />
                                ) : (
                                    <>
                                        <span>Entrar na Plataforma</span>
                                        <Icon icon="material-symbols:arrow-forward-rounded" className="size-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-muted-foreground">
                                {isCompanyView ? 'Sua empresa ainda não tem conta?' : 'Ainda não tem conta?'}
                                <Link 
                                    to={isCompanyView ? "/cadastro/empresa" : withNextParam("/cadastro/candidato", nextPath)} 
                                    className="text-primary hover:text-secondary font-bold uppercase tracking-widest block mt-0.4"
                                >
                                    {isCompanyView ? 'Começar a recrutar' : 'Criar conta gratuita'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateLogin;
