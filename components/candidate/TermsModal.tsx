import React, { useRef, useState, useEffect } from 'react';
import BaseModal from '../BaseModal';

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
            <p className="text-lg text-foreground font-medium transition-colors">
                Bem-vindo à plataforma de carreiras da <strong>INCI Brasil</strong>. Ao acessar ou utilizar nosso site, você concorda em cumprir e estar vinculado aos seguintes termos e condições.
            </p>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">1. Definições Gerais</h2>
                <p>
                    Para os fins destes Termos de Serviço, "Plataforma" refere-se ao ambiente digital de recrutamento da INCI Brasil. "Candidato" ou "Usuário" refere-se a qualquer pessoa física que cadastra seu currículo ou navega pelas vagas disponíveis. "Serviços" engloba todas as funcionalidades de busca de vagas, aplicação e gestão de perfil profissional oferecidas neste site.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">2. Uso da Plataforma</h2>
                <p className="mb-4">Você concorda em utilizar a Plataforma exclusivamente para fins lícitos e relacionados à busca de oportunidades profissionais. É estritamente proibido:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                    <li>Inserir informações falsas, imprecisas ou enganosas em seu perfil ou currículo.</li>
                    <li>Tentar violar a segurança da rede ou utilizar engenharia reversa em qualquer parte do software.</li>
                    <li>Utilizar a plataforma para distribuir spam, correntes ou qualquer material publicitário não solicitado.</li>
                    <li>Coletar dados de outros usuários sem consentimento explícito.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">3. Cadastro e Dados Pessoais</h2>
                <p>Ao criar uma conta, você é responsável por manter a confidencialidade de suas credenciais de acesso. A INCI Brasil compromete-se a tratar seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD). Para detalhes específicos sobre retenção, exclusão e uso de dados, consulte nossa Política de Privacidade.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">4. Propriedade Intelectual</h2>
                <p>Todo o conteúdo visual, design, logotipos, textos e software presentes neste site são de propriedade exclusiva da INCI Brasil ou de seus licenciadores e são protegidos pelas leis de direitos autorais e propriedade industrial.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">5. Limitação de Responsabilidade</h2>
                <p>A INCI Brasil envida os melhores esforços para manter a plataforma disponível e segura, mas não garante que o serviço será ininterrupto ou livre de erros. Não nos responsabilizamos por falhas técnicas ou indisponibilidade temporária.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-gray-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">gavel</span>
                        Dúvidas Legais?
                    </h4>
                    <a href="mailto:legal@incibrasil.com" className="text-sm text-primary hover:underline font-medium">legal@incibrasil.com</a>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-gray-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600 text-xl">admin_panel_settings</span>
                        Encarregado (DPO)
                    </h4>
                    <a href="mailto:dpo@incibrasil.com" className="text-sm text-primary hover:underline font-medium">dpo@incibrasil.com</a>
                </div>
            </div>
        </div>
    );

    const privacyContent = (
        <div className="space-y-10 text-slate-600 dark:text-gray-300 leading-relaxed">
            <p className="text-lg">
                A sua privacidade é fundamental para a <strong>INCI Brasil</strong>. Esta política detalha como coletamos, utilizamos e protegemos suas informações pessoais.
            </p>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    <span className="text-primary material-symbols-outlined transition-colors">folder_shared</span>
                    1. Coleta de Dados
                </h2>
                <p className="mb-4 transition-colors">Coletamos informações que você nos fornece diretamente ao cadastrar seu currículo:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary transition-colors">
                    <li><strong>Dados de Identificação:</strong> Nome, data de nascimento, CPF.</li>
                    <li><strong>Dados de Contato:</strong> E-mail, telefone, endereço.</li>
                    <li><strong>Dados Profissionais:</strong> Histórico educacional, experiências e portfólio.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    <span className="text-primary material-symbols-outlined transition-colors">engineering</span>
                    2. Uso das Informações
                </h2>
                <p className="transition-colors">Utilizamos seus dados exclusivamente para fins de recrutamento e seleção. Seus dados não serão utilizados para fins publicitários sem o seu consentimento.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    <span className="text-primary material-symbols-outlined transition-colors">share</span>
                    3. Compartilhamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card text-card-foreground border border-border shadow-sm">
                        <p className="font-semibold text-foreground text-sm transition-colors">Equipe de RH</p>
                        <p className="text-xs text-muted-foreground transition-colors">Recrutadores internos.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card text-card-foreground border border-border shadow-sm">
                        <p className="font-semibold text-foreground text-sm transition-colors">Gestores de Vaga</p>
                        <p className="text-xs text-muted-foreground transition-colors">Líderes das áreas.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                    <span className="text-primary material-symbols-outlined transition-colors">gavel</span>
                    4. Seus Direitos (LGPD)
                </h2>
                <ul className="space-y-3">
                    <li className="flex gap-3 items-start transition-colors"><span className="material-symbols-outlined text-primary mt-0.5 transition-colors">check_circle</span> <span className="text-muted-foreground"><strong>Acesso:</strong> Solicitar uma cópia dos seus dados.</span></li>
                    <li className="flex gap-3 items-start transition-colors"><span className="material-symbols-outlined text-primary mt-0.5 transition-colors">check_circle</span> <span className="text-muted-foreground"><strong>Correção:</strong> Alterar dados incorretos.</span></li>
                    <li className="flex gap-3 items-start transition-colors"><span className="material-symbols-outlined text-primary mt-0.5 transition-colors">check_circle</span> <span className="text-muted-foreground"><strong>Eliminação:</strong> Solicitar a exclusão de seus dados.</span></li>
                </ul>
            </section>

            <div className="p-6 bg-primary text-primary-foreground rounded-lg shadow-lg relative overflow-hidden group transition-all duration-200">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[80px]">lock_person</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined transition-colors">security</span>
                    Canal de Privacidade
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-4 relative z-10 transition-colors">Contate nosso DPO para exercer seus direitos.</p>
                <a href="mailto:dpo@incibrasil.com.br" className="relative z-10 font-semibold text-primary-foreground border-b border-primary-foreground/40 hover:border-primary-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">dpo@incibrasil.com.br</a>
            </div>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
            <div className="flex flex-col h-[85vh] max-h-[750px] bg-background text-foreground transition-all duration-200">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-border flex justify-between items-start bg-background relative z-10 transition-colors">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider rounded-full border border-primary/20 transition-colors">Legal</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight transition-colors">
                            {type === 'terms' ? 'Termos de Serviço' : 'Política de Privacidade'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground transition-colors">
                            <span className="material-symbols-outlined text-[16px]">history</span>
                            <span>Versão {type === 'terms' ? '2.4' : '2.1'} • Atualizado em Outubro 2023</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-full transition-all text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Fechar"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
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
                    <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center transition-all shadow-inner ${hasScrolledToBottom
                            ? 'bg-primary/20 text-primary dark:bg-primary/30 animate-in zoom-in duration-300'
                            : 'bg-muted text-muted-foreground'
                            }`}>
                            <span className="material-symbols-outlined text-2xl font-semibold">
                                {hasScrolledToBottom ? 'check' : 'priority_high'}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${hasScrolledToBottom ? 'text-green-500' : 'text-primary'}`}>
                                    {hasScrolledToBottom ? 'Confirmado' : 'Aguardando Leitura'}
                                </span>
                                {!hasScrolledToBottom && (
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>
                            <p className="text-[13px] font-medium text-muted-foreground leading-tight mt-0.5">
                                {hasScrolledToBottom
                                    ? 'Leitura concluída. Você já pode aceitar.'
                                    : 'Role até o final para habilitar o aceite.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 h-12 rounded-base border border-border text-sm font-semibold hover:bg-accent text-foreground transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Fechar
                        </button>
                        <button
                            disabled={!hasScrolledToBottom}
                            onClick={() => {
                                onAgree();
                                onClose();
                            }}
                            className={`flex-1 sm:flex-none px-8 h-12 rounded-base text-sm font-semibold transition-all duration-200 shadow-md transform active:scale-95 border border-border/40 ${hasScrolledToBottom
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg cursor-pointer'
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
