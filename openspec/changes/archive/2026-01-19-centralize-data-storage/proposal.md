# Proposal: Centralizar Armazenamento de Dados no localStorage

Este documento propõe a remoção de todos os dados "mockados" (hardcoded) nos arquivos da aplicação e a implementação de um sistema de persistência centralizado utilizando o `localStorage` do navegador.

## Contexto e Problema
Atualmente, as listas de vagas, candidatos e cargos estão definidas diretamente nos componentes (ex: `Jobs.tsx`, `Kanban.tsx`, `Roles.tsx`). Isso causa dois problemas principais:
1.  **Inconsistência**: Mudanças feitas no estado de uma página (ex: mover um candidato no Kanban) não persistem após o refresh e não são refletidas em outras páginas que usam os mesmos dados.
2.  **Dificuldade de Manutenção**: Dados de teste estão espalhados por todo o código, dificultando a simulação de cenários reais.

## Objetivos
- Criar um serviço centralizado para gerenciar o estado da aplicação.
- Utilizar `localStorage` para persistir dados entre sessões.
- Garantir que todas as telas (Dashboard, Jobs, Kanban, Roles, Audit) consumam os mesmos dados.

## Escopo da Mudança
- Implementação de um `DataManager` ou Hooks globais.
- Migração dos dados iniciais de `Jobs.tsx`, `Kanban.tsx` e `Roles.tsx` para o armazenamento inicial.
- Refatoração dos componentes para realizar operações de leitura e escrita através do novo sistema.

## Riscos e Considerações
- **Consistência de Tipos**: Como o `localStorage` armazena strings, precisamos de serialização/deserialização robusta (JSON).
- **Limitação de Espaço**: O `localStorage` tem limite (~5MB), o que é suficiente para este projeto, mas deve ser monitorado se o volume de logs crescer muito.
