'use client';

// @route CadastroChoicePage | @tipo page | @versao 1.0.0
// > Seletor de tipo de cadastro — Candidato vs Empresa

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

export default function Page() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-background">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Opção Candidato */}
                <Link 
                    to="/cadastro/candidato"
                    className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all  overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="material-symbols:person-search-rounded" className="size-32" />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Icon icon="material-symbols:person-add-rounded" className="size-8" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Sou Candidato</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Encontre as melhores oportunidades, acompanhe seus processos e construa sua carreira.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            Criar Perfil Grátis
                            <Icon icon="material-symbols:arrow-forward-rounded" className="size-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Opção Empresa */}
                <Link 
                    to="/cadastro/empresa"
                    className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all  overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="material-symbols:business-center-rounded" className="size-32 text-primary" />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Icon icon="material-symbols:corporate-fare-rounded" className="size-8" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Sou Empresa</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Publique vagas, gerencie candidatos e encontre o talento ideal para sua equipe.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            Começar a Recrutar
                            <Icon icon="material-symbols:arrow-forward-rounded" className="size-4 group-hover:translate-x-1 transition-transform" />
                        </div>

                    </div>
                </Link>
            </div>
        </div>
    );
}
