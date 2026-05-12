'use client';

// @page VerifyEmail | @tipo page-component | @versao 3.3.0
// > Verificação de email — Semantic Tokens

import React, { useState } from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import { useAuth } from '@src/context/AuthContext';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const VerifyEmail: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { success, error, info } = useToast();
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        if (!user?.email) return;
        setIsResending(true);
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/#/login`
                }
            });
            if (resendError) throw resendError;
            success('E-mail reenviado!');
        } catch (err: any) {
            error('Erro ao reenviar.');
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckStatus = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
            success('Confirmado!');
            window.location.reload();
        } else {
            info('Aguardando confirmação...');
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
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Ativação
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Quase <br />
                            <span className="text-primary">Lá.</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Confirme seu acesso através do link enviado ao seu e-mail.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="relative">
                                <div className="size-24 bg-primary/5 rounded-full flex items-center justify-center text-primary transition-transform hover:scale-105 duration-300">
                                    <Icon icon="material-symbols:mark-email-read-outline-rounded" className="size-12" />
                                </div>
                                <div className="absolute -top-1 -right-1 size-8 bg-card border border-border rounded-full flex items-center justify-center text-secondary shadow-sm">
                                    <Icon icon="material-symbols:check-circle-rounded" className="size-6" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-sm font-bold text-foreground">
                                    {user?.email || 'Verificando...'}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[240px]">
                                    Acesse o link enviado para liberar todas as funcionalidades da plataforma.
                                </p>
                            </div>

                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => navigate('/candidate/dashboard')}
                                    className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm group"
                                >
                                    <span>Ir para Dashboard</span>
                                    <Icon icon="material-symbols:arrow-forward-rounded" className="size-5 transition-transform group-hover:translate-x-1" />
                                </button>

                                <button
                                    onClick={handleCheckStatus}
                                    className="w-full h-12 bg-background border border-border text-foreground font-bold text-[11px] uppercase tracking-widest rounded-md transition-all hover:bg-accent active:opacity-90"
                                >
                                    Já confirmei o e-mail
                                </button>
                            </div>

                            <div className="w-full pt-8 border-t border-border flex flex-col gap-6 items-center">
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-all disabled:opacity-50"
                                >
                                    {isResending ? 'Processando...' : 'Reenviar e-mail de confirmação'}
                                </button>
                                
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest hover:text-destructive transition-all"
                                >
                                    Sair da conta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VerifyEmail;
