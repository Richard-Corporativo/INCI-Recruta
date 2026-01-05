import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-background min-h-screen transition-all duration-200">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-in fade-in duration-500">
                <div className="flex flex-col gap-6 mb-16">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full border border-primary/20">Proteção de dados</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                        Política de privacidade
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-muted-foreground transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-primary">security</span>
                            <span>Versão 2.1.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                            <span>Outubro de 2023</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-16 text-muted-foreground transition-colors">
                    <p className="text-2xl font-semibold text-foreground leading-relaxed">
                        A transparência é um pilar da <span className="text-primary italic">INCI Brasil</span>. Detalhamos abaixo como protegemos sua jornada profissional e seus dados pessoais.
                    </p>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            01. Coleta de Dados
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">Coletamos informações que você nos fornece diretamente ao cadastrar seu currículo ou preencher formulários em nossa plataforma:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Identificação", items: ["Nome Completo", "Data de Nasc.", "Documentos"], icon: "person" },
                                { title: "Contato", items: ["E-mail", "WhatsApp", "Cidade/UF"], icon: "alternate_email" },
                                { title: "Profissional", items: ["Formação", "Experiências", "Currículo"], icon: "workspace_premium" }
                            ].map((box, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-card border border-border relative overflow-hidden group hover:border-ring transition-all duration-300">
                                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-primary/5 group-hover:scale-110 group-hover:text-primary/10 transition-all">
                                        {box.icon}
                                    </span>
                                    <h4 className="text-[11px] font-semibold text-foreground mb-6 relative z-10">{box.title}</h4>
                                    <ul className="text-[10px] font-semibold space-y-2 relative z-10 text-muted-foreground">
                                        {box.items.map((item, j) => <li key={j} className="flex items-center gap-2"><span className="size-1 rounded-full bg-primary/40"></span>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            02. Uso das Informações
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">Utilizamos seus dados exclusivamente para fins de recrutamento e seleção. Seus dados são processados para avaliar a compatibilidade do seu perfil com as vagas abertas e para entrar em contato durante o processo seletivo. Seus dados <strong>nunca</strong> serão utilizados para fins publicitários sem o seu consentimento explícito.</p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            03. Compartilhamento Seguro
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed">Seus dados são compartilhados internamente apenas com as pessoas diretamente envolvidas na sua contratação:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-all">
                                <p className="text-xs font-semibold text-foreground mb-2">Time de atração</p>
                                <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">Recrutadores responsáveis pela triagem inicial e alinhamento cultural.</p>
                            </div>
                            <div className="p-6 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-all">
                                <p className="text-xs font-semibold text-foreground mb-2">Gestores de área</p>
                                <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">Líderes técnicos que possuem vagas abertas e avaliam o potencial técnico.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-4">
                            <span className="size-2 rounded-full bg-primary"></span>
                            04. Seus Direitos (LGPD)
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed mb-8">A Lei Geral de Proteção de Dados garante a você total controle sobre suas informações pessoais:</p>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: "Acesso e Portabilidade", desc: "Solicite o download integral de todos os seus dados armazenados em nossa base.", icon: "cloud_download" },
                                { title: "Retificação de Dados", desc: "Corrija informações desatualizadas ou imprecisas através do seu painel de candidato.", icon: "edit_document" },
                                { title: "Direito ao Esquecimento", desc: "Solicite a exclusão definitiva e irreversível dos seus dados de nosso sistema.", icon: "delete_forever" }
                            ].map((right, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-2xl bg-card border border-border group hover:border-primary/40 transition-all duration-300 items-center">
                                    <div className="size-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        <span className="material-symbols-outlined text-[28px]">{right.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{right.title}</h4>
                                        <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed opacity-70">{right.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="p-10 md:p-14 bg-foreground text-background rounded-2xl border border-border overflow-hidden relative group transition-all duration-500">
                        <div className="absolute -top-10 -right-10 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:rotate-12">
                            <span className="material-symbols-outlined text-[180px] md:text-[240px]">shield_person</span>
                        </div>
                        <div className="relative z-10 max-w-2xl flex flex-col gap-6">
                            <h3 className="text-3xl font-semibold flex items-center gap-3">
                                Encarregado de dados (DPO)
                            </h3>
                            <p className="text-[11px] font-semibold leading-relaxed opacity-80 text-background/80">
                                Para exercer qualquer um dos seus direitos garantidos pela LGPD ou denunciar irregularidades, entre em contato direto com nosso canal oficial.
                            </p>
                            <a href="mailto:dpo@incibrasil.com.br" className="h-12 flex items-center justify-center px-10 rounded-base bg-primary text-primary-foreground font-semibold text-xs transition-all hover:bg-primary/90 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-fit">
                                dpo@incibrasil.com.br
                            </a>
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

export default PrivacyPolicy;
