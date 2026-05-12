'use client';

// @page SuperAdminDashboard | @tipo page-component | @versao 2.0.0
// > Painel INCI Brasil — visão global cross-tenant para role super_admin

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from '@src/lib/router-compat';
import { useToast } from '@src/components/ui/Toast';
import {
    getAllCompanies,
    getGlobalStats,
    updateCompanyStatus,
    deleteCompany,
    CompanyWithStats,
    GlobalStats,
} from '@src/services/super-admin.service';

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    active: {
        label: 'Ativa',
        classes: 'bg-success/10 text-success border-success/20',
        icon: 'material-symbols:check-circle-rounded',
    },
    trial: {
        label: 'Trial',
        classes: 'bg-primary/10 text-primary border-primary/20',
        icon: 'material-symbols:schedule-rounded',
    },
    suspended: {
        label: 'Suspensa',
        classes: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: 'material-symbols:block-rounded',
    },
    pending: {
        label: 'Pendente',
        classes: 'bg-warning/10 text-warning border-warning/20',
        icon: 'material-symbols:pending-rounded',
    },
} as const;

type CompanyStatus = keyof typeof STATUS_CONFIG;

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as CompanyStatus] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}>
            <Icon icon={cfg.icon} className="size-3" />
            {cfg.label}
        </span>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: number; sub?: string }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon={icon} className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight mt-0.5">{value}</p>
                {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
            </div>
        </div>
    );
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────

function ConfirmDeleteModal({
    company,
    onConfirm,
    onCancel,
    isLoading,
}: {
    company: CompanyWithStats;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-lg animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <Icon icon="material-symbols:delete-outline-rounded" className="size-5 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-base">Excluir empresa</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tem certeza que deseja excluir <span className="font-semibold text-foreground">{company.name}</span>?
                            Esta ação é irreversível e removerá todos os dados da empresa.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-accent transition-all duration-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Icon icon="svg-spinners:ring-resize" className="size-4" />
                        ) : (
                            <Icon icon="material-symbols:delete-rounded" className="size-4" />
                        )}
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

type FilterStatus = 'all' | CompanyStatus;

interface SuperAdminDashboardProps {
    initialStats?: GlobalStats | null;
    initialCompanies?: CompanyWithStats[] | null;
}

export default function SuperAdminDashboard({ initialStats, initialCompanies }: SuperAdminDashboardProps = {}) {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const [stats, setStats] = useState<GlobalStats | null>(initialStats ?? null);
    const [companies, setCompanies] = useState<CompanyWithStats[]>(initialCompanies ?? []);
    const [isLoading, setIsLoading] = useState(!initialStats);
    const [loadError, setLoadError] = useState(false);
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CompanyWithStats | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);
        try {
            const [s, c] = await Promise.all([getGlobalStats(), getAllCompanies()]);
            setStats(s);
            setCompanies(c);
        } catch {
            setLoadError(true);
            toastError('Erro ao carregar dados do painel.');
        } finally {
            setIsLoading(false);
        }
    }, [toastError]);

    useEffect(() => { load(); }, [load]);

    const handleStatusChange = async (company: CompanyWithStats, newStatus: CompanyStatus) => {
        setUpdating(company.id);
        try {
            await updateCompanyStatus(company.id, newStatus);
            setCompanies(prev => prev.map(c =>
                c.id === company.id ? { ...c, status: newStatus } : c
            ));
            success(`Status de "${company.name}" atualizado para ${STATUS_CONFIG[newStatus].label}.`);
        } catch {
            toastError('Falha ao atualizar status da empresa.');
        } finally {
            setUpdating(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteCompany(deleteTarget.id);
            setCompanies(prev => prev.filter(c => c.id !== deleteTarget.id));
            setStats(prev => prev ? { ...prev, total_companies: prev.total_companies - 1 } : prev);
            success(`Empresa "${deleteTarget.name}" excluída.`);
            setDeleteTarget(null);
        } catch {
            toastError('Falha ao excluir empresa.');
        } finally {
            setIsDeleting(false);
        }
    };

    const filtered = companies.filter(c => {
        const matchFilter = filter === 'all' || c.status === filter;
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const FILTER_TABS: { key: FilterStatus; label: string }[] = [
        { key: 'all', label: 'Todas' },
        { key: 'active', label: 'Ativas' },
        { key: 'trial', label: 'Trial' },
        { key: 'suspended', label: 'Suspensas' },
        { key: 'pending', label: 'Pendentes' },
    ];

    return (
        <>
            {deleteTarget && (
                <ConfirmDeleteModal
                    company={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isLoading={isDeleting}
                />
            )}

            <div className="space-y-8">
                {/* Page title */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Painel INCI Brasil</h1>
                    <p className="text-sm text-muted-foreground mt-1">Visão global de todas as empresas na plataforma.</p>
                </div>

                {/* Error state */}
                {loadError && !isLoading && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 flex items-center gap-4">
                        <Icon icon="material-symbols:error-outline-rounded" className="size-5 text-destructive shrink-0" />
                        <p className="text-sm text-destructive font-medium flex-1">Não foi possível carregar os dados. Verifique sua conexão.</p>
                        <button
                            onClick={load}
                            className="px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-all duration-200"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Stats */}
                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-6 h-28 animate-pulse" />
                        ))}
                    </div>
                ) : stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon="material-symbols:business-rounded"
                            label="Total de Empresas"
                            value={stats.total_companies}
                            sub={`${stats.active_companies} ativas · ${stats.trial_companies} trial`}
                        />
                        <StatCard
                            icon="material-symbols:work-rounded"
                            label="Vagas Cadastradas"
                            value={stats.total_jobs}
                        />
                        <StatCard
                            icon="material-symbols:group-rounded"
                            label="Candidaturas"
                            value={stats.total_candidates}
                        />
                        <StatCard
                            icon="material-symbols:person-rounded"
                            label="Usuários"
                            value={stats.total_users}
                            sub={`${stats.suspended_companies} empresa(s) suspensa(s)`}
                        />
                    </div>
                )}

                {/* Companies Table */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 relative">
                            <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                            <input
                                type="text"
                                placeholder="Buscar empresa..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-1">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                                        filter === tab.key
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={load}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200"
                        >
                            <Icon icon="material-symbols:refresh-rounded" className="size-4" />
                            Atualizar
                        </button>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="divide-y divide-border">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="p-5 animate-pulse h-16 bg-muted/20" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground text-sm">
                            Nenhuma empresa encontrada.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-accent/30">
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Empresa</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">CNPJ</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Localização</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                        <th className="text-center px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Membros</th>
                                        <th className="text-center px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Vagas</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden xl:table-cell">Criada em</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map(company => (
                                        <tr
                                            key={company.id}
                                            className="hover:bg-accent/20 transition-colors duration-150 cursor-pointer"
                                            onClick={() => navigate(`/super-admin/companies/${company.id}`)}
                                        >
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="font-semibold text-foreground text-sm">{company.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">/vagas/{company.slug}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell text-muted-foreground text-xs font-medium">
                                                {company.cnpj
                                                    ? company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
                                                    : <span className="text-muted-foreground/40">—</span>
                                                }
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground text-xs font-medium">
                                                {(company.city || company.state_code)
                                                    ? `${company.city ?? ''}${company.city && company.state_code ? ', ' : ''}${company.state_code ?? ''}`
                                                    : <span className="text-muted-foreground/40">—</span>
                                                }
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge status={company.status} />
                                            </td>
                                            <td className="px-5 py-4 text-center hidden lg:table-cell text-foreground font-semibold text-sm">
                                                {company.members_count}
                                            </td>
                                            <td className="px-5 py-4 text-center hidden lg:table-cell text-foreground font-semibold text-sm">
                                                {company.jobs_count}
                                            </td>
                                            <td className="px-5 py-4 hidden xl:table-cell text-muted-foreground text-xs">
                                                {new Date(company.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                                <CompanyActions
                                                    company={company}
                                                    onStatusChange={handleStatusChange}
                                                    onDelete={setDeleteTarget}
                                                    isUpdating={updating === company.id}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer count */}
                    {!isLoading && (
                        <div className="px-5 py-3 border-t border-border bg-accent/20">
                            <p className="text-[10px] text-muted-foreground font-medium">
                                {filtered.length} empresa{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
                                {filter !== 'all' || search ? ` (filtrado de ${companies.length})` : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ── Actions Dropdown ──────────────────────────────────────────────────────────

function CompanyActions({
    company,
    onStatusChange,
    onDelete,
    isUpdating,
}: {
    company: CompanyWithStats;
    onStatusChange: (c: CompanyWithStats, s: CompanyStatus) => void;
    onDelete: (c: CompanyWithStats) => void;
    isUpdating: boolean;
}) {
    const [open, setOpen] = useState(false);

    const STATUS_ACTIONS: { status: CompanyStatus; label: string; icon: string }[] = [
        { status: 'active', label: 'Ativar', icon: 'material-symbols:check-circle-rounded' },
        { status: 'trial', label: 'Definir como Trial', icon: 'material-symbols:schedule-rounded' },
        { status: 'suspended', label: 'Suspender', icon: 'material-symbols:block-rounded' },
    ];
    const statusActions = STATUS_ACTIONS.filter(a => a.status !== company.status);

    if (isUpdating) {
        return (
            <div className="flex justify-end">
                <Icon icon="svg-spinners:ring-resize" className="size-4 text-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex justify-end">
            <button
                onClick={() => setOpen(v => !v)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors duration-200 text-muted-foreground hover:text-foreground"
            >
                <Icon icon="material-symbols:more-vert-rounded" className="size-4" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl min-w-48 py-1 overflow-hidden">
                        <a
                            href={`/vagas/${company.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-200"
                            onClick={() => setOpen(false)}
                        >
                            <Icon icon="material-symbols:open-in-new-rounded" className="size-4" />
                            Ver página pública
                        </a>

                        {statusActions.length > 0 && (
                            <>
                                <div className="my-1 border-t border-border" />
                                {statusActions.map(action => (
                                    <button
                                        key={action.status}
                                        onClick={() => { setOpen(false); onStatusChange(company, action.status); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors duration-200 hover:bg-accent ${
                                            action.status === 'suspended' ? 'text-warning' : 'text-foreground'
                                        }`}
                                    >
                                        <Icon icon={action.icon} className="size-4" />
                                        {action.label}
                                    </button>
                                ))}
                            </>
                        )}

                        <div className="my-1 border-t border-border" />
                        <button
                            onClick={() => { setOpen(false); onDelete(company); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors duration-200"
                        >
                            <Icon icon="material-symbols:delete-outline-rounded" className="size-4" />
                            Excluir empresa
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
