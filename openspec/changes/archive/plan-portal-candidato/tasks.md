# Tasks: Candidate Portal Implementation Checklist

## 1. Foundation (Phase 1)
- [ ] 1.1 Configure Supabase project (Project ID, URL, Anon Key)
- [ ] 1.2 Implement `SupabaseService` in `lib/supabase.ts`
- [ ] 1.3 Create Database Schemas (`candidatos`, `vagas`, `inscricoes`)
- [ ] 1.4 Migrate existing local storage data to Supabase (CLI/Script)

## 2. Shared Capabilities (Phase 2)
- [ ] 2.1 Update `StorageService` to prioritize remote data
- [ ] 2.2 Implement Public API routes (authenticated vs public)

## 3. Public Portal (Phase 3)
- [ ] 3.1 Create `/vagas` route and Job List component
- [ ] 3.2 Create `/vagas/:id` route and Detailed Job view
- [ ] 3.3 Add "Apply Now" button logic (triggering login/signup)

## 4. Candidate Experience (Phase 4)
- [ ] 4.1 Implement Candidate Login/Signup flow
- [ ] 4.2 Build `/dashboard` for application tracking
- [ ] 4.3 Build `/perfil` for resume management and bio

## 5. Integration (Phase 5)
- [ ] 5.1 Implement Real-time listeners for status updates
- [ ] 5.2 Add Notification Center (In-app alerts)
- [ ] 5.3 Configure E-mail service (Resend) for Kanban updates
- [ ] 5.4 Final UX sweep (Transitions, Loading states)
