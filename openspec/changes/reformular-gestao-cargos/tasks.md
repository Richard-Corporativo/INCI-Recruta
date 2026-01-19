# Tasks: Reformulação de Cargos

## 1. Banco de Dados
- [ ] 1.1 Expandir tabela `roles` com colunas:
    - `mission` (text)
    - `responsibilities` (text/json)
    - `requirements_technical` (json array)
    - `requirements_behavioral` (json array)
    - `kpis` (text/json)
    - `competencies` (text/json)
    - `revision_code` (string)
    - `level` (enum: 'junior', 'pleno', 'senior')

## 2. Backend
- [ ] 2.1 Atualizar `RoleService` (CRUD) para suportar novos campos.
- [ ] 2.2 Implementar checks de permissão no backend: bloquear UPDATE/DELETE em `roles` para perfil `manager`.

## 3. Frontend
- [ ] 3.1 Refazer formulário de Criação/Edição de Cargos com novos campos (abas ou seções).
- [ ] 3.2 Implementar seletor de Nível (Jr/Pl/Sr).
- [ ] 3.3 No formulário de Vaga, tornar a seleção de Cargo OBRIGATÓRIA e bloquear avanço sem ela.
- [ ] 3.4 Desabilitar botões de "Novo Cargo" e "Editar Cargo" para usuários `Manager`.
