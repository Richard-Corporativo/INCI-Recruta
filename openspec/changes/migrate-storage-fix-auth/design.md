# Design: Storage Migration

## Database Schema

### `audit_logs`
Tracks critical system actions.
- `id` (uuid, pk)
- `action` (text)
- `details` (jsonb/text)
- `user_id` (uuid, fk to users.id)
- `created_at` (timestamptz)

### `system_settings`
Key-value store for global settings.
- `key` (text, pk)
- `value` (jsonb)
- `updated_at` (timestamptz)

### `roles`
Defines available roles and their metadata.
- `id` (uuid, pk)
- `name` (text)
- `description` (text)
- `permissions` (jsonb) - e.g., list of allowed actions
- `updated_at` (timestamptz)

## Policies (RLS)
- `audit_logs`: Insert (authenticated), Select (admin only).
- `system_settings`: Select (authenticated), Update (admin only).
- `roles`: Select (authenticated), Insert/Update/Delete (admin only).
