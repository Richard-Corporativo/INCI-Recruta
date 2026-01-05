import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
    return (
        <div className="bg-background min-h-screen transition-all duration-200">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-in fade-in duration-500">
                <div className="flex flex-col gap-6 mb-16">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full border border-primary/20">Informação legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                        Termos de serviço
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-muted-foreground transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-primary">history_edu</span>
                            <span>Versão 2.4.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-primary">event_available</span>
                            <span>Outubro de 2023</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-16 text-muted-foreground transition-colors">
                    <p className="text-2xl font-semibold text-foreground leading-relaxed">
                        Ao utilizar a plataforma de carreiras da <span className="text-primary italic">INCI Brasil</span>, você aceita integralmente as condições estabelecidas nestes termos.
                    </p>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            01. Definições Gerais
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">
                            Para os fins destes Termos de Serviço, "Plataforma" refere-se ao ambiente digital de recrutamento da INCI Brasil. "Candidato" ou "Usuário" refere-se a qualquer pessoa física que cadastra seu currículo ou navega pelas vagas disponíveis. "Serviços" engloba todas as funcionalidades de busca de vagas, aplicação e gestão de perfil profissional oferecidas neste site.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            02. Uso Adequado
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">Você concorda em utilizar a Plataforma exclusivamente para fins lícitos e relacionados à busca de oportunidades profissionais. É estritamente proibido:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Inserir informações falsas ou imprecisas.",
                                "Tentar violar a segurança da rede.",
                                "Utilizar a plataforma para spam.",
                                "Coletar dados de outros usuários."
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center p-6 rounded-xl bg-card text-card-foreground border border-border group hover:border-ring transition-all duration-300">
                                    <span className="material-symbols-outlined text-destructive text-[22px] group-hover:scale-110 transition-transform">block</span>
                                    <span className="text-[10px] font-semibold">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            03. Dados Pessoais
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">A INCI Brasil compromete-se a tratar seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD). Para detalhes específicos sobre retenção, exclusão e uso de dados, consulte nossa <Link to="/privacidade" className="text-primary hover:underline font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Política de Privacidade</Link>.</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            04. Propriedade Intelectual
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">Todo o conteúdo visual, design, logotipos, textos e software presentes neste site são de propriedade exclusiva da INCI Brasil ou de seus licenciadores e são protegidos pelas leis de direitos autorais e propriedade industrial.</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                        <div className="p-10 rounded-2xl bg-primary/5 border border-primary/10 transition-all duration-300 group hover:bg-primary/10">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="material-symbols-outlined text-primary text-[28px] group-hover:rotate-12 transition-transform">gavel</span>
                                <h4 className="font-semibold text-foreground text-xs">Canais jurídicos</h4>
                            </div>
                            <p className="text-[10px] font-semibold text-muted-foreground mb-6 leading-relaxed">Caso tenha dúvidas sobre como operamos nossos serviços ou deseje contestar algo.</p>
                            <a href="mailto:legal@incibrasil.com" className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm tracking-tight border-b-2 border-primary/20 hover:border-primary pb-1">legal@incibrasil.com</a>
                        </div>
                        <div className="p-10 rounded-2xl bg-muted/30 border border-border transition-all duration-300 group hover:border-ring">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="material-symbols-outlined text-primary text-[28px] group-hover:pulse">admin_panel_settings</span>
                                <h4 className="font-semibold text-foreground text-xs">Encarregado (DPO)</h4>
                            </div>
                            <p className="text-[10px] font-semibold text-muted-foreground mb-6 leading-relaxed">Responsável direto pelo tratamento de dados e conformidade com a LGPD.</p>
                            <a href="mailto:dpo@incibrasil.com" className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm tracking-tight border-b-2 border-primary/20 hover:border-primary pb-1">dpo@incibrasil.com</a>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-border text-center">
                    <Link to="/vagas" className="inline-flex items-center gap-3 text-primary font-semibold text-xs hover:gap-5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-6 py-3 border border-primary/10 hover:bg-primary/5">
                        <span className="material-symbols-outlined text-xl">keyboard_backspace</span>
                        Voltar para o portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
