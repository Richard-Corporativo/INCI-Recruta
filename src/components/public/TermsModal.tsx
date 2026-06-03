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
                <p className="text-xs text-muted-foreground font-semibold mb-2">Última atualização: 02 de Junho de 2026</p>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                    Ao acessar, cadastrar-se, navegar ou utilizar qualquer funcionalidade da plataforma <span className="font-bold text-foreground">INCI Recruta</span>, o usuário declara ter lido, compreendido e concordado integralmente com estes <span className="font-bold text-foreground">Termos de Uso</span> e com a Política de Privacidade aplicável ao tratamento de seus dados pessoais.
                </p>
            </div>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">1. Apresentação e Aceitação dos Termos</h2>
                <p>
                    O presente instrumento estabelece os Termos e Condições de Uso da plataforma INCI Recruta, sistema digital de recrutamento e seleção desenvolvido e disponibilizado pela <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span>, destinado à gestão de vagas, candidaturas, processos seletivos e relacionamento entre candidatos, recrutadores, gestores e administradores.
                </p>
                <p className="mt-4">
                    O INCI Recruta opera no modelo ATS (Applicant Tracking System – Sistema de Rastreamento de Candidatos), permitindo centralização operacional de processos seletivos, gerenciamento de perfis profissionais, acompanhamento de etapas, controle de acesso e armazenamento estruturado de informações profissionais e curriculares.
                </p>
                <p className="mt-4 font-semibold text-foreground">Ao acessar, cadastrar-se, navegar ou utilizar qualquer funcionalidade da plataforma, o usuário declara:</p>
                <ol className="list-decimal pl-6 space-y-1 marker:text-primary mt-1">
                    <li>possuir capacidade civil para celebração deste instrumento;</li>
                    <li>ter lido integralmente estes Termos;</li>
                    <li>compreender seus direitos e obrigações;</li>
                    <li>e concordar integralmente com todas as disposições aqui previstas.</li>
                </ol>
                <p className="mt-4">
                    Caso o usuário não concorde, ainda que parcialmente, com qualquer cláusula destes Termos, deverá interromper imediatamente a utilização da plataforma.
                </p>
                <p className="mt-4 italic">
                    A utilização continuada do sistema caracteriza concordância inequívoca com estes Termos e com a Política de Privacidade do INCI Recruta.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">2. Definições</h2>
                <p className="mb-4">Para fins de interpretação destes Termos, aplicam-se as seguintes definições:</p>
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
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">3. Objeto e Finalidade da Plataforma</h2>
                <p>
                    O INCI Recruta possui como finalidade disponibilizar ambiente digital destinado ao gerenciamento e operacionalização de processos de recrutamento e seleção.
                </p>
                <p className="mt-4 font-semibold text-foreground">Entre as funcionalidades disponibilizadas, incluem-se:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
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
                <p className="mt-4">
                    A plataforma atua exclusivamente como ferramenta tecnológica de intermediação e gestão de recrutamento.
                </p>
                <p className="mt-4 font-semibold text-foreground">O INCI Recruta:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>não garante contratação;</li>
                    <li>não assegura participação em processos seletivos;</li>
                    <li>não promete obtenção de emprego;</li>
                    <li>não garante aprovação em etapas;</li>
                    <li>não assume obrigação de retorno individualizado;</li>
                    <li>nem se responsabiliza pelas decisões tomadas por recrutadores, gestores ou empresas contratantes.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">4. Elegibilidade e Cadastro</h2>
                <p>
                    A utilização da plataforma exige cadastro prévio mediante fornecimento de informações legítimas, completas e atualizadas.
                </p>
                <p className="mt-4 font-semibold text-foreground">O usuário declara que:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>todas as informações fornecidas são verdadeiras;</li>
                    <li>possui legitimidade sobre os dados enviados;</li>
                    <li>manterá suas informações atualizadas;</li>
                    <li>e utilizará a plataforma em conformidade com a legislação aplicável.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">É vedado:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>criar identidade falsa;</li>
                    <li>utilizar dados de terceiros sem autorização;</li>
                    <li>compartilhar credenciais;</li>
                    <li>manter múltiplas contas fraudulentas;</li>
                    <li>utilizar mecanismos automatizados não autorizados;</li>
                    <li>ou praticar qualquer conduta que comprometa a integridade da plataforma.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">O INCI Recruta poderá:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>solicitar validações adicionais;</li>
                    <li>restringir funcionalidades;</li>
                    <li>suspender contas;</li>
                    <li>bloquear acessos;</li>
                    <li>ou excluir cadastros em caso de suspeita de fraude, inconsistência ou violação destes Termos.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">5. Responsabilidade sobre Credenciais</h2>
                <p className="font-semibold text-foreground">O usuário é integralmente responsável:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>pela guarda de sua senha;</li>
                    <li>pelo sigilo de suas credenciais;</li>
                    <li>pelas atividades realizadas em sua conta;</li>
                    <li>e por acessos decorrentes de uso autorizado ou não autorizado de suas credenciais.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">O INCI Recruta não será responsável por:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>acessos indevidos decorrentes de negligência do usuário;</li>
                    <li>compartilhamento voluntário de senha;</li>
                    <li>comprometimento externo do dispositivo do usuário;</li>
                    <li>ou falhas relacionadas ao ambiente tecnológico utilizado pelo próprio usuário.</li>
                </ul>
                <p className="mt-4 italic">
                    O usuário deverá comunicar imediatamente qualquer suspeita de acesso indevido ou comprometimento de segurança.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">6. Perfis de Acesso e Controle de Permissões</h2>
                <p>
                    A plataforma opera com estrutura de permissões segmentadas por perfil de acesso.
                </p>
                <p className="mt-4 font-semibold text-foreground">Cada usuário somente poderá visualizar e manipular:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>funcionalidades compatíveis com seu perfil;</li>
                    <li>dados necessários à execução de suas atividades;</li>
                    <li>e conteúdos autorizados pela administração da plataforma.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">O usuário compromete-se a não:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>acessar áreas restritas sem autorização;</li>
                    <li>explorar vulnerabilidades;</li>
                    <li>burlar mecanismos de autenticação;</li>
                    <li>copiar bases de dados;</li>
                    <li>realizar engenharia reversa;</li>
                    <li>extrair informações em larga escala;</li>
                    <li>ou praticar scraping de informações da plataforma.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">Qualquer tentativa de violação poderá resultar:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>em suspensão imediata;</li>
                    <li>cancelamento da conta;</li>
                    <li>responsabilização civil;</li>
                    <li>responsabilização criminal;</li>
                    <li>e adoção das medidas judiciais cabíveis.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">7. Currículos, Documentos e Conteúdos Inseridos</h2>
                <p className="font-semibold text-foreground">Os candidatos poderão inserir:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
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
                <p className="mt-4 font-semibold text-foreground">O usuário declara:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>possuir autorização sobre todos os documentos enviados;</li>
                    <li>responsabilizar-se integralmente pelas informações prestadas;</li>
                    <li>e garantir que os conteúdos não violam direitos de terceiros.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">É expressamente proibido inserir:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
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
                <p className="mt-4 font-semibold text-foreground">O INCI Recruta poderá remover conteúdos que:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>violem estes Termos;</li>
                    <li>apresentem risco à segurança;</li>
                    <li>contrariem a legislação;</li>
                    <li>ou comprometam a integridade da plataforma.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">8. Processos Seletivos e Funcionalidades de Recomendação</h2>
                <p className="font-semibold text-foreground">A plataforma poderá utilizar critérios automatizados para:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>sugerir vagas;</li>
                    <li>organizar candidaturas;</li>
                    <li>recomendar oportunidades;</li>
                    <li>classificar compatibilidade;</li>
                    <li>e otimizar processos seletivos.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">As recomendações poderão considerar fatores como:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>localização;</li>
                    <li>habilidades;</li>
                    <li>experiências;</li>
                    <li>disponibilidade;</li>
                    <li>senioridade;</li>
                    <li>modalidade de trabalho;</li>
                    <li>preferências profissionais;</li>
                    <li>e informações curriculares.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">Tais funcionalidades:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-primary mt-1">
                    <li>não constituem decisão automatizada definitiva;</li>
                    <li>não substituem análise humana;</li>
                    <li>não possuem caráter eliminatório automático;</li>
                    <li>e não representam garantia de seleção ou contratação.</li>
                </ul>
                <p className="mt-4">
                    As decisões finais relacionadas à contratação permanecem sob responsabilidade exclusiva dos recrutadores e empresas participantes.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">9. Comunicações e Notificações</h2>
                <p className="font-semibold text-foreground">O usuário autoriza o envio de comunicações relacionadas:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>à utilização da plataforma;</li>
                    <li>candidaturas;</li>
                    <li>movimentações processuais;</li>
                    <li>atualizações;</li>
                    <li>notificações operacionais;</li>
                    <li>avisos de segurança;</li>
                    <li>e informações relevantes sobre funcionamento do sistema.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">As comunicações poderão ocorrer:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>por e-mail;</li>
                    <li>notificações internas;</li>
                    <li>mensagens operacionais;</li>
                    <li>ou outros canais vinculados à conta do usuário.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">10. Segurança da Informação</h2>
                <p>
                    O INCI Recruta adota medidas técnicas, administrativas e organizacionais voltadas à proteção da plataforma e dos dados tratados.
                </p>
                <p className="mt-4 font-semibold text-foreground">Entre as medidas implementadas, poderão incluir-se:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
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
                <p className="mt-4">
                    Os currículos e documentos enviados poderão permanecer armazenados em ambiente privado e controlado.
                </p>
                <p className="mt-4 italic">
                    Entretanto, o usuário reconhece que nenhum ambiente digital é integralmente invulnerável.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">11. Logs e Auditoria</h2>
                <p className="font-semibold text-foreground">O INCI Recruta poderá registrar logs e eventos operacionais relacionados:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>aos acessos realizados;</li>
                    <li>autenticações;</li>
                    <li>alterações de dados;</li>
                    <li>movimentações em candidaturas;</li>
                    <li>ações administrativas;</li>
                    <li>e operações relevantes para segurança e auditoria.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">Os registros poderão ser utilizados para:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>rastreabilidade;</li>
                    <li>prevenção de fraudes;</li>
                    <li>investigação de incidentes;</li>
                    <li>proteção da plataforma;</li>
                    <li>exercício regular de direitos;</li>
                    <li>e cumprimento de obrigações legais.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">12. Propriedade Intelectual</h2>
                <p>
                    Todos os direitos relacionados ao INCI Recruta pertencem exclusivamente à <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span>, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
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
                <p className="mt-4 font-semibold text-foreground">É proibido:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>copiar;</li>
                    <li>reproduzir;</li>
                    <li>distribuir;</li>
                    <li>vender;</li>
                    <li>modificar;</li>
                    <li>desmontar;</li>
                    <li>realizar engenharia reversa;</li>
                    <li>ou explorar economicamente qualquer elemento da plataforma sem autorização formal.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">13. Indisponibilidade e Manutenção</h2>
                <p className="font-semibold text-foreground">A plataforma poderá passar por:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>atualizações;</li>
                    <li>manutenções;</li>
                    <li>interrupções;</li>
                    <li>melhorias;</li>
                    <li>correções;</li>
                    <li>ou alterações operacionais.</li>
                </ul>
                <p className="mt-4">
                    O INCI Recruta não garante disponibilidade contínua, permanente e ininterrupta.
                </p>
                <p className="mt-4 font-semibold text-foreground">A plataforma não será responsável por:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>falhas externas;</li>
                    <li>indisponibilidades temporárias;</li>
                    <li>interrupções de terceiros;</li>
                    <li>perda de conexão;</li>
                    <li>eventos de força maior;</li>
                    <li>ataques cibernéticos externos;</li>
                    <li>ou limitações técnicas alheias ao seu controle razoável.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">14. Limitação de Responsabilidade</h2>
                <p className="font-semibold text-foreground">O INCI Recruta não será responsável:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>por decisões tomadas por recrutadores;</li>
                    <li>pela veracidade de informações inseridas pelos usuários;</li>
                    <li>pela conduta de terceiros;</li>
                    <li>pela perda de oportunidades profissionais;</li>
                    <li>por danos decorrentes de uso indevido da plataforma;</li>
                    <li>por falhas causadas pelo ambiente tecnológico do usuário;</li>
                    <li>nem por conteúdos enviados por terceiros.</li>
                </ul>
                <p className="mt-4 italic">
                    O usuário reconhece que utiliza a plataforma por sua conta e risco, observadas as limitações legais aplicáveis.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">15. Privacidade e Proteção de Dados</h2>
                <p className="font-semibold text-foreground">O tratamento de dados pessoais realizado pela plataforma ocorre em conformidade com:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018);</li>
                    <li>a legislação aplicável;</li>
                    <li>e a Política de Privacidade do INCI Recruta.</li>
                </ul>
                <p className="mt-4">
                    Ao utilizar a plataforma, o usuário declara ciência acerca do tratamento de seus dados pessoais.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">16. Exclusão, Suspensão e Encerramento de Contas</h2>
                <p className="font-semibold text-foreground">O INCI Recruta poderá:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>suspender;</li>
                    <li>restringir;</li>
                    <li>bloquear;</li>
                    <li>ou excluir contas que violem estes Termos.</li>
                </ul>
                <p className="mt-4 font-semibold text-foreground">O usuário poderá solicitar encerramento de sua conta, observadas:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>obrigações legais;</li>
                    <li>retenções obrigatórias;</li>
                    <li>necessidade de preservação de logs;</li>
                    <li>auditoria;</li>
                    <li>prevenção de fraudes;</li>
                    <li>e exercício regular de direitos.</li>
                </ul>
                <p className="mt-4 italic">
                    A exclusão poderá resultar em perda definitiva de informações armazenadas.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">17. Alterações destes Termos</h2>
                <p className="font-semibold text-foreground">O INCI Recruta poderá alterar estes Termos a qualquer momento para:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>adequação legal;</li>
                    <li>atualização operacional;</li>
                    <li>evolução tecnológica;</li>
                    <li>implementação de funcionalidades;</li>
                    <li>ou ajustes regulatórios.</li>
                </ul>
                <p className="mt-4">
                    A versão atualizada será disponibilizada na plataforma.
                </p>
                <p className="mt-4 italic">
                    O uso continuado após a atualização representará concordância com os novos Termos.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">18. Legislação e Foro</h2>
                <p>
                    Estes Termos serão interpretados conforme as leis da República Federativa do Brasil.
                </p>
                <p className="mt-4">
                    Fica eleito o foro da Comarca de Fortaleza/CE para dirimir controvérsias decorrentes destes Termos, salvo disposição legal diversa.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">19. Contato</h2>
                <p>
                    Dúvidas, solicitações ou comunicações relacionadas ao INCI Recruta poderão ser encaminhadas pelos canais oficiais disponibilizados pela plataforma.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border transition-colors">20. Do Aceite Eletrônico (Termos de Uso)</h2>
                <p className="font-semibold text-foreground">O aceite destes Termos de Uso ocorrerá por meio eletrônico, mediante ação afirmativa do usuário no ambiente da plataforma, incluindo, mas não se limitando a:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>clique em caixa de seleção;</li>
                    <li>botão de confirmação;</li>
                    <li>criação de conta;</li>
                    <li>autenticação de acesso;</li>
                    <li>utilização continuada da plataforma;</li>
                    <li>ou qualquer mecanismo eletrônico inequívoco de concordância.</li>
                </ul>
                <p className="mt-4">
                    O aceite eletrônico possuirá plena validade jurídica, eficácia e força vinculante, nos termos da legislação aplicável, produzindo os mesmos efeitos de manifestação escrita e assinatura presencial.
                </p>
                <p className="mt-4 font-semibold text-foreground">O INCI Recruta poderá registrar evidências relacionadas ao aceite, incluindo:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary mt-2">
                    <li>data e hora;</li>
                    <li>endereço IP;</li>
                    <li>identificadores da conta;</li>
                    <li>versão vigente dos documentos;</li>
                    <li>logs operacionais;</li>
                    <li>e demais registros eletrônicos necessários à comprovação da manifestação de vontade do usuário.</li>
                </ul>
                <p className="mt-4 italic">
                    O usuário reconhece que a utilização da plataforma após o aceite eletrônico representa concordância integral com estes Termos de Uso.
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
                <p className="text-xs text-muted-foreground font-semibold mb-2">Última atualização: 02 de Junho de 2026</p>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                    O <span className="font-bold text-foreground">INCI Recruta</span> reconhece a importância da privacidade, da proteção de dados pessoais e da transparência nas relações estabelecidas com seus usuários.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:info-outline" className="h-5 w-5 text-primary" />
                        1. Apresentação
                    </h2>
                    <div className="space-y-3 text-sm">
                        <p>Esta Política de Privacidade tem como objetivo explicar, de forma clara, acessível e detalhada, como ocorre o tratamento de dados pessoais no contexto de utilização da plataforma INCI Recruta, sistema digital de recrutamento e seleção operado pela INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</p>
                        <p className="font-semibold text-foreground">O presente documento descreve:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:business" className="h-5 w-5 text-primary" />
                        2. Identificação do Controlador
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>O INCI Recruta é operado pela: <span className="font-semibold text-foreground">INCI SERVIÇOS DE APERFEIÇOAMENTO PROFISSIONAL LTDA.</span></p>
                        <p>Na condição de controladora de dados pessoais, a empresa é responsável pelas decisões relacionadas ao tratamento de dados realizado no âmbito da plataforma.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:groups-outline" className="h-5 w-5 text-primary" />
                        3. Abrangência desta Política
                    </h2>
                    <div className="space-y-3 text-sm">
                        <p className="font-semibold text-foreground">Esta Política aplica-se:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                            <li>aos candidatos cadastrados;</li>
                            <li>aos recrutadores;</li>
                            <li>aos gestores;</li>
                            <li>aos administradores;</li>
                            <li>aos visitantes da plataforma;</li>
                            <li>e a quaisquer usuários que interajam com os serviços do INCI Recruta.</li>
                        </ul>
                        <p className="font-semibold text-foreground">A Política abrange o tratamento de dados realizado:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary mt-1">
                            <li>em ambiente web, sistemas internos e funcionalidades administrativas;</li>
                            <li>nas interfaces do candidato;</li>
                            <li>em comunicações operacionais e integrações eventualmente utilizadas pela plataforma.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:database-outline" className="h-5 w-5 text-primary" />
                        4. Quais Dados Podemos Coletar
                    </h2>
                    <div className="space-y-4 text-sm">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:input-circle" className="h-5 w-5 text-primary" />
                        5. Como os Dados São Coletados
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p className="font-semibold text-foreground">Os dados poderão ser coletados:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                            <li>diretamente pelo usuário durante o cadastro e no preenchimento de currículos ou candidaturas;</li>
                            <li>por meio da navegação na plataforma (através de cookies);</li>
                            <li>mediante interações operacionais e em comunicações realizadas;</li>
                            <li>ou automaticamente por mecanismos tecnológicos utilizados pela plataforma.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:task-alt" className="h-5 w-5 text-primary" />
                        6. Finalidades do Tratamento de Dados
                    </h2>
                    <div className="space-y-4 text-sm">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:gavel" className="h-5 w-5 text-primary" />
                        7. Bases Legais Utilizadas
                    </h2>
                    <div className="space-y-2 text-sm">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:share" className="h-5 w-5 text-primary" />
                        8. Compartilhamento de Dados
                    </h2>
                    <div className="space-y-4 text-sm">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:admin-panel-settings" className="h-5 w-5 text-primary" />
                        9. Controle de Acesso e Governança
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>O acesso ocorre mediante autenticação, controle e segmentação por perfil (administrador, recrutador, gestor e candidato), limitando os privilégios conforme as atribuições operacionais necessárias.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:security" className="h-5 w-5 text-primary" />
                        10. Segurança da Informação
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Adotamos criptografia, autenticação, armazenamento protegido, segregação de permissões, logs de auditoria, backups e monitoramento de acessos.</p>
                        <p className="italic">Os currículos e arquivos enviados permanecem armazenados em ambiente privado e controlado. Nenhum sistema é integralmente invulnerável, devendo o usuário também aplicar boas práticas de segurança.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:history" className="h-5 w-5 text-primary" />
                        11. Logs, Auditoria e Rastreabilidade
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p className="font-semibold text-foreground">Registramos acessos, autenticações, alterações de dados, movimentações e operações críticas para:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
                            <li>rastreabilidade, auditoria e prevenção de fraudes;</li>
                            <li>investigação de incidentes, proteção da plataforma e cumprimento de obrigações.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:delete-forever" className="h-5 w-5 text-primary" />
                        12. Retenção e Eliminação dos Dados
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Os dados são armazenados enquanto a conta estiver ativa, durante a prestação de serviços ou conforme prazos legais para conformidade regulatória. Após o término da finalidade, os dados serão eliminados, anonimizados ou bloqueados conforme a lei.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:shield-person" className="h-5 w-5 text-primary" />
                        13. Direitos dos Titulares
                    </h2>
                    <div className="space-y-2 text-sm">
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

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:cookie" className="h-5 w-5 text-primary" />
                        14. Cookies e Tecnologias Semelhantes
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Utilizados para autenticação, funcionamento do portal, preferências, segurança, métricas e melhorias. O usuário pode desativar os cookies no seu navegador, ciente de eventuais limitações na usabilidade do portal.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:public" className="h-5 w-5 text-primary" />
                        15. Transferência Internacional de Dados
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Caso prestadores de serviços tecnológicos externos processem dados em outros países, o INCI Recruta adotará medidas compatíveis com a legislação aplicável e níveis adequados de proteção.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:child-care" className="h-5 w-5 text-primary" />
                        16. Dados de Menores de Idade
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>A plataforma não se destina a menores de 18 anos sem supervisão legal adequada. Medidas de restrição ou exclusão de conta serão tomadas se identificado tratamento irregular de dados de menores.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:edit-note" className="h-5 w-5 text-primary" />
                        17. Alterações Desta Política
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Esta política poderá ser alterada a qualquer momento para adequações regulatórias, operacionais ou legais. A versão vigente estará sempre disponível, e o uso continuado implica ciência da versão atualizada.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:alternate-email" className="h-5 w-5 text-primary" />
                        18. Contato e Exercício de Direitos
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Dúvidas e solicitações relacionadas à privacidade de dados ou aos direitos da LGPD podem ser enviadas diretamente ao DPO ou canal de privacidade da plataforma.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2 transition-colors">
                        <Icon icon="material-symbols:assignment-turned-in" className="h-5 w-5 text-primary" />
                        19. Da Ciência e Concordância
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>Ao utilizar o INCI Recruta, o usuário declara ciência sobre o tratamento de dados pessoais. O aceite se dá por clique, autenticação, cadastro ou uso continuado, registrando-se evidências eletrônicas (IP, data/hora e versão) de manifestação de vontade jurídica.</p>
                        <p className="mt-2 text-xs italic">O tratamento de dados poderá ocorrer independentemente de consentimento nas demais hipóteses previstas na Lei Geral de Proteção de Dados (LGPD).</p>
                    </div>
                </section>
            </div>

            <div className="p-6 bg-primary text-primary-foreground rounded-lg relative overflow-hidden group transition-all duration-200">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon icon="material-symbols:lock-person" className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2 relative z-10 flex items-center gap-2">
                    Canal de Privacidade (DPO)
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-4 relative z-10">Contate nosso encarregado para exercer seus direitos da LGPD.</p>
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
