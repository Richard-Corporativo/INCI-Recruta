# Proposal: Migrate Storage to Supabase & Fix Auth

## Summary
Replace local `StorageService` persistence with Supabase for `Settings`, `Roles`, and `AuditLogs` to stop deprecation warnings and ensure data persistence across devices. Additionally, fix the `401 Unauthorized` error when updating users via Edge Functions.

## Motivation
- The application currently uses a deprecated `StorageService` (localStorage) for several features, causing console spam and potential data loss.
- The `updateUser` function requires an Edge Function (`update-user-admin`) to safely update sensitive data (email, password) and public profile data simultaneously. This function is currently failing with `401 Unauthorized`.
- React warnings regarding `StorageService` are cluttering the console, making debugging difficult.

## Proposed Changes

### 1. Fix User Update Auth
- **Problem:** `UserService` calling `update-user-admin` fails with 401.
- **Solution:** Explicitly pass the `access_token` in the `Authorization` header when invoking the Edge Function. Ensuring the session is active before the call.

### 2. Migrate `useSettings`
- **Current:** Reads/Writes to localStorage `recruitsys_settings`.
- **New:** Read/Write to a `system_settings` table (or generic `app_config` table) in Supabase.
- **Table Schema:** `key` (text, pk), `value` (jsonb).

### 3. Migrate `useAudit`
- **Current:** Reads/Writes to localStorage `recruitsys_audit`.
- **New:** Read/Write to `audit_logs` table in Supabase.
- **Table Schema:** `id`, `action`, `details`, `user_id`, `created_at`.

### 4. Migrate `useRoles`
- **Current:** Reads/Writes to localStorage `recruitsys_roles`.
- **New:** Read/Write to `user_roles` or similar table (or just rely on `users` table `role` column, but `useRoles` implies custom role definitions? Need to check if `roles` table exists). 

## Risks
- Data in `localStorage` will not be automatically migrated to Supabase (as per standard clean slate approach, unless simple migration script is requested).
- Network latency might affect UI responsiveness compared to synchronous localStorage (loading states needed).
