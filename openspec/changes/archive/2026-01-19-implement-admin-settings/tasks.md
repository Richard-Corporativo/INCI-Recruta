# Tasks: Implement Admin Settings

- [x] Define `SystemSettings` type and update `User` interface in `types.ts` <!-- id: 0 -->
- [x] Add `KEYS.SETTINGS` to `lib/storage.ts` and implement initialization logic <!-- id: 1 -->
- [x] Create `hooks/useSettings.ts` for managing global system settings <!-- id: 2 -->
- [x] Implement wiring for "Privileges" tab in `pages/Settings.tsx` to use `useSettings` <!-- id: 3 -->
- [x] Implement wiring for "Manager Scope" tab in `pages/Settings.tsx` to use `useUsers` for patching user scope <!-- id: 4 -->
- [x] Verify persistence of settings after page reload <!-- id: 5 -->
