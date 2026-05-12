'use client';

// @page RequestAccess | @tipo page-component | @versao 9.6.0
// > Solicitação de acesso admin — Semantic Tokens

import React from 'react';
import { Link, useNavigate } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

const RequestAccess: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Solicitação protocolada com sucesso.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20 text-foreground">
            {/* Unified Header */}
            <header className="w-full h-20 border-b border-border bg-card flex items-center px-6 lg:px-12 shrink-0 z-50 sticky top-0">
                <Link to="/login" className="outline-none group">
                    <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-8 w-auto" />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest mb-2 border border-border">
                            Acesso Admin
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                            Novo <br />
                            <span className="text-primary">Protocolo</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Solicite acesso para gerenciar o fluxo de recrutamento.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-8 sm:p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome funcional"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail Institucional</label>
                                    <input
                                        type="email"
                                        placeholder="nome@empresa.com"
                                        className="w-full h-12 px-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Departamento</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 pl-4 pr-10 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer appearance-none"
                                            required
                                        >
                                            <option value="" disabled selected>Selecione a área</option>
                                            <option value="hr">Recursos Humanos</option>
                                            <option value="tech">Tecnologia</option>
                                            <option value="ops">Operações</option>
                                        </select>
                                        <Icon icon="material-symbols:expand-more-rounded" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-5" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Justificativa</label>
                                    <textarea
                                        placeholder="Descreva brevemente sua necessidade..."
                                        className="w-full h-24 p-4 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <button
                                    type="submit"
                                    className="w-full h-14 bg-primary text-primary-foreground font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm group"
                                >
                                    <span>Protocolar Pedido</span>
                                    <Icon icon="material-symbols:send-rounded" className="size-5 transition-transform group-hover:translate-x-1" />
                                </button>
                                
                                <div className="text-center">
                                    <Link to="/login" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary flex items-center justify-center gap-2 transition-all group/back">
                                        <Icon icon="material-symbols:arrow-back-rounded" className="size-4 transition-transform group-hover/back:-translate-x-1" />
                                        Voltar para o login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RequestAccess;
