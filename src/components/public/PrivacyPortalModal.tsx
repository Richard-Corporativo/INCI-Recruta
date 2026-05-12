import React from 'react';
import BaseModal from '../shared/BaseModal';
import { Icon } from "@iconify/react";

interface PrivacyPortalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPortalModal: React.FC<PrivacyPortalModalProps> = ({ isOpen, onClose }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
            <div className="bg-background text-foreground flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
                <div className="flex items-center gap-3">
                         <div>
                            <h2 className="text-xl font-bold tracking-tight">Política de Privacidade</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Portal do Candidato • INCI Recruta</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Fechar"
                    >
                        <Icon icon="material-symbols:close" className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                            O <span className="font-bold text-foreground">INCI Recruta</span> utiliza as informações fornecidas pelos candidatos para fins de recrutamento e seleção, cadastro de perfil profissional, acompanhamento de candidaturas e banco de talentos, quando aplicável.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:database" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">1. Coleta e Uso das Informações</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors">
                                Coletamos dados informados no cadastro, candidatura e atualização de perfil, como nome, e-mail, telefone, localização, currículo, experiências, formação, habilidades, links profissionais, disponibilidade e demais informações relacionadas ao processo seletivo.
                                <br /><br />
                                Essas informações são usadas para viabilizar candidaturas, analisar aderência às vagas, acompanhar processos seletivos, manter o perfil atualizado e facilitar a comunicação com o candidato.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:lock-outline" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">2. Sigilo e Segurança das Informações</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors">
                                Adotamos medidas técnicas e organizacionais para proteger os dados cadastrados na plataforma. O acesso às informações é restrito a usuários autorizados e deve ocorrer somente para finalidades relacionadas ao recrutamento e seleção.
                                <br /><br />
                                Apesar das medidas de segurança aplicadas, nenhuma plataforma digital é isenta de riscos. Por isso, buscamos atuar com prevenção, controle de acesso e melhoria contínua.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:cookie-outline" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">3. Cookies e Tecnologias de Rastreamento</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors">
                                Podemos utilizar cookies e tecnologias similares para manter sessões ativas, melhorar a navegação, lembrar preferências e entender o uso da plataforma.
                                <br /><br />
                                O bloqueio de cookies pelo navegador pode afetar algumas funcionalidades, como login, preferências e continuidade da sessão.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:gavel" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">4. Solicitações Legais</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors">
                                Poderemos tratar, preservar ou compartilhar informações quando necessário para cumprir obrigações legais, regulatórias, ordens de autoridades competentes ou defesa de direitos.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 h-11 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
                    >
                        Entendi
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
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

export default PrivacyPortalModal;
