# Design: Centralized Data Storage

## Arquitetura
Implementaremos um sistema de armazenamento baseado no padrão **Repository** ou **Service Layer**, que servirá como a única fonte de verdade (Single Source of Truth) para a aplicação frontend.

### Componentes Principais

1.  **`src/lib/storage.ts`**:
    - Classe `StorageService` responsável por:
        - `get<T>(key: string): T`
        - `set<T>(key: string, data: T): void`
        - `initialize()`: Carrega os dados iniciais mockados se o `localStorage` estiver vazio.

2.  **`src/hooks/useData.ts`**:
    - Hooks específicos para facilitar o acesso aos dados reativos:
        - `useJobs()`: Gerencia lista de vagas.
        - `useCandidates(jobId?: string)`: Gerencia candidatos de uma vaga específica ou todos.
        - `useRoles()`: Gerencia catálogo de cargos.
        - `useAuditLogs()`: Gerencia histórico de ações.

### Estrutura dos Dados no localStorage
```json
{
  "recruitsys_jobs": [ ... ],
  "recruitsys_candidates": [ ... ],
  "recruitsys_roles": [ ... ],
  "recruitsys_audit": [ ... ]
}
```

## Fluxo de Inicialização
Ao carregar a aplicação (no `App.tsx` ou `main.tsx`), o sistema verificará a existência das chaves no `localStorage`. Se não existirem, os dados atualmente "mockados" nos componentes serão inseridos como estado inicial.

## Benefícios
- **Persistência**: O usuário pode fechar o navegador e as alterações (novas vagas, mudanças de etapa) continuarão lá.
- **Reatividade**: Mudanças em uma vaga refletirão no Dashboard e na lista de vagas simultaneamente.
- **Auditoria**: Todas as mutações poderão gerar automaticamente uma entrada no log de auditoria centralizado.
