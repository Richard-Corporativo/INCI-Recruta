# Tasks: Fix Remaining Errors

- [x] `task-1`: Adicionar o método `addCandidate` no `CandidateService.ts` (inserção Supabase).
- [x] `task-2`: Adicionar o método `searchCandidates` no `CandidateService.ts` (busca Supabase com filtros opcionais).
- [x] `task-3`: Corrigir `return` duplicado em `Settings.tsx` (TS1109).
- [x] `task-4`: Excluir `admin/**/*` do `tsconfig.json` (erros legados contaminando build).
- [x] `task-5`: Corrigir imports relativos (`../types`, `../constants`, `../src/`) em `useCandidateData`, `BenefitsSelector`, `EducationListEditor`, `ExperienceListEditor`.
- [x] `task-6`: Corrigir import de `LogDetailsModal` em `Audit.tsx` (era `shared/`, é `admin/`).
- [x] `task-7`: Corrigir TS2345 em `JobDetailHeader.tsx` (`job.id` → `String(job.id)`).
- [x] `task-8`: Corrigir TS2345 em `CreateJob.tsx` (`role_id: formData.roleId ?? ''`).
