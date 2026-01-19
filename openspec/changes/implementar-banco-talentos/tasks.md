# Tasks: Implementar Banco de Talentos

## 1. Banco de Dados e Schema
- [ ] 1.1 Alterar tabela `candidates`: permitir `job_id` NULL.
- [ ] 1.2 Alterar tabela `roles`: remover colunas `salary_min`, `salary_max`.
- [ ] 1.3 Alterar tabela `jobs`: adicionar colunas `salary_min`, `salary_max`.
- [ ] 1.4 Criar migração SQL para mover dados existentes de salário (Roles -> Jobs vinculados).

## 2. Backend / API
- [ ] 2.1 Atualizar `CandidateService.addCandidate` para aceitar `jobId` opcional.
- [ ] 2.2 Atualizar `JobService` e `RoleService` para refletir mudança de campos salariais.

## 3. Frontend - Portal do Candidato
- [ ] 3.1 Criar rota pública `/talentos` ou adaptar `/cadastro` para fluxo sem vaga.
- [ ] 3.2 Implementar formulário de "Candidatura Espontânea".

## 4. Frontend - Admin (Ajustes)
- [ ] 4.1 Atualizar Wizard de Criação de Vaga: incluir campos de salário.
- [ ] 4.2 Atualizar Cadastro de Cargos: remover campos de salário.
- [ ] 4.3 Garantir que candidatos com `job_id` NULL apareçam em "Banco de Talentos" ou filtro específico.
