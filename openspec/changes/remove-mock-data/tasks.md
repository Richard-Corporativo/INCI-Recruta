## Tasks

- [x] Remove hardcoded mock data arrays from `lib/storage.ts` <!-- id: task-0 -->
- [x] Update `StorageService.initialize()` to initialize with empty arrays, keeping only one default admin user <!-- id: task-1 -->
- [x] Remove mock data fallback in `pages/Dashboard.tsx` (line 61: `return 38;`) <!-- id: task-2 -->
- [x] Verify `pages/Jobs.tsx` and other components for any other localized mock data <!-- id: task-3 -->
- [x] Test empty state behavior in Dashboard and Jobs views <!-- id: task-4 -->
- [x] Validate login still works with default admin credentials <!-- id: task-5 -->
- [x] Fix Dashboard links to Jobs page (navigate to Kanban view) <!-- id: task-6 -->

**Note**: Para testar completamente, limpe o localStorage com `localStorage.clear()` no console do navegador e recarregue a página.
