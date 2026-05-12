# Proposal: Fix Remaining Errors

## O Que?
Resolver os erros residuais de runtime e dependências em hooks e services faltantes, garantindo que o portal administrativo funcione 100% sem crashes, especialmente os métodos que estão faltando no `CandidateService.ts`.

## Por Que?
Apesar de termos ajustado imports vitais e consertado o layout e diretivas `"use client"`, descobrimos que métodos como `addCandidate` e `searchCandidates` foram referenciados em `useCandidates.ts` mas não existem no `CandidateService.ts`. 
Esses erros causam crashes ou interrupções de fluxo na tela de Banco de Talentos e Kanban.

## Objetivos
- Mapear e implementar os métodos ausentes em `CandidateService.ts`.
- Garantir que nenhum hook esteja consumindo APIs inexistentes.
- Conferir e estabilizar quaisquer caminhos relativos ou alias falhos no build.
