## 1. Preparation
- [x] 1.1 Verify presence of all required shared components in `src/components/admin`
- [x] 1.2 Back up current `src/app/(admin)` (optional but recommended)

## 2. Porting Pages
- [x] 2.1 Port Dashboard: `admin/src/app/(admin)/dashboard/page.tsx` -> `src/app/(admin)/admin/dashboard/page.tsx`
- [x] 2.2 Port Audit: `admin/src/app/(admin)/audit/page.tsx` -> `src/app/(admin)/audit/page.tsx`
- [x] 2.3 Port Jobs Listing: `admin/src/app/(admin)/jobs/page.tsx` -> `src/app/(admin)/jobs/page.tsx`
- [x] 2.4 Port Jobs Kanban: `admin/src/app/(admin)/jobs/[id]/kanban/page.tsx` -> `src/app/(admin)/jobs/[id]/kanban/page.tsx`
- [x] 2.5 Port Roles Listing: `admin/src/app/(admin)/roles/page.tsx` -> `src/app/(admin)/roles/page.tsx`
- [x] 2.6 Port Roles Create: `admin/src/app/(admin)/roles/new/page.tsx` -> `src/app/(admin)/roles/new/page.tsx`
- [x] 2.7 Port Roles Edit: `admin/src/app/(admin)/roles/[id]/edit/page.tsx` -> `src/app/(admin)/roles/[id]/edit/page.tsx`
- [x] 2.8 Port Settings: `admin/src/app/(admin)/settings/page.tsx` -> `src/app/(admin)/settings/page.tsx`
- [x] 2.9 Port Talent Bank: `admin/src/app/(admin)/talent-bank/page.tsx` -> `src/app/(admin)/talent-bank/page.tsx`
- [x] 2.10 Port Admin Layout: `admin/src/app/(admin)/layout.tsx` -> `src/app/(admin)/layout.tsx`

## 3. Integration & Cleanup
- [x] 3.1 Update all ported imports to use canonical `@src/*` aliases
- [x] 3.2 Ensure `middleware.ts` correctly handles authentication for the new routes
- [x] 3.3 Validate visual consistency with Balha Design System v9.1.0

