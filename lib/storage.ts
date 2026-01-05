import { Job, Candidate, Role, AuditLog, User } from '../types';

const KEYS = {
    JOBS: 'recruitsys_jobs',
    CANDIDATES: 'recruitsys_candidates',
    ROLES: 'recruitsys_roles',
    AUDIT: 'recruitsys_audit',
    USERS: 'recruitsys_users',
    SETTINGS: 'recruitsys_settings',
    INITIALIZED: 'recruitsys_initialized_v2'
};

export const StorageService = {
    get<T>(key: string): T | null {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (e) {
            console.error(`Error reading ${key} from localStorage`, e);
            return null;
        }
    },

    set<T>(key: string, data: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('recruitsys_storage_change', {
                detail: { key, data }
            }));
        } catch (e) {
            console.error(`Error writing ${key} to localStorage`, e);
        }
    },

    exportData(): string {
        const data: Record<string, any> = {};
        Object.values(KEYS).forEach(key => {
            const val = this.get(key);
            if (val !== null) data[key] = val;
        });
        return JSON.stringify(data, null, 2);
    },

    importData(jsonString: string): boolean {
        try {
            const data = JSON.parse(jsonString);
            const hasValidKeys = Object.values(KEYS).some(key => key in data);
            if (!hasValidKeys) return false;

            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value); // Usa o set otimizado
            });
            return true;
        } catch (e) {
            console.error("Error importing data", e);
            return false;
        }
    },

    initialize() {
        if (localStorage.getItem(KEYS.INITIALIZED)) return;

        const defaultAdmin: User = {
            id: '1',
            name: 'Administrador',
            email: 'admin@admin.com',
            role: 'admin',
            status: 'active',
            lastAccess: new Date().toLocaleDateString('pt-BR'),
            password: 'admin'
        };

        this.set(KEYS.JOBS, []);
        this.set(KEYS.CANDIDATES, []);
        this.set(KEYS.ROLES, []);
        this.set(KEYS.USERS, [defaultAdmin]);
        this.set(KEYS.AUDIT, []);
        this.set(KEYS.SETTINGS, {
            manager_permissions: {
                move_to_finalist: true,
                mark_not_selected: true,
                return_candidate_stage: false,
                close_job: false
            }
        });
        this.set(KEYS.INITIALIZED, 'true');
    }
};

export { KEYS };
