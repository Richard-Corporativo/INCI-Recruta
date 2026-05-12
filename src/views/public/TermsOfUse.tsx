'use client';

// @page TermsOfUse | @tipo page-component | @versao 1.0.0
// > Termos de uso — texto legal, aceite, LGPD
// @calls Link — navegação

import React from 'react';
import { Link } from '@src/lib/router-compat';
import { Icon } from "@iconify/react";

const TermsOfUse: React.FC = () => {
    return (
        <div className="bg-background min-h-screen transition-all duration-200">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-in fade-in duration-500">
                <div className="flex flex-col gap-6 mb-16">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-full border border-primary/20">Informação legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
                        Termos de Serviço
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest transition-colors">
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:history-edu" className="text-primary h-5 w-5" aria-hidden="true" />
                            <span>Versão 3.0.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:event-available" className="text-primary h-5 w-5" aria-hidden="true" />
                            <span>Maio de 2026</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-16 text-muted-foreground transition-colors">
                    <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
                            Ao acessar ou utilizar a plataforma <span className="font-bold text-primary">INCI Recruta</span>, você declara que leu, compreendeu e aceita estes <span className="font-bold text-primary">Termos de Serviço</span>, bem como a Política de Privacidade aplicável ao tratamento de seus dados pessoais.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            Definições Gerais
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>Para estes Termos, “Plataforma” significa o ambiente digital da INCI Recruta destinado à divulgação de vagas, cadastro de perfil profissional, candidatura, comunicação e acompanhamento de processos seletivos.</p>
                            <p>“Candidato” ou “Usuário” significa a pessoa física que acessa a Plataforma, cadastra informações profissionais, envia currículo, candidata-se a vagas ou utiliza funcionalidades relacionadas ao recrutamento e seleção.</p>
                            <p>“Empresas”, “Recrutadores” ou “Parceiros” significam organizações autorizadas a divulgar vagas, avaliar candidaturas ou conduzir processos seletivos por meio da Plataforma.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            Finalidade da Plataforma
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>A INCI Recruta oferece uma plataforma de apoio a processos de recrutamento e seleção. A Plataforma pode facilitar o cadastro de candidatos, a busca por vagas, a candidatura, a triagem de perfis, a comunicação entre partes envolvidas e a gestão de etapas seletivas.</p>
                            <p className="font-semibold text-foreground">A candidatura a uma vaga não garante entrevista, aprovação, contratação, promessa de emprego, recolocação profissional ou obrigação futura por parte da INCI Recruta, empresas anunciantes ou recrutadores.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            Cadastro e Responsabilidade do Candidato
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>O Candidato deve fornecer informações verdadeiras, atualizadas e compatíveis com sua experiência profissional, formação, habilidades, disponibilidade e demais dados informados no perfil ou candidatura.</p>
                            <p>É responsabilidade do Candidato manter seus dados atualizados e proteger suas credenciais de acesso. O uso indevido da conta por terceiros deve ser comunicado à INCI Recruta pelos canais oficiais.</p>
                            <p className="italic bg-muted/50 p-4 rounded-lg border-l-4 border-primary">É proibido inserir informações falsas, currículos de terceiros sem autorização, conteúdo ofensivo, discriminatório, ilícito, fraudulento ou que viole direitos de terceiros.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            Uso Adequado da Plataforma
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm font-medium leading-relaxed mb-6">O Usuário concorda em utilizar a Plataforma apenas para fins lícitos e relacionados à busca, divulgação, gestão ou participação em oportunidades profissionais. É proibido:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Acesso não autorizado a sistemas ou dados.",
                                "Engenharia reversa ou scraping abusivo.",
                                "Envio de spam ou conteúdo fraudulento.",
                                "Inserir informações discriminatórias.",
                                "Uso para assédio ou fraude.",
                                "Coleta indevida de dados de usuários."
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center p-5 rounded-xl bg-card border border-border group transition-all duration-300">
                                    <Icon icon="material-symbols:block" className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
                                    <span className="text-[11px] font-bold uppercase tracking-wide">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            Dados Pessoais e Privacidade
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <p className="text-sm leading-relaxed">
                            A INCI Recruta trata dados pessoais conforme a Lei Geral de Proteção de Dados, Lei nº 13.709/2018, e demais normas aplicáveis. 
                            Consulte nossa <Link to="/privacidade" className="text-primary hover:underline font-bold transition-all">Política de Privacidade</Link> para mais detalhes.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-4">
                                <Icon icon="material-symbols:gavel" className="text-primary h-6 w-6" aria-hidden="true" />
                                <h4 className="font-bold text-foreground text-sm uppercase tracking-widest">Canais jurídicos</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Dúvidas sobre estes Termos ou solicitações jurídicas.</p>
                            <a href="mailto:legal@incibrasil.com" className="text-primary font-bold text-sm border-b-2 border-primary/20 hover:border-primary transition-all pb-1">legal@incibrasil.com</a>
                        </div>
                        <div className="p-8 rounded-2xl bg-muted/30 border border-border transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <Icon icon="material-symbols:admin-panel-settings" className="text-primary h-6 w-6" aria-hidden="true" />
                                <h4 className="font-bold text-foreground text-sm uppercase tracking-widest">Privacidade (DPO)</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Assuntos relacionados à LGPD e proteção de dados.</p>
                            <a href="mailto:dpo@incibrasil.com" className="text-primary font-bold text-sm border-b-2 border-primary/20 hover:border-primary transition-all pb-1">dpo@incibrasil.com</a>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-border text-center">
                    <Link to="/vagas" className="inline-flex items-center gap-3 text-primary font-semibold text-xs hover:gap-5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-6 py-3 border border-primary/10 hover:bg-primary/5">
                        <Icon icon="material-symbols:keyboard-backspace" className="text-xl h-5 w-5" aria-hidden="true" />
                        Voltar para o portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
