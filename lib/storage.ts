import { Job, Candidate, Role, AuditLog, User } from '../types';

const KEYS = {
    JOBS: 'recruitsys_jobs',
    CANDIDATES: 'recruitsys_candidates',
    ROLES: 'recruitsys_roles',
    AUDIT: 'recruitsys_audit',
    USERS: 'recruitsys_users',
    INITIALIZED: 'recruitsys_initialized'
};

export const StorageService = {
    get<T>(key: string): T | null {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error reading ${key} from localStorage`, e);
            return null;
        }
    },

    set<T>(key: string, data: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
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
            // Basic validation: check if at least one of our keys exists
            const hasValidKeys = Object.values(KEYS).some(key => key in data);
            if (!hasValidKeys) return false;

            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            return true;
        } catch (e) {
            console.error("Error importing data", e);
            return false;
        }
    },

    initialize() {
        if (localStorage.getItem(KEYS.INITIALIZED)) return;

        // Initialize with empty data, keeping only default admin account
        const defaultAdmin: User = {
            id: '1',
            name: 'Administrador',
            email: 'admin',
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
        this.set(KEYS.INITIALIZED, 'true');
    }
};

export { KEYS };
