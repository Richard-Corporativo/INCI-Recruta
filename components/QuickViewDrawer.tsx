import React from 'react';
import { useQuickView } from '../context/QuickViewContext';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { Job, Candidate, User, Role } from '../types';
import { Link } from 'react-router-dom';

const InfoRow = ({ icon, label, value }: { icon: string, label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-muted-foreground text-[18px] mt-0.5">{icon}</span>
            <div>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <p className="text-sm text-foreground font-medium text-balance">{value}</p>
            </div>
        </div>
    );
};

const JobView = ({ job, canViewSalaries }: { job: Job, canViewSalaries: boolean }) => (
    <div className="space-y-6">
        <div>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3`}>
                {job.status}
            </span>
            <h3 className="text-xl font-bold text-foreground leading-tight">{job.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{job.department} • {job.location}</p>
        </div>

        <div className="h-px bg-border/50"></div>

        <div className="grid grid-cols-2 gap-4">
            <InfoRow icon="work_history" label="Contrato" value={job.contract} />
            <InfoRow icon="school" label="Senioridade" value={job.seniority} />
            {canViewSalaries && (
                <InfoRow icon="payments" label="Faixa Salarial" value={`R$ ${job.salary_min?.toLocaleString()} - R$ ${job.salary_max?.toLocaleString()}`} />
            )}
            <InfoRow icon="timer" label="Urgência" value={job.urgency} />
        </div>

        {job.mission && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">flag</span> Missão
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {job.mission}
                </p>
            </div>
        )}

        <div className="flex justify-end pt-4">
            <Link to={`/admin/jobs/${job.id}`} className="w-full">
                <button className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all text-sm">
                    Ver Detalhes Completos
                </button>
            </Link>
        </div>
    </div>
);

const CandidateView = ({ candidate }: { candidate: Candidate }) => {
    const handleDownload = async () => {
        try {
            // Dynamically import to avoid circular dependencies if any, or just standard import at top.
            // But since I can't easily add import at top with this tool without replacing the whole file or multiple chunks.
            // I'll add the import at the top using multi_replace_file_content.
            // For now, assume top import is added.

            // Wait, I should add the import.
            const { CandidateService } = await import('../src/services/CandidateService');

            const result = await CandidateService.downloadResume(candidate.id);
            if (result) {
                const url = URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Currículo não encontrado.');
            }
        } catch (e) {
            console.error(e);
            alert('Erro ao baixar currículo.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center py-4 bg-muted/20 rounded-lg border border-border/50">
                <div className={`size-20 rounded-full ${candidate.avatarColor || 'bg-slate-100'} text-2xl font-bold flex items-center justify-center ${candidate.textColor || 'text-slate-600'} mb-3 border-2 border-background shadow-sm`}>
                    {candidate.avatar ? (
                        <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        candidate.initials
                    )}
                </div>
                <h3 className="text-lg font-bold text-foreground">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{candidate.role || 'Candidato'}</p>
                <div className="flex gap-2 mt-3">
                    {candidate.linkedin && (
                        <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-background border border-border rounded-full text-blue-600 hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">public</span>
                        </a>
                    )}
                    {candidate.has_resume && (
                        <button onClick={handleDownload} className="p-2 bg-background border border-border rounded-full text-red-500 hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">description</span>
                        </button>
                    )}
                    {candidate.phone && (
                        <a href={`https://wa.me/${candidate.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-background border border-border rounded-full text-green-500 hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <InfoRow icon="email" label="E-mail" value={candidate.email} />
                <InfoRow icon="call" label="Telefone" value={candidate.phone} />
                <InfoRow icon="location_on" label="Localização" value={candidate.location} />
            </div>

            {candidate.summary && (
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Sobre</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                        {candidate.summary}
                    </p>
                </div>
            )}

            <div className="flex justify-end pt-4">
                {/* If candidate has jobId, link to application detail, else talent bank? */}
                {candidate.jobId ? (
                    <Link to={`/admin/jobs/${candidate.jobId}/kanban`} className="w-full">
                        <button className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all text-sm">
                            Ver no Kanban
                        </button>
                    </Link>
                ) : (
                    <button className="w-full py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-sm hover:bg-secondary/90 transition-all text-sm">
                        Ver Perfil Completo
                    </button>
                )}
            </div>
        </div>
    );
};

const UserView = ({ user }: { user: User }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border border-primary/20 shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
                <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border uppercase tracking-wider">
                    {user.role}
                </span>
            </div>
        </div>

        <div className="h-px bg-border/50"></div>

        <div className="space-y-2">
            <InfoRow icon="mail" label="E-mail" value={user.email} />
            <InfoRow icon="domain" label="Departamento" value={user.department} />
            <InfoRow icon="schedule" label="Último Acesso" value={new Date(user.lastAccess).toLocaleString()} />
            <InfoRow icon="verified_user" label="Status" value={user.status === 'active' ? 'Ativo' : 'Suspenso'} />
        </div>

        {user.scope && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-2">Escopo de Gestão</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Visualização: <span className="font-medium text-foreground">{user.scope.vacancy_view_type === 'direct' ? 'Apenas próprias' : 'Departamento'}</span></li>
                    {user.scope.allowed_departments && user.scope.allowed_departments.length > 0 && (
                        <li>Deptos: {user.scope.allowed_departments.join(', ')}</li>
                    )}
                </ul>
            </div>
        )}
    </div>
);

const RoleView = ({ role, canViewSalaries }: { role: Role, canViewSalaries: boolean }) => (
    <div className="space-y-6">
        <div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded border border-border">{role.code}</span>
            <h3 className="text-xl font-bold text-foreground mt-2">{role.title}</h3>
            <p className="text-sm text-muted-foreground">{role.area} • {role.department}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <InfoRow icon="person" label="Senioridade" value={role.seniority} />
            <InfoRow icon="work_outline text-primary" label="Vagas Abertas" value={String(role.open_positions)} />
            {canViewSalaries && (
                <InfoRow icon="payments text-emerald-600" label="Faixa Salarial" value={`R$ ${role.salary_min?.toLocaleString()} - R$ ${role.salary_max?.toLocaleString()}`} />
            )}
        </div>

        {role.mission && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-2">Missão</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.mission}
                </p>
            </div>
        )}
    </div>
);


const QuickViewDrawer: React.FC = () => {
    const { isOpen, closeQuickView, viewType, data } = useQuickView();
    const { user } = useAuth();
    const { settings } = useSettings();

    const canViewSalaries = user?.role === 'admin' || user?.custom_permissions?.view_salaries || settings.manager_permissions.view_salaries;

    // Prevent scrolling when open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeQuickView}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                        {viewType === 'job' && <><span className="material-symbols-outlined text-primary">work</span> Detalhes da Vaga</>}
                        {viewType === 'candidate' && <><span className="material-symbols-outlined text-primary">person</span> Perfil do Candidato</>}
                        {viewType === 'user' && <><span className="material-symbols-outlined text-primary">badge</span> Dados do Usuário</>}
                        {viewType === 'role' && <><span className="material-symbols-outlined text-primary">folder_shared</span> Descrição do Cargo</>}
                    </h2>
                    <button onClick={closeQuickView} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-background">
                    {viewType === 'job' && data && <JobView job={data as Job} canViewSalaries={canViewSalaries} />}
                    {viewType === 'candidate' && data && <CandidateView candidate={data as Candidate} />}
                    {viewType === 'user' && data && <UserView user={data as User} />}
                    {viewType === 'role' && data && <RoleView role={data as Role} canViewSalaries={canViewSalaries} />}
                </div>
            </div>
        </>
    );
};

export default QuickViewDrawer;
