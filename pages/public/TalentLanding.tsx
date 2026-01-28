import React from 'react';
import { Link } from 'react-router-dom';

const TalentLanding: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 -z-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Banco de Talentos Aberto
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                            Construa o futuro do recrutamento conosco
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Não encontrou a vaga ideal hoje? Não se preocupe. Deixe seu perfil em nosso Banco de Talentos e seja o primeiro a saber quando novas oportunidades surgirem.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/cadastro"
                                className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                                Cadastrar no Banco de Talentos
                            </Link>
                            <Link
                                to="/vagas"
                                className="w-full sm:w-auto h-14 px-8 bg-white border border-slate-200 hover:border-primary/30 hover:bg-primary/5 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Ver vagas abertas
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center group">
                            <div className="size-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Cultura de Aprendizado</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Valorizamos a curiosidade e o crescimento contínuo. Aqui, você terá espaço para aprender e evoluir todos os dias.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="size-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Impacto Real</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Nossas soluções tocam a vida de milhares de candidatos e recrutadores. Seu trabalho terá propósito e visibilidade.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="size-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">favorite</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Ambiente Colaborativo</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Acreditamos que o talento ganha jogos, mas o trabalho em equipe ganha campeonatos. Venha somar com a gente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 bg-slate-50 rounded-[3rem] mx-4 lg:mx-8 mb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Como funciona o Banco de Talentos?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Cadastro', desc: 'Crie sua conta em segundos com e-mail e senha.' },
                            { step: '02', title: 'Perfil', desc: 'Complete seu perfil com suas experiências e currículo.' },
                            { step: '03', title: 'Matching', desc: 'Nosso algoritmo cruza seu perfil com novas vagas.' },
                            { step: '04', title: 'Contato', desc: 'Nossos recrutadores entrarão em contato para entrevistas.' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <span className="absolute -top-4 left-8 px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg">{item.step}</span>
                                <h4 className="text-lg font-bold text-slate-900 mt-2 mb-3">{item.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="bg-primary rounded-[2rem] p-12 text-center text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-3xl font-bold mb-6">Pronto para dar o próximo passo?</h2>
                        <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
                            Junte-se a centenas de profissionais talentosos que já fazem parte da nossa comunidade.
                        </p>
                        <Link
                            to="/cadastro"
                            className="inline-flex h-14 px-10 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-all items-center gap-2"
                        >
                            Começar agora gratuitamento
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TalentLanding;
