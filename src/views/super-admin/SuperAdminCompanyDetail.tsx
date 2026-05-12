'use client';

// @page SuperAdminCompanyDetail | @tipo page-component | @versao 1.0.0
// > Detalhe completo de empresa — painel Super Admin

import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from '@src/lib/router-compat';
import { useToast } from '@src/components/ui/Toast';
import {
    getCompanyDetails,
    getCompanyMembers,
    updateCompanyStatus,
    deleteCompany,
    CompanyDetails,
    MemberWithUser,
} from '@src/services/super-admin.service';
import { Company } from '@src/types';

// ── Status helpers ─────────────────────────────────────────────────────────────

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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${cfg.classes}`}>
            <Icon icon={cfg.icon} className="size-3.5" />
            {cfg.label}
        </span>
    );
}

const ROLE_LABELS: Record<string, string> = {
    owner: 'Proprietário',
    admin: 'Administrador',
    manager: 'Gestor',
    recruiter: 'Recrutador',
    quality: 'Qualidade',
    dp: 'DP',
};

const MEMBER_STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
    active: { label: 'Ativo', classes: 'bg-success/10 text-success border-success/20' },
    suspended: { label: 'Suspenso', classes: 'bg-destructive/10 text-destructive border-destructive/20' },
    invited: { label: 'Convidado', classes: 'bg-warning/10 text-warning border-warning/20' },
};

// ── Info Row ───────────────────────────────────────────────────────────────────

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0">
            {icon && (
                <Icon icon={icon} className="size-4 text-muted-foreground/60 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest sm:w-40 shrink-0">{label}</span>
                <span className="text-sm text-foreground font-medium truncate">{value || <span className="text-muted-foreground/40">—</span>}</span>
            </div>
        </div>
    );
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon icon={icon} className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            </div>
            <div className="px-6 py-2">{children}</div>
        </div>
    );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────────

function ConfirmDeleteModal({
    companyName,
    onConfirm,
    onCancel,
    isLoading,
}: {
    companyName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <Icon icon="material-symbols:delete-outline-rounded" className="size-5 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-base">Excluir empresa</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tem certeza que deseja excluir <span className="font-semibold text-foreground">{companyName}</span>?
                            Esta ação é irreversível e removerá todos os dados associados.
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
                        {isLoading
                            ? <Icon icon="svg-spinners:ring-resize" className="size-4" />
                            : <Icon icon="material-symbols:delete-rounded" className="size-4" />
                        }
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface Props {
    companyId: string;
}

export default function SuperAdminCompanyDetail({ companyId }: Props) {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const [company, setCompany] = useState<CompanyDetails | null>(null);
    const [members, setMembers] = useState<MemberWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const [c, m] = await Promise.all([
                getCompanyDetails(companyId),
                getCompanyMembers(companyId),
            ]);
            if (!c) {
                toastError('Empresa não encontrada.');
                navigate('/super-admin/dashboard');
                return;
            }
            setCompany(c);
            setMembers(m);
        } catch {
            toastError('Erro ao carregar dados da empresa.');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, navigate, toastError]);

    useEffect(() => { load(); }, [load]);

    const handleStatusChange = async (newStatus: Company['status']) => {
        if (!company) return;
        setIsUpdatingStatus(true);
        try {
            await updateCompanyStatus(company.id, newStatus);
            setCompany(prev => prev ? { ...prev, status: newStatus } : prev);
            success(`Status atualizado para ${STATUS_CONFIG[newStatus as CompanyStatus]?.label ?? newStatus}.`);
        } catch {
            toastError('Falha ao atualizar status.');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!company) return;
        setIsDeleting(true);
        try {
            await deleteCompany(company.id);
            success(`Empresa "${company.name}" excluída.`);
            navigate('/super-admin/dashboard');
        } catch {
            toastError('Falha ao excluir empresa.');
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const formatCNPJ = (cnpj: string) =>
        cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    const WORK_MODEL_LABELS: Record<string, string> = {
        presencial: 'Presencial',
        hibrido: 'Híbrido',
        remoto: 'Remoto',
        outro: 'Outro',
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-xl" />
                <div className="bg-card border border-border rounded-2xl p-6 h-40 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse" />
                    <div className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!company) return null;

    const STATUS_ACTIONS: { status: Company['status']; label: string; icon: string }[] = [
        { status: 'active', label: 'Ativar', icon: 'material-symbols:check-circle-rounded' },
        { status: 'trial', label: 'Definir como Trial', icon: 'material-symbols:schedule-rounded' },
        { status: 'suspended', label: 'Suspender', icon: 'material-symbols:block-rounded' },
    ];

    return (
        <>
            {showDeleteModal && (
                <ConfirmDeleteModal
                    companyName={company.name}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    isLoading={isDeleting}
                />
            )}

            <div className="space-y-6">
                {/* Back + actions header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/super-admin/dashboard')}
                        className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors duration-200"
                    >
                        <Icon icon="material-symbols:arrow-back-rounded" className="size-4" />
                        Voltar
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                        <a
                            href={`/vagas/${company.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-accent transition-all duration-200"
                        >
                            <Icon icon="material-symbols:open-in-new-rounded" className="size-4" />
                            Ver página pública
                        </a>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                            <Icon icon="material-symbols:delete-outline-rounded" className="size-4" />
                            Excluir
                        </button>
                    </div>
                </div>

                {/* Company Header Card */}
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Logo placeholder */}
                    <div className="size-16 rounded-2xl bg-primary/10 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2" />
                        ) : (
                            <Icon icon="material-symbols:business-rounded" className="size-8 text-primary/60" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 flex-wrap">
                            <h1 className="text-xl font-semibold text-foreground tracking-tight">{company.name}</h1>
                            <StatusBadge status={company.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            /vagas/{company.slug}
                        </p>
                        {company.segment && (
                            <p className="text-xs text-muted-foreground mt-1">{company.segment}</p>
                        )}
                    </div>

                    {/* Status actions */}
                    <div className="flex gap-2 flex-wrap">
                        {STATUS_ACTIONS.filter(a => a.status !== company.status).map(action => (
                            <button
                                key={action.status}
                                onClick={() => handleStatusChange(action.status)}
                                disabled={isUpdatingStatus}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-50 ${
                                    action.status === 'suspended'
                                        ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                                        : action.status === 'active'
                                        ? 'border-success/30 text-success hover:bg-success/10'
                                        : 'border-primary/30 text-primary hover:bg-primary/10'
                                }`}
                            >
                                {isUpdatingStatus
                                    ? <Icon icon="svg-spinners:ring-resize" className="size-3.5" />
                                    : <Icon icon={action.icon} className="size-3.5" />
                                }
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:group-rounded" className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Membros</p>
                            <p className="text-2xl font-semibold text-foreground">{company.members_count}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:work-rounded" className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vagas</p>
                            <p className="text-2xl font-semibold text-foreground">{company.jobs_count}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3 col-span-2 sm:col-span-1">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon icon="material-symbols:calendar-today-rounded" className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cadastro</p>
                            <p className="text-sm font-semibold text-foreground">{formatDate(company.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informações Gerais */}
                    <SectionCard title="Informações Gerais" icon="material-symbols:info-outline-rounded">
                        <InfoRow label="CNPJ" value={company.cnpj ? formatCNPJ(company.cnpj) : null} icon="material-symbols:badge-outline-rounded" />
                        <InfoRow label="Segmento" value={company.segment} icon="material-symbols:category-outline-rounded" />
                        <InfoRow label="Porte" value={company.headcount} icon="material-symbols:people-outline-rounded" />
                        <InfoRow label="Tipo" value={company.company_type} icon="material-symbols:business-center-outline" />
                        <InfoRow
                            label="Modelo"
                            value={company.work_model
                                ? (company.work_model === 'outro' && company.work_model_custom
                                    ? company.work_model_custom
                                    : WORK_MODEL_LABELS[company.work_model] ?? company.work_model)
                                : null
                            }
                            icon="material-symbols:home-work-outline-rounded"
                        />
                        <InfoRow
                            label="Website"
                            value={company.website
                                ? <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a>
                                : null
                            }
                            icon="material-symbols:language-rounded"
                        />
                        <InfoRow
                            label="LinkedIn"
                            value={company.linkedin_url
                                ? <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">{company.linkedin_url}</a>
                                : null
                            }
                            icon="material-symbols:link-rounded"
                        />
                    </SectionCard>

                    {/* Localização + Responsável + Metadados */}
                    <div className="space-y-6">
                        <SectionCard title="Localização" icon="material-symbols:location-on-outline-rounded">
                            <InfoRow label="CEP" value={company.cep} icon="material-symbols:pin-drop-outline-rounded" />
                            <InfoRow label="Endereço" value={company.address} icon="material-symbols:home-outline-rounded" />
                            <InfoRow
                                label="Cidade / UF"
                                value={(company.city || company.state_code)
                                    ? `${company.city ?? ''}${company.city && company.state_code ? ' — ' : ''}${company.state_code ?? ''}`
                                    : null
                                }
                                icon="material-symbols:map-outline-rounded"
                            />
                        </SectionCard>

                        <SectionCard title="Responsável" icon="material-symbols:person-outline-rounded">
                            <InfoRow label="Nome" value={company.owner_name} icon="material-symbols:badge-outline-rounded" />
                            <InfoRow
                                label="E-mail"
                                value={company.owner_email
                                    ? <a href={`mailto:${company.owner_email}`} className="text-primary hover:underline">{company.owner_email}</a>
                                    : null
                                }
                                icon="material-symbols:mail-outline-rounded"
                            />
                        </SectionCard>

                        <SectionCard title="Metadados" icon="material-symbols:info-outline-rounded">
                            <InfoRow label="Slug" value={`/vagas/${company.slug}`} icon="material-symbols:link-rounded" />
                            <InfoRow label="ID" value={<span className="text-xs font-mono text-muted-foreground">{company.id}</span>} icon="material-symbols:tag-rounded" />
                            <InfoRow label="Atualizado em" value={formatDate(company.updated_at)} icon="material-symbols:update-rounded" />
                        </SectionCard>
                    </div>
                </div>

                {/* Members Table */}
                {members.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon icon="material-symbols:group-rounded" className="size-4 text-primary" />
                            </div>
                            <h2 className="text-sm font-semibold text-foreground">Membros da Empresa</h2>
                            <span className="ml-auto text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                {members.length}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-accent/30">
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nome</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:table-cell">E-mail</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Papel</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Status</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Ingresso</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {members.map(member => {
                                        const memberStatus = MEMBER_STATUS_CONFIG[member.status] ?? MEMBER_STATUS_CONFIG.active;
                                        return (
                                            <tr key={member.id} className="hover:bg-accent/20 transition-colors duration-150">
                                                <td className="px-5 py-3 font-semibold text-foreground text-sm">{member.name}</td>
                                                <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground text-xs font-medium">{member.email}</td>
                                                <td className="px-5 py-3">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        {ROLE_LABELS[member.role] ?? member.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 hidden md:table-cell">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${memberStatus.classes}`}>
                                                        {memberStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                                                    {member.joined_at
                                                        ? new Date(member.joined_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : '—'
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
