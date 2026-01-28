# Design: Analytics e Diversidade Segura

## 1. Arquitetura de Dados (Privacy by Design)

Para garantir os princípios "Não Negociáveis" de segurança e não-identificação individual, utilizaremos a estratégia de **Segregação Física e Lógica**.

### Tabela: `candidate_demographics` (Nova)
Segregada da tabela `candidates` para permitir políticas de RLS e acesso estritas.

- `candidate_id` (PK, FK -> candidates.id, ON DELETE CASCADE)
- `gender` (Enum: male, female, non_binary, other, prefer_not_to_say, null)
- `race` (Enum: white, black, brown, yellow, indigenous, prefer_not_to_say, null) - Padrão IBGE
- `is_pcd` (Boolean/Enum: true, false, prefer_not_to_say)
- `created_at`

### Segurança e RLS
1.  **Bloqueio Padrão:** NENHUMA role padrão (authenticated, anon) tem permissão de `SELECT` direto nesta tabela.
2.  **Inserção:** O candidato (owner) pode fazer `INSERT` apenas no momento da criação/edição do *seu próprio* perfil.
3.  **Leitura:**
    - `service_role`: Acesso total (backend only).
    - `dashboard_viewer`: NÃO acessa a tabela direta. Acessa apenas via **Views Seguras**.

## 2. Agregação e K-anonymity (Regra N ≥ 10)

Para o Dashboard, não faremos queries diretas no front. Criaremos `Postgres Views` ou `RPC Functions` que retornam apenas dados agregados e aplicam a censura de grupos pequenos.

```sql
-- Exemplo de Lógica da View (Conceitual)
SELECT
  stage_name,
  race,
  COUNT(*) as total,
  CASE WHEN COUNT(*) < 10 THEN 'Dados Insuficientes' ELSE CAST(COUNT(*) AS TEXT) END as safe_display
FROM ...
GROUP BY stage_name, race
```

## 3. Fluxos de Interface

### Coleta (Candidato)
- **Local:** Etapa final do cadastro ou aba separada "Diversidade".
- **UX:** Banner explicando "Fins estatísticos e agregados". Campos opcionais com default "Prefiro não informar".

### Bloqueios (Recrutador/Admin)
- **Profile Card:** O objeto retornado pela API `GET /candidates/:id` **NÃO** deve conter o join com `demographics`.
- **Exportação CSV:** O endpoint de exportação deve sanitizar/remover colunas demográficas se existirem.

## 4. Auditoria
- Criar tabela `audit_logs` (se não existir) para registrar acessos ao "Dashboard de Diversidade".
- Logar: `user_id`, `timestamp`, `action:VIEW_DIVERSITY_DASHBOARD`, `filters_applied`.
