# Tasks: Reformulação de Cargos

## 1. Banco de Dados
- [x] 1.1 Expandir tabela `roles` com colunas:
    - `mission` (text)
    - `responsibilities` (text/json)
    - `requirements_technical` (json array/text)
    - `requirements_behavioral` (json array/text)
    - `kpis` (text/json)
    - `competencies` (text/json)
    - `revision_code` (string)
    - `level` (numeric/enum)

## 2. Backend
- [x] 2.1 Atualizar `RoleService` (CRUD) para suportar novos campos.
- [x] 2.2 Implementar checks de permissão no backend: bloquear UPDATE/DELETE em `roles` para perfil `manager`.

## 3. Frontend
- [x] 3.1 Refazer formulário de Criação/Edição de Cargos com novos campos (abas ou seções).
- [x] 3.2 Implementar seletor de Nível (Jr/Pl/Sr) e Graduação (1-10).
- [x] 3.3 No formulário de Vaga, tornar a seleção de Cargo OBRIGATÓRIA e bloquear avanço sem ela.
- [x] 3.4 Desabilitar botões de "Novo Cargo" e "Editar Cargo" para usuários `Manager`.
