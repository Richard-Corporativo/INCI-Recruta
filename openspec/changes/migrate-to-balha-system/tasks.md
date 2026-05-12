## 1. Documentation & Configuration
- [x] 1.1 Update `openspec/project.md` with Balha System v9.1.0 rules
- [x] 1.2 Replace `openspec/design-system/ux-ui-guidelines.md` with Balha principles
- [x] 1.3 Configure `Rethink Sans` in root layout
- [x] 1.4 Update global CSS tokens for light/dark modes

## 2. Automated Refactoring
- [x] 2.1 Run `fix-balha.cjs` to remove shadows and gradients
- [x] 2.2 Run `fix-typography.cjs` (if available) to apply Rethink Sans classes
- [x] 2.3 Run `fix-icons.cjs` to migrate to Material Symbols

## 3. Manual Component Updates
- [x] Task 3.1: Audit and refine Job Board / Kanban for bento grid compliance <!-- id: 4 -->
- [x] Task 3.2: Apply `tabular-nums` to all KPI cards and data tables <!-- id: 5 -->
- [x] Task 3.3: Ensure all buttons use `rounded-lg` and `min-h-[40px]` tokens <!-- id: 6 -->
- [x] Task 3.4: Audit sidebar for `bg-sidebar` and pill-shaped active items <!-- id: 7 -->

## 4. Quality Assurance
- [x] Task 4.1: Run `web-design-guidelines` skill audit <!-- id: 8 -->
- [x] Task 4.2: Verify `AdminLayout` margin consistency with slim sidebar <!-- id: 9 -->
- [x] Task 4.3: Ensure `index.css` colors match Balha v9.1.0 exactly <!-- id: 10 -->

> [!IMPORTANT]
> Migration to Balha System v9.1.0 completed. All major components (Sidebar, Dashboard, Kanban, Settings, Buttons) are now compliant with "Radical Subtraction" and high-density bento grid standards.
