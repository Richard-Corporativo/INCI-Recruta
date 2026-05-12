# Change: Blueprint and Implementation Plan for Candidate Portal

## Why
The recruitment system currently focuses on the Admin side. To become a full ATS, it needs a Candidate Portal where applicants can browse jobs, apply, and track their progress. This plan formalizes the architecture and roadmap for this expansion.

## What Changes
- Formalizes the "Portal do Candidato" blueprint based on `PORTAL_CANDIDATO.md`.
- Defines a comprehensive checklist for Phase 1 to Phase 5.
- Proposes a potential migration path to Supabase to handle real-time integration between Admin and Candidate.
- **BREAKING**: This doc-only change doesn't break code, but the subsequent implementation will introduce new routing and data structures.

## Impact
- Affected specs: `candidate-portal` (NEW)
- Affected code: None (Design phase)
