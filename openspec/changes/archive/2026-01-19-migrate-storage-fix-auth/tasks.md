# Tasks: Migrate Storage & Fix Auth

1. **Fix UserService Auth**
   - [ ] Verify `UserService.ts` passes `Authorization` header with valid session token to Edge Function.
   - [ ] Test user update flow to confirm `401` is resolved.

2. **Database Schema Setup**
   - [ ] Create `audit_logs` table (id, action, details, user_id, created_at).
   - [ ] Create `system_settings` table (key, value).
   - [ ] Create `roles` table (id, name, permissions, description, updated_at).
   - [ ] Enable RLS on all new tables.

3. **Migrate `useAudit`**
   - [ ] Refactor `useAudit` to fetch from Supabase `audit_logs`.
   - [ ] Update `addLog` to insert into Supabase `audit_logs`.
   - [ ] Remove `StorageService` usage.

4. **Migrate `useSettings`**
   - [ ] Refactor `useSettings` to fetch from Supabase `system_settings`.
   - [ ] Update `updateSettings` to upsert into Supabase `system_settings`.
   - [ ] Remove `StorageService` usage.

5. **Migrate `useRoles`**
   - [ ] Refactor `useRoles` to fetch from Supabase `roles`.
   - [ ] Update `addRole`, `updateRole`, `deleteRole` to use Supabase.
   - [ ] Remove `StorageService` usage.

6. **Cleanup**
   - [ ] Verify no `StorageService` calls remain in active hooks.
