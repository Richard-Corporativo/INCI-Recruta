'use client';

// @page NotFound | @tipo page-component | @versao 2.0.0
// > Página 404 — Balha DS v9.1.0
// @calls Link — navegação

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased">

            {/* Header Strip */}
            <header className="w-full bg-foreground py-6 px-6 md:px-12 flex items-center justify-start">
                <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-7 w-auto brightness-0 invert" />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-[480px] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Title */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-8">
                            <div className="size-24 rounded-[28px] bg-destructive/10 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                                <span className="text-3xl font-bold text-destructive">404</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Página não encontrada
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[380px] mx-auto">
                            O link pode estar incorreto, a página pode ter sido movida ou a vaga já foi preenchida.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-card border-2 border-border/50 shadow-2xl shadow-primary/5 rounded-[32px] p-8 md:p-10 space-y-8">

                        {/* Search */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                                Buscar oportunidades
                            </label>
                            <div className="flex gap-2 p-1.5 bg-muted/30 border-2 border-border/50 rounded-2xl focus-within:border-primary/40 transition-all">
                                <input
                                    className="flex-1 h-11 px-3 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/30"
                                    placeholder="Ex.: marketing, vendas"
                                    type="text"
                                />
                                <button className="h-11 px-6 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all hover:bg-primary/90 active:scale-[0.96] shadow-lg shadow-primary/20">
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-border/50 flex flex-col gap-3">
                            <Link
                                to="/vagas"
                                className="group h-14 bg-primary text-primary-foreground font-bold text-[11px] uppercase tracking-[0.15em] rounded-2xl transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center justify-between px-8 shadow-xl shadow-primary/20"
                            >
                                <span>Ver vagas abertas</span>
                                <Icon icon="material-symbols:east" className="size-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/admin/dashboard"
                                className="group h-14 bg-background border-2 border-border/80 text-foreground font-bold text-[11px] uppercase tracking-[0.15em] rounded-2xl transition-all hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98] flex items-center justify-between px-8"
                            >
                                <span>Voltar ao início</span>
                                <Icon icon="material-symbols:home-outline" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t-2 border-border py-6 px-8">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        INCI Recruta · Todos os Direitos Reservados
                    </span>
                    <div className="flex gap-6 text-[11px] font-semibold">
                        <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos</Link>
                        <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Privacidade</Link>
                        <a href="mailto:suporte@incibrasil.com" className="text-muted-foreground hover:text-primary transition-colors">Ajuda</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NotFound;
