# Proposal: implement-conversion-ux-playbook

## Objective
Implementar as diretrizes do "Playbook Completo de UX/UI para Conversão" no Sistema de Recrutamento para otimizar a experiência do usuário, reduzir a fricção nos fluxos críticos (Candidatura e Criação de Vagas) e aumentar a taxa de conversão interna.

## Motivation
O sistema atual segue o INCI Design System v2.0.0, mas carece de otimizações psicológicas e de fluxo que direcionam o usuário à ação. Aplicar o Playbook permitirá transformar a interface de uma ferramenta passiva em um ambiente que converte visitantes em aplicações qualificadas e gestores em usuários ativos.

## Scope
- **Audit de Fluxo**: Revisão das páginas `Login`, `Jobs`, `JobDetail` e `Settings`.
- **Above the Fold & Proposta de Valor**: Refinamento da Landing Page de Vagas.
- **Hierarquia Visual & CTAs**: Aplicação da Regra 60-30-10 e padronização de CTAs primários de alta urgência.
- **Formulários de Alta Conversão**: Otimização dos formulários de login e criação de vaga para reduzir fricção.
- **Micro-interações**: Adição de feedbacks visuais para estados de carregamento e sucesso conforme o Playbook.

## Design Decisions
- Utilizar o Padrão F de leitura para páginas de conteúdo denso (detalhes da vaga).
- Utilizar o Padrão Z para landing pages e auth screens.
- Implementar CTAs com verbos de ação + benefício (ex: "Criar Vaga em 1 Clique" em vez de apenas "Criar").
- Priorizar Mobile First em todas as telas de candidatura.
