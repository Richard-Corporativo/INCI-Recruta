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
                        <p className="text-xs text-muted-foreground font-semibold mb-2">Última atualização: 02 de Junho de 2026</p>
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                            O <span className="font-bold text-foreground">INCI Recruta</span> reconhece a importância da privacidade, da proteção de dados pessoais e da transparência nas relações estabelecidas com seus usuários.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:info-outline" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">1. Apresentação</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-3">
                                <p>Esta Política de Privacidade tem como objetivo explicar, de forma clara, acessível e detalhada, como ocorre o tratamento de dados pessoais no contexto de utilização da plataforma INCI Recruta, sistema digital de recrutamento e seleção operado pela INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</p>
                                <p className="font-semibold text-foreground">O presente documento descreve:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>quais dados podem ser coletados;</li>
                                    <li>como esses dados são utilizados;</li>
                                    <li>com quem podem ser compartilhados;</li>
                                    <li>quais medidas de segurança são adotadas;</li>
                                    <li>quais são os direitos dos titulares;</li>
                                    <li>e como o usuário pode exercer controle sobre suas informações.</li>
                                </ul>
                                <p>A utilização da plataforma implica ciência desta Política, sem prejuízo dos direitos assegurados pela legislação aplicável.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:business" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">2. Identificação do Controlador</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>O INCI Recruta é operado pela: <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span></p>
                                <p>Na condição de controladora de dados pessoais, a empresa é responsável pelas decisões relacionadas ao tratamento de dados realizado no âmbito da plataforma.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:groups-outline" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">3. Abrangência desta Política</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-3">
                                <p className="font-semibold text-foreground">Esta Política aplica-se:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>aos candidatos cadastrados;</li>
                                    <li>aos recrutadores;</li>
                                    <li>aos gestores;</li>
                                    <li>aos administradores;</li>
                                    <li>aos visitantes da plataforma;</li>
                                    <li>e a quaisquer usuários que interajam com os serviços do INCI Recruta.</li>
                                </ul>
                                <p className="font-semibold text-foreground">A Política abrange o tratamento de dados realizado:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>em ambiente web, sistemas internos e funcionalidades administrativas;</li>
                                    <li>nas interfaces do candidato;</li>
                                    <li>em comunicações operacionais e integrações eventualmente utilizadas pela plataforma.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:database-outline" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">4. Quais Dados Podemos Coletar</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-4">
                                <p>O INCI Recruta poderá coletar diferentes categorias de dados pessoais, conforme o tipo de utilização da plataforma.</p>
                                <div>
                                    <strong className="text-foreground">4.1 Dados cadastrais:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>nome completo, CPF e data de nascimento;</li>
                                        <li>gênero, quando informado;</li>
                                        <li>e-mail, telefone e endereço (cidade, estado e país);</li>
                                        <li>foto/avatar e senha criptografada;</li>
                                        <li>e demais informações necessárias à criação da conta.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">4.2 Dados profissionais e curriculares:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>currículos, experiências profissionais e histórico acadêmico;</li>
                                        <li>cursos, certificações, competências técnicas e habilidades;</li>
                                        <li>idiomas, senioridade, portfólios e disponibilidade;</li>
                                        <li>modalidade de trabalho e pretensão profissional;</li>
                                        <li>informações sobre vínculos anteriores e links profissionais;</li>
                                        <li>e demais conteúdos enviados voluntariamente pelo usuário.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">4.3 Dados relacionados a candidaturas:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>vagas aplicadas e status de candidaturas;</li>
                                        <li>movimentações em etapas, feedbacks e avaliações;</li>
                                        <li>observações internas e histórico de processos seletivos;</li>
                                        <li>registros de interação e informações relacionadas ao fluxo seletivo.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">4.4 Dados de navegação e acesso:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>endereço IP e geolocalização aproximada;</li>
                                        <li>dispositivo utilizado, navegador e sistema operacional;</li>
                                        <li>identificadores técnicos, páginas acessadas e data e hora de acesso;</li>
                                        <li>sessões, logs operacionais e interações realizadas no sistema.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">4.5 Dados de autenticação e segurança:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>registros de login e tentativas de acesso;</li>
                                        <li>redefinições de senha e logs de autenticação;</li>
                                        <li>ações administrativas, histórico operacional e eventos relevantes para auditoria.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">4.6 Arquivos enviados pelo usuário:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>currículos, documentos profissionais, certificados, imagens e arquivos complementares.</li>
                                    </ul>
                                    <p className="mt-2 italic">O usuário é integralmente responsável pela legitimidade e veracidade dos documentos enviados.</p>
                                </div>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:input-circle" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">5. Como os Dados São Coletados</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p className="font-semibold text-foreground">Os dados poderão ser coletados:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>diretamente pelo usuário durante o cadastro e no preenchimento de currículos ou candidaturas;</li>
                                    <li>por meio da navegação na plataforma (através de cookies);</li>
                                    <li>mediante interações operacionais e em comunicações realizadas;</li>
                                    <li>ou automaticamente por mecanismos tecnológicos utilizados pela plataforma.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:task-alt" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">6. Finalidades do Tratamento de Dados</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-4">
                                <p>Os dados pessoais tratados pelo INCI Recruta poderão ser utilizados para diversas finalidades legítimas e necessárias ao funcionamento da plataforma.</p>
                                <div>
                                    <strong className="text-foreground">6.1 Execução dos serviços da plataforma:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>criação e gerenciamento de contas, autenticação de usuários e funcionamento do sistema;</li>
                                        <li>gerenciamento de candidaturas, organização de vagas e acompanhamento de processos seletivos;</li>
                                        <li>comunicação operacional e disponibilização das funcionalidades contratadas.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">6.2 Intermediação entre candidatos e recrutadores:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>conexão entre candidatos e oportunidades, visualização de currículos e movimentação em etapas;</li>
                                        <li>análise de compatibilidade e operacionalização de processos seletivos.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">6.3 Segurança da plataforma:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>prevenção de fraudes, identificação de acessos indevidos e monitoramento de segurança;</li>
                                        <li>rastreabilidade, investigação de incidentes e proteção da integridade da plataforma.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">6.4 Melhorias e evolução tecnológica:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>aprimoramento de funcionalidades, análise de desempenho e correção de falhas;</li>
                                        <li>desenvolvimento de recursos, métricas internas e evolução operacional.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">6.5 Recomendações de vagas e compatibilidade:</strong>
                                    <p className="mt-1">A plataforma poderá utilizar critérios automatizados para sugerir vagas, organizar candidaturas e recomendar oportunidades compatíveis.</p>
                                    <p className="mt-1 font-semibold text-foreground">Essas recomendações consideram:</p>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                        <li>habilidades, experiências, localização e modalidade de trabalho;</li>
                                        <li>senioridade, disponibilidade, preferências profissionais e dados curriculares.</li>
                                    </ul>
                                    <p className="mt-1 italic">As recomendações não constituem decisão automatizada definitiva, não possuem caráter eliminatório automático e não substituem análise humana.</p>
                                </div>
                                <div>
                                    <strong className="text-foreground">6.6 Cumprimento de obrigações legais e exercício regular de direitos:</strong>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                                        <li>cumprimento de obrigações legais, auditoria, proteção judicial e produção de provas.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:gavel" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">7. Bases Legais Utilizadas</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>O tratamento ocorre fundamentado nas seguintes bases legais da LGPD:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>execução de contrato ou procedimentos preliminares;</li>
                                    <li>legítimo interesse do controlador ou de terceiros;</li>
                                    <li>cumprimento de obrigação legal ou regulatória;</li>
                                    <li>exercício regular de direitos em processos judiciais, administrativos ou arbitrais;</li>
                                    <li>proteção ao crédito e consentimento (quando aplicável).</li>
                                </ul>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:share" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">8. Compartilhamento de Dados</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-4">
                                <p>Os dados pessoais poderão ser compartilhados, quando necessário, com:</p>
                                <div>
                                    <strong className="text-foreground">8.1 Recrutadores e gestores autorizados:</strong> Para operacionalização de processos seletivos e análise de candidaturas.
                                </div>
                                <div>
                                    <strong className="text-foreground">8.2 Empresas participantes de processos seletivos:</strong> Quando houver vagas vinculadas a empresas parceiras, contratantes ou clientes da plataforma.
                                </div>
                                <div>
                                    <strong className="text-foreground">8.3 Prestadores de serviços tecnológicos:</strong>
                                    <p className="mt-1">Serviços de hospedagem, armazenamento em nuvem, infraestrutura, autenticação, segurança, comunicações e analytics.</p>
                                </div>
                                <div>
                                    <strong className="text-foreground">8.4 Autoridades públicas e órgãos reguladores:</strong> Por obrigação legal, ordem judicial, determinação administrativa ou exercício regular de direitos.
                                </div>
                                <div>
                                    <strong className="text-foreground">8.5 Operações societárias:</strong> Em casos de reorganização societária, fusão, incorporação, aquisição ou transferência de ativos.
                                </div>
                                <p className="font-semibold text-foreground">O INCI Recruta não comercializa dados pessoais.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:admin-panel-settings" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">9. Controle de Acesso e Governança</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>O acesso ocorre mediante autenticação, controle e segmentação por perfil (administrador, recrutador, gestor e candidato), limitando os privilégios conforme as atribuições operacionais necessárias.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:security" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">10. Segurança da Informação</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Adotamos criptografia, autenticação, armazenamento protegido, segregação de permissões, logs de auditoria, backups e monitoramento de acessos.</p>
                                <p className="italic">Os currículos e arquivos enviados permanecem armazenados em ambiente privado e controlado. Nenhum sistema é integralmente invulnerável, devendo o usuário também aplicar boas práticas de segurança.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:history" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">11. Logs, Auditoria e Rastreabilidade</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p className="font-semibold text-foreground">Registramos acessos, autenticações, alterações de dados, movimentações e operações críticas para:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>rastreabilidade, auditoria e prevenção de fraudes;</li>
                                    <li>investigação de incidentes, proteção da plataforma e cumprimento de obrigações.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:delete-forever" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">12. Retenção e Eliminação dos Dados</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Os dados são armazenados enquanto a conta estiver ativa, durante a prestação de serviços ou conforme prazos legais para conformidade regulatória. Após o término da finalidade, os dados serão eliminados, anonimizados ou bloqueados conforme a lei.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:shield-person" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">13. Direitos dos Titulares</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p className="font-semibold text-foreground">Conforme a LGPD, o titular poderá solicitar:</p>
                                <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                                    <li>confirmação do tratamento e acesso aos dados;</li>
                                    <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                                    <li>anonimização, bloqueio ou eliminação de dados desnecessários/excessivos;</li>
                                    <li>portabilidade de dados a outro fornecedor;</li>
                                    <li>informações sobre compartilhamento e revogação de consentimento.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:cookie" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">14. Cookies e Tecnologias Semelhantes</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Utilizados para autenticação, funcionamento do portal, preferências, segurança, métricas e melhorias. O usuário pode desativar os cookies no seu navegador, ciente de eventuais limitações na usabilidade do portal.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:public" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">15. Transferência Internacional de Dados</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Caso prestadores de serviços tecnológicos externos processem dados em outros países, o INCI Recruta adotará medidas compatíveis com a legislação aplicável e níveis adequados de proteção.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:child-care" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">16. Dados de Menores de Idade</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>A plataforma não se destina a menores de 18 anos sem supervisão legal adequada. Medidas de restrição ou exclusão de conta serão tomadas se identificado tratamento irregular de dados de menores.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:edit-note" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">17. Alterações Desta Política</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Esta política poderá ser alterada a qualquer momento para adequações regulatórias, operacionais ou legais. A versão vigente estará sempre disponível, e o uso continuado implica ciência da versão atualizada.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:alternate-email" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">18. Contato e Exercício de Direitos</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Dúvidas e solicitações relacionadas à privacidade de dados ou aos direitos da LGPD podem ser enviadas diretamente pelos canais oficiais informados no rodapé.</p>
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <Icon icon="material-symbols:assignment-turned-in" className="size-5 text-primary" />
                                <h3 className="font-bold text-base tracking-tight">19. Da Ciência e Concordância</h3>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed pl-8 border-l border-border group-hover:border-primary transition-colors space-y-2">
                                <p>Ao utilizar o INCI Recruta, o usuário declara ciência sobre o tratamento de dados pessoais. O aceite se dá por clique, autenticação, cadastro ou uso continuado, registrando-se evidências eletrônicas (IP, data/hora e versão) de manifestação de vontade jurídica.</p>
                                <p className="mt-2 text-xs italic">O tratamento de dados poderá ocorrer independentemente de consentimento nas demais hipóteses previstas na Lei Geral de Proteção de Dados (LGPD).</p>
                            </div>
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
