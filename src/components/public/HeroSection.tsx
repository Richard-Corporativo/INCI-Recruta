// @component HeroSection | @tipo componente | @versao 1.0.0
// > Hero section página de vagas — layout Light Balha 9.1, CTA

import React from 'react';
import { Icon } from "@iconify/react";
import { Link } from '@src/lib/router-compat';

const HeroSection: React.FC = () => {
    return (
        <section className="w-full bg-primary pt-16 pb-20 text-primary-foreground relative overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none opacity-15"
            />
            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 flex flex-col">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
                    <div className="flex flex-col gap-6 max-w-2xl pt-4">
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full w-fit">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                                Terminal de Oportunidades
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
                            Construir o <span className="text-white/50">Futuro.</span>
                        </h1>

                        <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-xl">
                            Acesse o ecossistema de recrutamento da INCI. 
                            Tecnologia de alto impacto para talentos que desafiam o status quo.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                to="/vagas"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors"
                            >
                                Ver Vagas
                            </Link>
                            <Link
                                to="/cadastro"
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold text-sm rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                            >
                                Criar Conta
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-1 min-w-[140px]">
                            <Icon icon="material-symbols:stack" className="size-4 text-white/40" />
                            <p className="text-2xl font-semibold tracking-tight tabular-nums leading-none">6</p>
                            <p className="text-[8px] font-semibold uppercase tracking-widest text-white/30">
                                Vagas Ativas
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-1 min-w-[140px]">
                            <Icon icon="material-symbols:lightning-stand" className="size-4 text-white/40" />
                            <p className="text-2xl font-semibold tracking-tight tabular-nums leading-none">24/7</p>
                            <p className="text-[8px] font-semibold uppercase tracking-widest text-white/30">
                                Operação
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
