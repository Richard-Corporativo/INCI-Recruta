'use client';

// @page CandidateForgotPassword | @tipo page-component | @versao 3.1.0
// > Recuperar senha candidato — Balha DS v9.1.0 (Subtraction Radical)
// > Unified Design: No Yellow, Primary Blue/Navy only.

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@src/lib/router-compat';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const CandidateForgotPassword: React.FC = () => {
    const { success, error } = useToast();
    const searchParams = useSearchParams();
    const isCompanyView = searchParams?.get('type') === 'company';
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const redirectSuffix = isCompanyView ? '?type=company' : '';
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/redefinir-senha${redirectSuffix}`,
            });

            if (resetError) throw resetError;

            setIsSent(true);
            success('Email enviado! Verifique sua caixa de entrada.');
        } catch (err: any) {
            error('Falha ao enviar email. Verifique se o endereço está correto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex flex-col font-sans antialiased selection:bg-primary/20">
            {/* Unified Header - No Yellow */}
            <header className="w-full h-20 border-b border-hairline bg-canvas flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-surface-soft/40 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-surface-soft text-ink text-[10px] font-semibold uppercase tracking-widest mb-2 border border-hairline">
                            {isCompanyView ? 'Portal da Empresa' : 'Recuperação de Acesso'}
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-ink leading-[1.1]">
                            Esqueceu a <br />
                            <span className="text-primary">senha?</span>
                        </h1>
                        <p className="text-sm text-muted-soft font-medium leading-relaxed">
                            Digite seu e-mail {isCompanyView ? 'corporativo ' : ''}para receber um link de redefinição.
                        </p>
                    </div>

                    <div className="bg-surface-card border border-hairline rounded-md p-8 sm:p-10 space-y-8 relative overflow-hidden">
                        {!isSent ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-muted-soft uppercase tracking-widest ml-1">E-mail de acesso</label>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="w-full h-11 px-4 bg-canvas border border-hairline rounded-md text-sm font-normal text-ink focus:border-primary outline-none transition-all placeholder:text-muted-soft/40 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-primary text-white font-semibold text-sm rounded-md transition-all hover:bg-primary-hover active:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 group"
                                >
                                    {isLoading ? (
                                        <Icon icon="svg-spinners:ring-resize" className="size-5" />
                                    ) : (
                                        <>
                                            <span>Enviar Link de Recuperação</span>
                                            <Icon icon="material-symbols:send-rounded" className="size-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
                                <div className="size-16 rounded-full bg-success/5 text-success flex items-center justify-center border border-success/20">
                                    <Icon icon="material-symbols:mark-email-read-rounded" className="size-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-ink">Link Enviado</h3>
                                <p className="text-sm text-muted-soft font-medium leading-relaxed">
                                    Acabamos de enviar as instruções para o endereço informado.
                                </p>
                            </div>
                        )}

                        <div className="text-center pt-6 border-t border-hairline">
                            <Link to={isCompanyView ? "/login?type=company" : "/login"} className="text-[10px] font-semibold text-muted-soft uppercase tracking-[0.2em] hover:text-primary flex items-center justify-center gap-2 transition-all group/back">
                                <Icon icon="material-symbols:arrow-back-rounded" className="size-4 transition-transform group-hover/back:-translate-x-1" />
                                Voltar para o login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateForgotPassword;
