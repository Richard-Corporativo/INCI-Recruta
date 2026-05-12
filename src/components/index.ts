/**
 * @file src/components/index.ts
 * Barrel exports organizados por domínio.
 *
 * Uso: import { Sidebar, QuickViewDrawer } from '@src/components'
 */

// ─── Shared (cross-domain) ──────────────────────────────────────────────────
export { default as Sidebar } from './shared/Sidebar';
export { default as Breadcrumbs } from './shared/Breadcrumbs';
export { default as BaseModal } from './shared/BaseModal';
export { default as ConfirmationModal } from './shared/ConfirmationModal';
export { default as AdminLayoutSkeleton } from './shared/AdminLayoutSkeleton';

// ─── UI (atoms) ──────────────────────────────────────────────────────────────
export * from './ui/SplashScreen';
export * from './ui/Toast';

// ─── Atomic Design (atoms/molecules/organisms/templates) ─────────────────────
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';
