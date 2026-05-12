'use client';

// @page Login | @tipo page-component | @versao 9.6.0
// > Login administrativo — Balha DS v9.5.0 (Semantic Tokens)
// > Seguindo a configuração de cores do usuário.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import { useAuth } from '@src/hooks/useAuth';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const { success, error: toastError } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepConnected, setKeepConnected] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate('/admin/dashboard');
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: profile } = await supabase
                .from('users')
                .select('id, role')
                .eq('email', email.trim().toLowerCase())
                .maybeSingle();

            if (!profile) {
                toastError('Esta conta não possui privilégios administrativos.');
                setIsSubmitting(false);
                return;
            }

            const successLogin = await login(email, password, keepConnected);
            if (successLogin) {
                success('Autenticação realizada com sucesso.');
                navigate('/admin/dashboard');
            } else {
                toastError('Email ou senha incorretos.');
            }
        } catch (err: any) {
            toastError('Ocorreu um erro ao processar seu login.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Unified Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to="/" className="outline-none group">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-8 w-auto"
                    />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Subtle Background Accents */}
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-10">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Área de Gestão
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Acesso <br />
                            <span className="text-primary">Administrativo</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Gerencie o futuro da sua equipe com inteligência e precisão.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="email">
                                        E-mail Institucional
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="nome@empresa.com"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest" htmlFor="password">
                                            Senha de Acesso
                                        </label>
                                        <Link to="/forgot-password" title="Recuperar credenciais" className="text-[10px] font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest">
                                            Esqueceu?
                                        </Link>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 px-1">
                                <input
                                    type="checkbox"
                                    id="keepConnected"
                                    checked={keepConnected}
                                    onChange={(e) => setKeepConnected(e.target.checked)}
                                    className="size-4 rounded border-border bg-input text-primary focus:ring-primary/20"
                                />
                                <label htmlFor="keepConnected" className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                                    Manter sessão ativa
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {isSubmitting ? (
                                    <Icon icon="svg-spinners:ring-resize" className="size-6" />
                                ) : (
                                    <>
                                        <span>Autenticar Acesso</span>
                                        <Icon icon="material-symbols:arrow-forward-rounded" className="size-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-8 text-center border-t border-border space-y-6">
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
                                Acesso restrito a administradores autorizados.<br />
                                PROTOCOLO BALHA V9.3.0
                            </p>
                            <Link to="/request-access" className="inline-block text-[10px] font-bold text-foreground hover:text-secondary transition-colors uppercase tracking-widest border-b border-border pb-1">
                                SOLICITAR NOVAS CREDENCIAIS
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
