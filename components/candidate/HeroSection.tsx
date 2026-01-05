import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="w-full bg-primary py-12 md:py-16 text-white relative overflow-hidden">
            {/* Subtle Texture for "Management/Legibility" feel */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex flex-col gap-3 text-center md:text-left max-w-3xl">
                    <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-1">
                        <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                        <span className="text-xs font-bold text-white/80">Vagas disponíveis hoje</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                        Venha Construir o Futuro da Educação Conosco!
                    </h1>
                    <p className="text-base text-white/90 font-regular leading-relaxed max-w-xl">
                        Ambiente oficial de recrutamento. Acompanhe processos seletivos e novas oportunidades em tempo real.
                    </p>
                </div>

                {/* Elements from previous version (Indicators) instead of Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 text-white/90">
                    <div className="flex flex-col items-center md:items-end gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-3xl">verified_user</span>
                        <span className="text-[10px] font-bold">Dados seguros</span>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-3xl">speed</span>
                        <span className="text-[10px] font-bold">Alta performance</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
