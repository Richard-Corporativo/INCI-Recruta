/**
 * Role-Based Access Control (RBAC) Constants
 */

/**
 * Administrative roles that have access to admin routes
 */
export const ADMIN_ROLES = ['admin', 'manager', 'recruiter', 'quality', 'dp'] as const;

/**
 * Type for administrative roles
 */
export type AdminRole = typeof ADMIN_ROLES[number];

/**
 * All possible user roles in the system
 */
export const ALL_ROLES = [...ADMIN_ROLES, 'candidate'] as const;

/**
 * Type for all user roles
 */
export type UserRole = typeof ALL_ROLES[number];

/**
 * Check if a role is an administrative role
 */
export const isAdminRole = (role: string | undefined): boolean => {
    if (!role) return false;
    return ADMIN_ROLES.includes(role as AdminRole);
};

/**
 * Check if a role is a candidate role
 */
export const isCandidateRole = (role: string | undefined): boolean => {
    return role === 'candidate';
};
