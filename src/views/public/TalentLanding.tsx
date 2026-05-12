'use client';

// @page TalentLanding | @tipo page-component | @versao 1.0.0
// > Landing page banco de talentos — benefícios, CTA cadastro
// @calls Link — navegação cadastro

import React from 'react';
import { Link } from '@src/lib/router-compat';

const TalentLanding: React.FC = () => {
    return (
        <div className="bg-background text-foreground">
            <section className="bg-primary text-white py-8 px-4">
                <div className="max-w-4xl">
                    <p className="text-xs font-medium">Terminal de Oportunidades</p>
                    <h1 className="text-xl font-semibold mt-1">Construir o Futuro.</h1>
                    <p className="text-sm mt-1 text-white/80">Recrutamento INCI.</p>
                    <div className="flex gap-2 mt-3">
                        <Link to="/vagas" className="px-3 py-1 bg-white text-primary text-xs font-medium rounded">
                            Ver Vagas
                        </Link>
                        <Link to="/cadastro" className="px-3 py-1 border border-white/30 text-white text-xs font-medium rounded">
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TalentLanding;
