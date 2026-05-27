# Arquitetura — INCIRecruta-Migração

> Documento de referência para manutenção e onboarding técnico. Atualizado pós-revisão de segurança (2026-05-14).

---

## Estrutura de Diretórios Canônica

O projeto utiliza **Next.js 15 (App Router)** com arquitetura de camadas.

```
INCIRecruta/
├── src/                        ← CANÔNICO (fonte de verdade)
│   ├── app/                    ← Next.js App Router (Rotas e Layouts)
│   │   ├── (public)/           ← Vagas, Login, Cadastro (Acesso anon)
│   │   ├── (candidate)/        ← Dashboard e Candidaturas (Acesso candidate)
│   │   └── (admin)/            ← Kanban, Gestão de Vagas, Audit (Acesso admin/owner)
│   ├── components/             ← UI Atomic Design (shared, admin, candidate)
│   ├── services/               ← Camada de Dados (RPC Supabase, PostgREST)
│   ├── hooks/                  ← Lógica de estado e fetch (SWR/React)
│   ├── lib/                    ← Utilitários (Supabase client, formatters)
│   └── types/                  ← Definições TypeScript globais
├── supabase/                   ← Configurações e Migrações DB
│   └── migrations/             ← Migrações ATIVAS e Auditoria de Segurança
├── docs/                       ← Documentação funcional e técnica
│   └── .archive/               ← Histórico de migrações e planos obsoletos
├── scripts/                    ← Scripts de validação e automação
├── .agents/                    ← Configurações do Agente AI (Specs e Skills)
└── package.json                ← Dependências (Limpas e otimizadas)
```

---

## Camadas e Fluxo de Dados

A hierarquia de imports deve ser sempre descendente para evitar loops e facilitar testes:

```
App (page.tsx) → Components → Hooks → Services → Supabase
                                 ↓
                            Contexts (Auth)
                                 ↓
                            Lib / Utils
```

*   **Services**: Não podem importar componentes ou hooks. Devem ser agnósticos à UI.
*   **Hooks**: Encapsulam a chamada ao service e tratam o estado local (loading, error).
*   **Middleware**: Realiza o Guard de Role-Based Access Control (RBAC) via Supabase Auth + DB Lookup.

---

## Pilares de Segurança (Hardenizado em 2026-05-14)

1.  **Isolamento Multitenant**: Todo Service (especialmente `RecommendationService`) deve validar o `company_id`.
2.  **Proteção de RPC**: Funções sensíveis (search, communications) possuem o `EXECUTE` revogado para o role `anon`.
3.  **RLS (Row Level Security)**: Obrigatório em todas as tabelas. Inserções de candidatos exigem `auth.uid() = user_id`.
4.  **Middleware Guard**: Não confia apenas no JWT Metadata; verifica o role no Banco de Dados em tempo real para rotas protegidas.
5.  **Debug**: A rota `/debug` é bloqueada automaticamente em ambiente de produção.

---

## Design System — Balha v9.1.0

*   **Tipografia**: Rethink Sans (`font-sans`).
*   **Tokens**: Uso exclusivo de variáveis CSS Tailwind (proibido HEX hardcoded).
*   **Restrições**: Sem Shadows, Gradients ou Backdrop-blur (Minimalismo Estrutural).
*   **Interação**: Transições de `200ms` em todos os estados de hover.

---

## Guia de Manutenção

*   **Novas Migrações**: Criar sempre em `supabase/migrations/`.
*   **Novos Componentes**: Devem ser criados como **Client Components** apenas se houver interatividade.
*   **Remoção de Código**: Sempre verificar imports residuais via `grep` antes de deletar arquivos.
