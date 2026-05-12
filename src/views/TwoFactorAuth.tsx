'use client';

// @page TwoFactorAuth | @tipo page-component | @versao 1.0.0
// > Autenticação 2FA — TOTP setup, verificação, backup codes
// @calls useAuth — verify2FA, Link — navegação

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

const TwoFactorAuth: React.FC = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20">
            {/* Minimal Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0">
                <Link to="/login" className="outline-none group">
                    <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-8 w-auto" />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-10">
                        <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-2 border-2 border-secondary/20">
                            Segurança Ativa
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">
                            Chave <span className="text-secondary underline decoration-secondary/20 underline-offset-8">Dual-Auth</span>
                        </h1>
                        <p className="text-sm font-semibold text-muted-foreground max-w-[300px] mx-auto leading-relaxed">
                            Confirme sua identidade operacional para prosseguir com privilégios de alto nível.
                        </p>
                    </div>

                    <div className="bg-card border-2 border-border rounded-3xl p-8 sm:p-10 space-y-8 relative shadow-2xl shadow-primary/5">
                        <form action="#" className="space-y-6" method="POST">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1" htmlFor="verification-code">
                                    Código de Verificação
                                </label>
                                <div className="relative group">
                                    <input 
                                        autoComplete="one-time-code" 
                                        autoFocus 
                                        className="text-center w-full bg-background border-2 border-border rounded-2xl py-5 px-4 text-4xl font-black tracking-[0.3em] text-foreground focus:border-secondary outline-none transition-all placeholder:text-muted-foreground/10" 
                                        id="verification-code" 
                                        maxLength={6} 
                                        name="code" 
                                        placeholder="000000" 
                                        type="text" 
                                    />
                                </div>
                                <div className="p-4 bg-primary/5 border-2 border-primary/10 rounded-2xl flex gap-3 items-start">
                                    <Icon icon="material-symbols:info-outline-rounded" className="text-primary size-5 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-foreground font-bold leading-relaxed opacity-70">
                                        Utilize o código gerado pelo seu token físico ou aplicativo autenticador corporativo.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-secondary animate-pulse" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Código expira em 04:59</span>
                                </div>
                                <button className="text-[10px] font-black text-primary hover:text-secondary transition-colors uppercase tracking-widest" type="button">
                                    Novo Código
                                </button>
                            </div>

                            <button 
                                className="w-full h-14 bg-primary text-white font-black text-sm rounded-2xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20" 
                                type="button"
                            >
                                <span>VALIDAR ACESSO</span>
                                <Icon icon="material-symbols:verified-user-rounded" className="size-5" />
                            </button>

                            <Link 
                                to="/login" 
                                className="w-full h-14 border-2 border-border text-foreground font-bold text-sm rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
                            >
                                <Icon icon="material-symbols:arrow-back-rounded" className="size-5" />
                                VOLTAR AO LOGIN
                            </Link>
                        </form>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase opacity-40">
                            Ambiente Criptografado & Monitorado
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TwoFactorAuth;
