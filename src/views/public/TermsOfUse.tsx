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
                            <span>02 de Junho de 2026</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-16 text-muted-foreground transition-colors">
                    <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
                            Ao acessar, cadastrar-se, navegar ou utilizar qualquer funcionalidade da plataforma <span className="font-bold text-primary">INCI Recruta</span>, o usuário declara ter lido, compreendido e concordado integralmente com estes <span className="font-bold text-primary">Termos de Uso</span> e com a Política de Privacidade aplicável ao tratamento de seus dados pessoais.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            1. Apresentação e Aceitação dos Termos
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                O presente instrumento establece os Termos e Condições de Uso da plataforma INCI Recruta, sistema digital de recrutamento e seleção desenvolvido e disponibilizado pela <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span>, destinado à gestão de vagas, candidaturas, processos seletivos e relacionamento entre candidatos, recrutadores, gestores e administradores.
                            </p>
                            <p>
                                O INCI Recruta opera no modelo ATS (Applicant Tracking System – Sistema de Rastreamento de Candidatos), permitindo centralização operacional de processos seletivos, gerenciamento de perfis profissionais, acompanhamento de etapas, controle de acesso e armazenamento estruturado de informações profissionais e curriculares.
                            </p>
                            <p className="font-semibold text-foreground">Ao acessar, cadastrar-se, navegar ou utilizar qualquer funcionalidade da plataforma, o usuário declara:</p>
                            <ol className="list-decimal pl-6 space-y-1 marker:text-primary">
                                <li>possuir capacidade civil para celebração deste instrumento;</li>
                                <li>ter lido integralmente estes Termos;</li>
                                <li>compreender seus direitos e obrigações;</li>
                                <li>e concordar integralmente com todas as disposições aqui previstas.</li>
                            </ol>
                            <p>
                                Caso o usuário não concorde, ainda que parcialmente, com qualquer cláusula destes Termos, deverá interromper imediatamente a utilização da plataforma.
                            </p>
                            <p className="italic">
                                A utilização continuada do sistema caracteriza concordância inequívoca com estes Termos e com a Política de Privacidade do INCI Recruta.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            2. Definições
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>Para fins de interpretação destes Termos, aplicam-se as seguintes definições:</p>
                            <div className="space-y-4">
                                <div>
                                    <strong className="text-foreground">2.1 Plataforma:</strong> Ambiente digital denominado INCI Recruta, acessível por navegador, dispositivos móveis ou integrações autorizadas.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.2 Usuário:</strong> Toda pessoa física ou jurídica que utilize, acesse, interaja ou mantenha cadastro na plataforma.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.3 Candidato:</strong> Usuário que utiliza a plataforma para:
                                    <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                                        <li>cadastrar informações profissionais;</li>
                                        <li>enviar currículos;</li>
                                        <li>candidatar-se a vagas;</li>
                                        <li>acompanhar processos seletivos;</li>
                                        <li>atualizar dados;</li>
                                        <li>e interagir com oportunidades disponibilizadas.</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong className="text-foreground">2.4 Recrutador:</strong> Usuário autorizado a criar vagas, gerenciar candidaturas, movimentar candidatos, registrar avaliações e administrar etapas seletivas.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.5 Gestor:</strong> Usuário vinculado a determinado processo seletivo, com permissões específicas definidas pela administração da plataforma.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.6 Administrador:</strong> Usuário com privilégios ampliados de gerenciamento operacional e administrativo da plataforma.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.7 Conta:</strong> Cadastro individual criado para autenticação e utilização da plataforma.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.8 Dados pessoais:</strong> Informações relacionadas à pessoa natural identificada ou identificável, nos termos da legislação aplicável.
                                </div>
                                <div>
                                    <strong className="text-foreground">2.9 Logs:</strong> Registros eletrônicos de acesso, ações, operações, autenticações e eventos realizados na plataforma.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            3. Objeto e Finalidade da Plataforma
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                O INCI Recruta possui como finalidade disponibilizar ambiente digital destinado ao gerenciamento e operacionalização de processos de recrutamento e seleção.
                            </p>
                            <p className="font-semibold text-foreground">Entre as funcionalidades disponibilizadas, incluem-se:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>publicação de vagas;</li>
                                <li>gerenciamento de candidatos;</li>
                                <li>armazenamento de currículos;</li>
                                <li>movimentação entre etapas;</li>
                                <li>organização de processos seletivos;</li>
                                <li>registros de avaliações;</li>
                                <li>acompanhamento de status;</li>
                                <li>emissão de feedbacks;</li>
                                <li>controle de permissões;</li>
                                <li>comunicação operacional;</li>
                                <li>filtros de candidatos;</li>
                                <li>histórico de interações;</li>
                                <li>geração de registros operacionais;</li>
                                <li>e recomendação de vagas compatíveis.</li>
                            </ul>
                            <p>
                                A plataforma atua exclusivamente como ferramenta tecnológica de intermediação e gestão de recrutamento.
                            </p>
                            <p className="font-semibold text-foreground">O INCI Recruta:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>não garante contratação;</li>
                                <li>não assegura participação em processos seletivos;</li>
                                <li>não promete obtenção de emprego;</li>
                                <li>não garante aprovação em etapas;</li>
                                <li>não assume obrigação de retorno individualizado;</li>
                                <li>nem se responsabiliza pelas decisões tomadas por recrutadores, gestores ou empresas contratantes.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            4. Elegibilidade e Cadastro
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                A utilização da plataforma exige cadastro prévio mediante fornecimento de informações legítimas, completas e atualizadas.
                            </p>
                            <p className="font-semibold text-foreground">O usuário declara que:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>todas as informações fornecidas são verdadeiras;</li>
                                <li>possui legitimidade sobre os dados enviados;</li>
                                <li>manterá suas informações atualizadas;</li>
                                <li>e utilizará a plataforma em conformidade com a legislação aplicável.</li>
                            </ul>
                            <p className="font-semibold text-foreground">É vedado:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>criar identidade falsa;</li>
                                <li>utilizar dados de terceiros sem autorização;</li>
                                <li>compartilhar credenciais;</li>
                                <li>manter múltiplas contas fraudulentas;</li>
                                <li>utilizar mecanismos automatizados não autorizados;</li>
                                <li>ou praticar qualquer conduta que comprometa a integridade da plataforma.</li>
                            </ul>
                            <p className="font-semibold text-foreground">O INCI Recruta poderá:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>solicitar validações adicionais;</li>
                                <li>restringir funcionalidades;</li>
                                <li>suspender contas;</li>
                                <li>bloquear acessos;</li>
                                <li>ou excluir cadastros em caso de suspeita de fraude, inconsistência ou violação destes Termos.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            5. Responsabilidade sobre Credenciais
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O usuário é integralmente responsável:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>pela guarda de sua senha;</li>
                                <li>pelo sigilo de suas credenciais;</li>
                                <li>pelas atividades realizadas em sua conta;</li>
                                <li>e por acessos decorrentes de uso autorizado ou não autorizado de suas credenciais.</li>
                            </ul>
                            <p className="mt-4 font-semibold text-foreground">O INCI Recruta não será responsável por:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>acessos indevidos decorrentes de negligência do usuário;</li>
                                <li>compartilhamento voluntário de senha;</li>
                                <li>comprometimento externo do dispositivo do usuário;</li>
                                <li>ou falhas relacionadas ao ambiente tecnológico utilizado pelo próprio usuário.</li>
                            </ul>
                            <p className="italic">
                                O usuário deverá comunicar imediatamente qualquer suspeita de acesso indevido ou comprometimento de segurança.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            6. Perfis de Acesso e Controle de Permissões
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                A plataforma opera com estrutura de permissões segmentadas por perfil de acesso.
                            </p>
                            <p className="font-semibold text-foreground">Cada usuário somente poderá visualizar e manipular:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>funcionalidades compatíveis com seu perfil;</li>
                                <li>dados necessários à execução de suas atividades;</li>
                                <li>e conteúdos autorizados pela administração da plataforma.</li>
                            </ul>
                            <p className="font-semibold text-foreground">O usuário compromete-se a não:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>acessar áreas restritas sem autorização;</li>
                                <li>explorar vulnerabilidades;</li>
                                <li>burlar mecanismos de autenticação;</li>
                                <li>copiar bases de dados;</li>
                                <li>realizar engenharia reversa;</li>
                                <li>extrair informações em larga escala;</li>
                                <li>ou praticar scraping de informações da plataforma.</li>
                            </ul>
                            <p className="font-semibold text-foreground">Qualquer tentativa de violação poderá resultar:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>em suspensão imediata;</li>
                                <li>cancelamento da conta;</li>
                                <li>responsabilização civil;</li>
                                <li>responsabilização criminal;</li>
                                <li>e adoção das medidas judiciais cabíveis.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            7. Currículos, Documentos e Conteúdos Inseridos
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">Os candidatos poderão inserir:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>currículos;</li>
                                <li>certificados;</li>
                                <li>experiências profissionais;</li>
                                <li>competências;</li>
                                <li>documentos;</li>
                                <li>imagens;</li>
                                <li>portfólios;</li>
                                <li>links profissionais;</li>
                                <li>e demais informações relacionadas à sua trajetória profissional.</li>
                            </ul>
                            <p className="font-semibold text-foreground">O usuário declara:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>possuir autorização sobre todos os documentos enviados;</li>
                                <li>responsabilizar-se integralmente pelas informações prestadas;</li>
                                <li>e garantir que os conteúdos não violam direitos de terceiros.</li>
                            </ul>
                            <p className="font-semibold text-foreground">É expressamente proibido inserir:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>documentos falsos;</li>
                                <li>certificados inidôneos;</li>
                                <li>conteúdo discriminatório;</li>
                                <li>arquivos maliciosos;</li>
                                <li>material ofensivo;</li>
                                <li>conteúdo ilícito;</li>
                                <li>vírus;</li>
                                <li>scripts maliciosos;</li>
                                <li>ou qualquer elemento que comprometa a segurança da plataforma.</li>
                            </ul>
                            <p className="font-semibold text-foreground">O INCI Recruta poderá remover conteúdos que:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>violem estes Termos;</li>
                                <li>apresentem risco à segurança;</li>
                                <li>contrariem a legislação;</li>
                                <li>ou comprometam a integridade da plataforma.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            8. Processos Seletivos e Funcionalidades de Recomendação
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">A plataforma poderá utilizar critérios automatizados para:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>sugerir vagas;</li>
                                <li>organizar candidaturas;</li>
                                <li>recomendar oportunidades;</li>
                                <li>classificar compatibilidade;</li>
                                <li>e otimizar processos seletivos.</li>
                            </ul>
                            <p className="font-semibold text-foreground">As recomendações poderão considerar fatores como:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>localização;</li>
                                <li>habilidades;</li>
                                <li>experiências;</li>
                                <li>disponibilidade;</li>
                                <li>senioridade;</li>
                                <li>modalidade de trabalho;</li>
                                <li>preferências profissionais;</li>
                                <li>e informações curriculares.</li>
                            </ul>
                            <p className="font-semibold text-foreground">Tais funcionalidades:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>não constituem decisão automatizada definitiva;</li>
                                <li>não substituem análise humana;</li>
                                <li>não possuem caráter eliminatório automático;</li>
                                <li>e não representam garantia de seleção ou contratação.</li>
                            </ul>
                            <p>
                                As decisões finais relacionadas à contratação permanecem sob responsabilidade exclusiva dos recrutadores e empresas participantes.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            9. Comunicações e Notificações
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O usuário autoriza o envio de comunicações relacionadas:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>à utilização da plataforma;</li>
                                <li>candidaturas;</li>
                                <li>movimentações processuais;</li>
                                <li>atualizações;</li>
                                <li>notificações operacionais;</li>
                                <li>avisos de segurança;</li>
                                <li>e informações relevantes sobre funcionamento do sistema.</li>
                            </ul>
                            <p className="font-semibold text-foreground">As comunicações poderão ocorrer:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>por e-mail;</li>
                                <li>notificações internas;</li>
                                <li>mensagens operacionais;</li>
                                <li>ou outros canais vinculados à conta do usuário.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            10. Segurança da Informação
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                O INCI Recruta adota medidas técnicas, administrativas e organizacionais voltadas à proteção da plataforma e dos dados tratados.
                            </p>
                            <p className="font-semibold text-foreground">Entre as medidas implementadas, poderão incluir-se:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>autenticação de acesso;</li>
                                <li>segmentação de permissões;</li>
                                <li>armazenamento protegido;</li>
                                <li>monitoramento operacional;</li>
                                <li>logs de auditoria;</li>
                                <li>controle de sessões;</li>
                                <li>restrições de acesso;</li>
                                <li>criptografia;</li>
                                <li>e mecanismos compatíveis com padrões razoáveis de segurança da informação.</li>
                            </ul>
                            <p>
                                Os currículos e documentos enviados poderão permanecer armazenados em ambiente privado e controlado.
                            </p>
                            <p className="italic">
                                Entretanto, o usuário reconhece que nenhum ambiente digital é integralmente invulnerável.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            11. Logs e Auditoria
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O INCI Recruta poderá registrar logs e eventos operacionais relacionados:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>aos acessos realizados;</li>
                                <li>autenticações;</li>
                                <li>alterações de dados;</li>
                                <li>movimentações em candidaturas;</li>
                                <li>ações administrativas;</li>
                                <li>e operações relevantes para segurança e auditoria.</li>
                            </ul>
                            <p className="font-semibold text-foreground">Os registros poderão ser utilizados para:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>rastreabilidade;</li>
                                <li>prevenção de fraudes;</li>
                                <li>investigação de incidentes;</li>
                                <li>proteção da plataforma;</li>
                                <li>exercício regular de direitos;</li>
                                <li>e cumprimento de obrigações legais.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            12. Propriedade Intelectual
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                Todos os direitos relacionados ao INCI Recruta pertencem exclusivamente à <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span>, incluindo:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>software;</li>
                                <li>código-fonte;</li>
                                <li>arquitetura;</li>
                                <li>interface;</li>
                                <li>layout;</li>
                                <li>banco de dados;</li>
                                <li>identidade visual;</li>
                                <li>marca;</li>
                                <li>fluxos operacionais;</li>
                                <li>textos;</li>
                                <li>funcionalidades;</li>
                                <li>e demais elementos da plataforma.</li>
                            </ul>
                            <p className="font-semibold text-foreground">É proibido:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>copiar;</li>
                                <li>reproduzir;</li>
                                <li>distribuir;</li>
                                <li>vender;</li>
                                <li>modificar;</li>
                                <li>desmontar;</li>
                                <li>realizar engenharia reversa;</li>
                                <li>ou explorar economicamente qualquer elemento da plataforma sem autorização formal.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            13. Indisponibilidade e Manutenção
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">A plataforma poderá passar por:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>atualizações;</li>
                                <li>manutenções;</li>
                                <li>interrupções;</li>
                                <li>melhorias;</li>
                                <li>correções;</li>
                                <li>ou alterações operacionais.</li>
                            </ul>
                            <p>
                                O INCI Recruta não garante disponibilidade contínua, permanente e ininterrupta.
                            </p>
                            <p className="font-semibold text-foreground">A plataforma não será responsável por:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>falhas externas;</li>
                                <li>indisponibilidades temporárias;</li>
                                <li>interrupções de terceiros;</li>
                                <li>perda de conexão;</li>
                                <li>eventos de força maior;</li>
                                <li>ataques cibernéticos externos;</li>
                                <li>ou limitações técnicas alheias ao seu controle razoável.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            14. Limitação de Responsabilidade
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O INCI Recruta não será responsável:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>por decisões tomadas por recrutadores;</li>
                                <li>pela veracidade de informações inseridas pelos usuários;</li>
                                <li>pela conduta de terceiros;</li>
                                <li>pela perda de oportunidades profissionais;</li>
                                <li>por danos decorrentes de uso indevido da plataforma;</li>
                                <li>por falhas causadas pelo ambiente tecnológico do usuário;</li>
                                <li>nem por conteúdos enviados por terceiros.</li>
                            </ul>
                            <p className="italic">
                                O usuário reconhece que utiliza a plataforma por sua conta e risco, observadas as limitações legais aplicáveis.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            15. Privacidade e Proteção de Dados
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O tratamento de dados pessoais realizado pela plataforma ocorre em conformidade com:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018);</li>
                                <li>a legislação aplicável;</li>
                                <li>e a Política de Privacidade do INCI Recruta.</li>
                            </ul>
                            <p>
                                Ao utilizar a plataforma, o usuário declara ciência acerca do tratamento de seus dados pessoais.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            16. Exclusão, Suspensão e Encerramento de Contas
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O INCI Recruta poderá:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>suspender;</li>
                                <li>restringir;</li>
                                <li>bloquear;</li>
                                <li>ou excluir contas que violem estes Termos.</li>
                            </ul>
                            <p className="font-semibold text-foreground">O usuário poderá solicitar encerramento de sua conta, observadas:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>obrigações legais;</li>
                                <li>retenções obrigatórias;</li>
                                <li>necessidade de preservação de logs;</li>
                                <li>auditoria;</li>
                                <li>prevenção de fraudes;</li>
                                <li>e exercício regular de direitos.</li>
                            </ul>
                            <p className="italic">
                                A exclusão poderá resultar em perda definitiva de informações armazenadas.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            17. Alterações destes Termos
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O INCI Recruta poderá alterar estes Termos a qualquer momento para:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>adequação legal;</li>
                                <li>atualização operacional;</li>
                                <li>evolução tecnológica;</li>
                                <li>implementação de funcionalidades;</li>
                                <li>ou ajustes regulatórios.</li>
                            </ul>
                            <p>
                                A versão atualizada será disponibilizada na plataforma.
                            </p>
                            <p className="italic">
                                O uso continuado após a atualização representará concordância com os novos Termos.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            18. Legislação e Foro
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                Estes Termos serão interpretados conforme as leis da República Federativa do Brasil.
                            </p>
                            <p>
                                Fica eleito o foro da Comarca de Fortaleza/CE para dirimir controvérsias decorrentes destes Termos, salvo disposição legal diversa.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            19. Contato
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>
                                Dúvidas, solicitações ou comunicações relacionadas ao INCI Recruta poderão ser encaminhadas pelos canais oficiais disponibilizados pela plataforma.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="size-2 rounded-full bg-primary"></span>
                            20. Do Aceite Eletrônico (Termos de Uso)
                        </h2>
                        <div className="h-px bg-border w-full opacity-50"></div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-foreground">O aceite destes Termos de Uso ocorrerá por meio eletrônico, mediante ação afirmativa do usuário no ambiente da plataforma, incluindo, mas não se limitando a:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>clique em caixa de seleção;</li>
                                <li>botão de confirmação;</li>
                                <li>criação de conta;</li>
                                <li>autenticação de acesso;</li>
                                <li>utilização continuada da plataforma;</li>
                                <li>ou qualquer mecanismo eletrônico inequívoco de concordância.</li>
                            </ul>
                            <p>
                                O aceite eletrônico possuirá plena validade jurídica, eficácia e força vinculante, nos termos da legislação aplicável, produzindo os mesmos efeitos de manifestação escrita e assinatura presencial.
                            </p>
                            <p className="font-semibold text-foreground">O INCI Recruta poderá registrar evidências relacionadas ao aceite, incluindo:</p>
                            <ul className="list-disc pl-6 space-y-1 marker:text-primary">
                                <li>data e hora;</li>
                                <li>endereço IP;</li>
                                <li>identificadores da conta;</li>
                                <li>versão vigente dos documentos;</li>
                                <li>logs operacionais;</li>
                                <li>e demais registros eletrônicos necessários à comprovação da manifestação de vontade do usuário.</li>
                            </ul>
                            <p className="italic">
                                O usuário reconhece que a utilização da plataforma após o aceite eletrônico representa concordância integral com estes Termos de Uso.
                            </p>
                        </div>
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
