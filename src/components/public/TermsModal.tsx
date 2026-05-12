// @component TermsModal | @tipo componente | @versao 1.0.0
// > Modal de Termos de Uso e Política de Privacidade — scroll, agree button
// @api isOpen: bool, type: 'terms' | 'privacy', onClose: fn, onAgree: fn

import React, { useRef, useState, useEffect } from 'react';
import BaseModal from '../shared/BaseModal';
import { Icon } from "@iconify/react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
    type: 'terms' | 'privacy';
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAgree, type }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Use a small buffer to account for rounding errors
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setHasScrolledToBottom(true);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            setHasScrolledToBottom(false);
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
                // Check if content is already at bottom (short content)
                const { scrollHeight, clientHeight } = scrollRef.current;
                if (scrollHeight <= clientHeight) {
                    setHasScrolledToBottom(true);
                }
            }
        }
    }, [isOpen]);

    const termsContent = (
        <div className="space-y-10 text-muted-foreground leading-relaxed transition-colors">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                    Ao acessar ou utilizar a plataforma <span className="font-bold text-foreground">INCI Recruta</span>, você declara que leu, compreendeu e aceita estes <span className="font-bold text-foreground">Termos de Serviço</span>, bem como a Política de Privacidade aplicável ao tratamento de seus dados pessoais.
                </p>
            </div>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Definições Gerais</h2>
                <p>
                    Para estes Termos, “Plataforma” significa o ambiente digital da INCI Recruta destinado à divulgação de vagas, cadastro de perfil profissional, candidatura, comunicação e acompanhamento de processos seletivos.
                </p>
                <p className="mt-4">
                    “Candidato” ou “Usuário” significa a pessoa física que acessa a Plataforma, cadastra informações profissionais, envia currículo, candidata-se a vagas ou utiliza funcionalidades relacionadas ao recrutamento e seleção.
                </p>
                <p className="mt-4">
                    “Empresas”, “Recrutadores” ou “Parceiros” significam organizações autorizadas a divulgar vagas, avaliar candidaturas ou conduzir processos seletivos por meio da Plataforma.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Finalidade da Plataforma</h2>
                <p>
                    A INCI Recruta oferece uma plataforma de apoio a processos de recrutamento e seleção. A Plataforma pode facilitar o cadastro de candidatos, a busca por vagas, a candidatura, a triagem de perfis, a comunicação entre partes envolvidas e a gestão de etapas seletivas.
                </p>
                <p className="mt-4">
                    A candidatura a uma vaga não garante entrevista, aprovação, contratação, promessa de emprego, recolocação profissional ou obrigação futura por parte da INCI Recruta, empresas anunciantes ou recrutadores.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Cadastro e Responsabilidade do Candidato</h2>
                <p>
                    O Candidato deve fornecer informações verdadeiras, atualizadas e compatíveis com sua experiência profissional, formação, habilidades, disponibilidade e demais dados informados no perfil ou candidatura.
                </p>
                <p className="mt-4">
                    É responsabilidade do Candidato manter seus dados atualizados e proteger suas credenciais de acesso. O uso indevido da conta por terceiros deve ser comunicado à INCI Recruta pelos canais oficiais.
                </p>
                <p className="mt-4 italic">
                    É proibido inserir informações falsas, currículos de terceiros sem autorização, conteúdo ofensivo, discriminatório, ilícito, fraudulento ou que viole direitos de terceiros.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Uso Adequado da Plataforma</h2>
                <p className="mb-4">O Usuário concorda em utilizar a Plataforma apenas para fins lícitos e relacionados à busca, divulgação, gestão ou participação em oportunidades profissionais. É proibido:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                    <li>Tentar acessar áreas, contas, sistemas ou dados sem autorização.</li>
                    <li>Praticar engenharia reversa, exploração de vulnerabilidades, scraping abusivo ou coleta indevida de dados.</li>
                    <li>Enviar spam, mensagens enganosas, golpes, links maliciosos ou conteúdo fraudulento.</li>
                    <li>Inserir informações discriminatórias, ofensivas, difamatórias ou incompatíveis com processos profissionais.</li>
                    <li>Usar a Plataforma para assédio, fraude, venda de serviços não autorizados ou abordagem incompatível com recrutamento.</li>
                    <li>Coletar, copiar ou reutilizar dados de candidatos, empresas ou usuários fora das finalidades permitidas.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Processos Seletivos e Condutas Fora da Plataforma</h2>
                <p>
                    Empresas e recrutadores são responsáveis pela condução de seus processos seletivos, critérios de avaliação, comunicações, entrevistas, propostas e decisões de contratação.
                </p>
                <p className="mt-4">
                    A INCI Recruta pode disponibilizar meios tecnológicos para apoiar esses processos, mas não controla integralmente atos praticados por empresas, recrutadores ou terceiros fora da Plataforma.
                </p>
                <p className="mt-4 font-medium text-foreground">
                    O Candidato deve ter cautela ao compartilhar documentos, imagens, dados financeiros, dados sensíveis ou informações adicionais fora da Plataforma.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Dados Pessoais e Privacidade</h2>
                <p>
                    A INCI Recruta trata dados pessoais conforme a Lei Geral de Proteção de Dados, Lei nº 13.709/2018, e demais normas aplicáveis.
                </p>
                <p className="mt-4">
                    Podemos tratar dados fornecidos pelo Candidato, como nome, e-mail, telefone, localização, currículo, experiências profissionais, formação, habilidades, links profissionais, disponibilidade, histórico de candidaturas, preferências, comunicações e demais informações necessárias ao uso da Plataforma.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Dados Sensíveis, Diversidade e Não Discriminação</h2>
                <p>
                    A Plataforma poderá tratar dados sensíveis somente quando houver base legal adequada e finalidade legítima, como cumprimento de obrigação legal, políticas afirmativas, acessibilidade, vagas destinadas a pessoas com deficiência ou informações fornecidas voluntariamente pelo Candidato.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Recursos Automatizados e Apoio à Triagem</h2>
                <p>
                    A Plataforma poderá usar filtros, critérios de busca, rankings, matching ou outros recursos tecnológicos para organizar informações e apoiar processos seletivos.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Cookies, Logs e Segurança</h2>
                <p>
                    A Plataforma poderá utilizar cookies e tecnologias semelhantes para autenticação, manutenção de sessão, preferências, segurança, melhoria de navegação, métricas e prevenção a fraude.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">Propriedade Intelectual</h2>
                <p>
                    Todos os elementos da Plataforma, incluindo marca, nome, design, textos, interfaces, logotipos, código, banco de dados, fluxos, funcionalidades e demais conteúdos, pertencem à INCI Recruta ou a seus licenciadores.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div className="p-5 rounded-xl bg-accent/30 border border-border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
                        Dúvidas Legais?
                    </h4>
                    <a href="mailto:legal@incibrasil.com" className="text-sm text-primary hover:underline font-medium">legal@incibrasil.com</a>
                </div>
                <div className="p-5 rounded-xl bg-accent/30 border border-border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
                        Privacidade (DPO)
                    </h4>
                    <a href="mailto:dpo@incibrasil.com" className="text-sm text-primary hover:underline font-medium">dpo@incibrasil.com</a>
                </div>
            </div>
        </div>
    );

    const privacyContent = (
        <div className="space-y-10 text-muted-foreground leading-relaxed transition-colors">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                    O <span className="font-bold text-foreground">INCI Recruta</span> utiliza as informações fornecidas pelos candidatos para fins de recrutamento e seleção, cadastro de perfil profissional, acompanhamento de candidaturas e banco de talentos, quando aplicável.
                </p>
            </div>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    1. Coleta e Uso das Informações
                </h2>
                <p>
                    Coletamos dados informados no cadastro, candidatura e atualização de perfil, como nome, e-mail, telefone, localização, currículo, experiências, formação, habilidades, links profissionais, disponibilidade e demais informações relacionadas ao processo seletivo.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    2. Sigilo e Segurança das Informações
                </h2>
                <p>
                    Adotamos medidas técnicas e organizacionais para proteger os dados cadastrados na plataforma. O acesso às informações é restrito a usuários autorizados e deve ocorrer somente para finalidades relacionadas ao recrutamento e seleção.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    3. Seus Direitos (LGPD)
                </h2>
                <ul className="space-y-3">
                    <li className="flex gap-3 items-start transition-colors"><Icon icon="material-symbols:check-circle" className="text-primary mt-0.5 h-5 w-5" aria-hidden="true" /> <span className="text-muted-foreground"><strong>Acesso:</strong> Solicitar uma cópia dos seus dados.</span></li>
                    <li className="flex gap-3 items-start transition-colors"><Icon icon="material-symbols:check-circle" className="text-primary mt-0.5 h-5 w-5" aria-hidden="true" /> <span className="text-muted-foreground"><strong>Correção:</strong> Alterar dados incorretos.</span></li>
                    <li className="flex gap-3 items-start transition-colors"><Icon icon="material-symbols:check-circle" className="text-primary mt-0.5 h-5 w-5" aria-hidden="true" /> <span className="text-muted-foreground"><strong>Eliminação:</strong> Solicitar a exclusão de seus dados.</span></li>
                </ul>
            </section>

            <div className="p-6 bg-primary text-primary-foreground rounded-lg relative overflow-hidden group transition-all duration-200">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon icon="material-symbols:lock-person" className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2 relative z-10 flex items-center gap-2">
                    Canal de Privacidade
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-4 relative z-10">Contate nosso DPO para exercer seus direitos.</p>
                <a href="mailto:dpo@incibrasil.com.br" className="relative z-10 font-semibold text-primary-foreground border-b border-primary-foreground/40 hover:border-primary-foreground transition-all duration-200 outline-none">dpo@incibrasil.com.br</a>
            </div>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
            <div className="flex flex-col h-[85vh] max-h-[750px] bg-background text-foreground transition-all duration-200">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-border flex justify-between items-center bg-background sticky top-0 z-20 transition-colors">
                    <div className="flex flex-col">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight transition-colors">
                            {type === 'terms' ? 'Termos de Serviço' : 'Política de Privacidade'}
                        </h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                            Portal do Candidato • INCI Recruta
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                        aria-label="Fechar"
                    >
                        <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-12 scroll-smooth custom-scrollbar transition-colors"
                >
                    {type === 'terms' ? termsContent : privacyContent}
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${hasScrolledToBottom ? 'text-green-500' : 'text-primary'}`}>
                                {hasScrolledToBottom ? 'Confirmado' : 'Aguardando Leitura'}
                            </span>
                        </div>
                        <p className="text-[13px] font-medium text-muted-foreground leading-tight mt-0.5">
                            {hasScrolledToBottom
                                ? 'Leitura concluída. Você já pode aceitar.'
                                : 'Role até o final para habilitar o aceite.'}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 h-12 rounded-2xl border border-border text-sm font-semibold hover:bg-accent text-foreground transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Fechar
                        </button>
                        <button
                            disabled={!hasScrolledToBottom}
                            onClick={() => {
                                onAgree();
                                onClose();
                            }}
                            className={`flex-1 sm:flex-none px-8 h-12 rounded-2xl text-sm font-semibold transition-all duration-200 transform active:scale-95 border border-border/40 ${hasScrolledToBottom
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                                : 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                                }`}
                        >
                            Aceitar e Continuar
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--muted-foreground);
                }
            `}</style>
        </BaseModal>
    );
};

export default TermsModal;
