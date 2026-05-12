# Proposal - Project File Documentation

## Context
O projeto INCIRecruta está em uma fase avançada de migração e consolidação arquitetural. Para garantir que novos agentes e desenvolvedores compreendam a estrutura atual sem ambiguidades, é necessário um mapeamento completo de todos os arquivos, seus papéis e responsabilidades.

## Objective
Analisar exaustivamente a estrutura de arquivos atual e gerar uma documentação técnica (SYSTEM_MAP.md) que descreva cada componente, hook, service e rota, seguindo a lógica do workflow `/code-annotator`, mas sem realizar qualquer alteração nos arquivos de código fonte.

## Scope
- Mapeamento de `src/app` (Rotas e Server Components)
- Mapeamento de `src/components` (Atoms, Molecules, Organisms)
- Mapeamento de `src/hooks` (Lógica de estado e efeitos)
- Mapeamento de `src/services` (Integração com DB/API)
- Mapeamento de `src/layouts` e `src/context`
- Documentação de arquivos de configuração raiz (`tsconfig.json`, `next.config.mjs`, etc.)

## Deliverables
- `openspec/changes/project-file-documentation/proposal.md` (Este arquivo)
- `openspec/changes/project-file-documentation/design.md` (Detalhamento do formato do mapa)
- `openspec/changes/project-file-documentation/tasks.md` (Passos de execução)
- `docs/SYSTEM_MAP.md` (O resultado final da análise)

## Constraints
- **PROIBIDO** alterar qualquer arquivo de código (`.ts`, `.tsx`, `.css`, etc.).
- A documentação deve refletir o estado real do projeto no momento da análise.
