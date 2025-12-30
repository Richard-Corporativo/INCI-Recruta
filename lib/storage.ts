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

    initialize() {
        if (localStorage.getItem(KEYS.INITIALIZED)) return;

        // Initial Mock Data
        const initialJobs: Job[] = [
            {
                id: 4092,
                title: 'Dev Frontend Senior',
                context: 'Estamos em busca de um profissional apaixonado por criar experiências digitais intuitivas e escaláveis.',
                department: 'Tecnologia',
                location: 'Remoto',
                model: 'Remoto',
                contract: 'PJ',
                urgency: 'Média',
                status: 'Ativa',
                salary_min: 12000,
                salary_max: 16000,
                mission: 'Liderar a modernização da nossa plataforma frontend.',
                candidates_count: 142,
                created_at: '15/10/2023',
                manager_id: '1'
            },
            {
                id: 48291,
                title: 'Analista de Marketing Sr.',
                context: 'Profissional responsável por estratégias de growth e performance.',
                department: 'Marketing',
                location: 'São Paulo',
                model: 'Híbrido',
                contract: 'CLT',
                urgency: 'Alta',
                status: 'Ativa',
                salary_min: 8000,
                salary_max: 12000,
                candidates_count: 45,
                created_at: '12/10/2023',
                manager_id: '2'
            },
            {
                id: 12345,
                title: 'Gerente de Projetos',
                context: 'Gestão de projetos ágeis e equipes multidisciplinares.',
                department: 'Operações',
                location: 'Florianópolis, SC',
                model: 'Presencial',
                contract: 'CLT',
                urgency: 'Média',
                status: 'Ativa',
                salary_min: 10000,
                salary_max: 15000,
                candidates_count: 22,
                created_at: '20/10/2023',
                manager_id: '1'
            },
        ];

        const initialCandidates: Candidate[] = [
            {
                id: 'c1',
                jobId: 4092,
                initials: 'JD',
                name: 'João D.',
                email: 'joao.d@gmail.com',
                phone: '(11) 98877-6655',
                location: 'São Paulo, SP',
                time: 'Há 2 dias',
                role: 'Frontend',
                match: '92% Match',
                avatarColor: 'bg-indigo-100 dark:bg-indigo-900/30',
                textColor: 'text-indigo-600 dark:text-indigo-400',
                columnId: 'received',
                applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'c2',
                jobId: 4092,
                initials: 'LM',
                name: 'Luiza M.',
                email: 'luiza.m@outlook.com',
                phone: '(11) 97766-5544',
                location: 'Curitiba, PR',
                time: 'Há 5 horas',
                role: 'UX/UI',
                match: '70% Match',
                avatarColor: 'bg-pink-100 dark:bg-pink-900/30',
                textColor: 'text-pink-600 dark:text-pink-400',
                columnId: 'received',
                applied_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'c3',
                jobId: 4092,
                initials: 'RF',
                name: 'Rafael F.',
                email: 'rafael.f@tech.com',
                phone: '(21) 96655-4433',
                location: 'Rio de Janeiro, RJ',
                time: 'Há 1 dia',
                avatarColor: 'bg-blue-50 dark:bg-blue-900/20',
                textColor: 'text-blue-600 dark:text-blue-400',
                status: 'Experiência sólida em React e Node.js. Portfólio interessante.',
                columnId: 'screening',
                applied_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'c6',
                jobId: 4092,
                initials: 'CL',
                name: 'Carla L.',
                email: 'carla.l@company.com',
                phone: '(11) 95544-3322',
                location: 'São Paulo, SP',
                time: 'Feedback Pendente',
                avatarColor: 'bg-slate-800',
                textColor: 'text-white',
                columnId: 'hired',
                applied_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                hired_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
        ];

        const initialRoles: Role[] = [
            { id: '1', code: 'TI-DEV-002', title: 'Analista de Sistemas Pleno', department: 'Tecnologia', area: 'Desenvolvimento', open_positions: 2, status: 'Ativo', updated_at: 'Há 2h' },
            { id: '2', code: 'RH-GEN-001', title: 'Gerente de Recursos Humanos', department: 'Recursos Humanos', area: 'Gestão', open_positions: 0, status: 'Ativo', updated_at: 'Ontem' },
        ];

        const initialUsers: User[] = [
            { id: '1', name: 'Ana Silva', email: 'ana.silva@company.com', role: 'admin', status: 'active', lastAccess: 'Hoje, 09:42', password: 'admin' },
            { id: '2', name: 'Carlos Souza', email: 'carlos.souza@company.com', role: 'manager', status: 'active', lastAccess: 'Ontem, 18:20', password: 'user123' },
            { id: '3', name: 'Mariana Oliveira', email: 'mariana.oliveira@company.com', role: 'manager', status: 'suspended', lastAccess: 'Há 5 dias', password: 'user123' },
        ];

        this.set(KEYS.JOBS, initialJobs);
        this.set(KEYS.CANDIDATES, initialCandidates);
        this.set(KEYS.ROLES, initialRoles);
        this.set(KEYS.USERS, initialUsers);
        this.set(KEYS.AUDIT, []);
        this.set(KEYS.INITIALIZED, 'true');
    }
};

export { KEYS };
