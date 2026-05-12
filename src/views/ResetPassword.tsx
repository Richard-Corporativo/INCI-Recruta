'use client';

// @page ResetPassword | @tipo page-component | @versao 9.6.0
// > Redefinição de senha — Semantic Tokens

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

const ResetPassword: React.FC = () => {
    const searchParams = useSearchParams();
    const isCompanyView = searchParams?.get('type') === 'company';
    const loginPath = isCompanyView ? '/login?type=company' : '/login';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getPasswordStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    const strength = getPasswordStrength();
    const strengthLabels = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Inviolável'];

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Unified Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to={loginPath} className="outline-none group">
                    <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-8 w-auto" />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-10">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Segurança
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Nova <br />
                            <span className="text-primary">Senha</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Defina uma nova credencial forte para proteger seus dados.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="password">
                                        Nova Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    
                                    {/* Strength Indicator */}
                                    <div className="pt-1 space-y-2">
                                        <div className="flex gap-1 h-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`flex-1 rounded-full transition-all duration-500 ${
                                                        i < strength ? 'bg-secondary' : 'bg-muted'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center px-0.5">
                                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Força da Senha</span>
                                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                                                strength > 2 ? 'text-secondary' : 'text-muted-foreground/60'
                                            }`}>
                                                {strengthLabels[strength]}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="confirmPassword">
                                        Confirmar Nova Senha
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repita a nova senha"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm group" type="button">
                                <span>Redefinir e Entrar</span>
                                <Icon icon="material-symbols:check-circle-rounded" className="size-5 transition-transform group-hover:scale-110" />
                            </button>
                        </form>

                        <div className="pt-8 border-t border-border text-center">
                            <Link to={loginPath} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
                                Cancelar e voltar ao login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
