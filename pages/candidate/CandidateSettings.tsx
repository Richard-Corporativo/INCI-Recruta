<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidateData } from '../../hooks/useCandidateData';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { CandidateService } from '../../src/services/CandidateService';

const CandidateSettings: React.FC = () => {
    const { currentCandidate, updateProfile } = useCandidateData();
    const { success, error } = useToast();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateSettings: React.FC = () => {
>>>>>>> parent of 3015adc (mvp concluido)
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateSettings: React.FC = () => {
>>>>>>> parent of 3015adc (mvp concluido)
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateSettings: React.FC = () => {
>>>>>>> parent of 3015adc (mvp concluido)
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        whatsapp: true
    });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    // --> otimizado: Sincronização automática com o cache global do React Query
    useEffect(() => {
        if (currentCandidate?.notification_preferences) {
            setNotifications(currentCandidate.notification_preferences as any);
        }
    }, [currentCandidate]);

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
            // --> otimizado: Persistência em background sem bloquear o fluxo do usuário
            await updateProfile({
                notification_preferences: notifications
            } as any);
            success('Preferências de notificação salvas!');
        } catch (err: any) {
            error('Erro ao salvar: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'excluir') {
            error('Digite "EXCLUIR" para confirmar a exclusão da conta');
            return;
        }

        if (!currentCandidate?.id) {
            error('Erro: Candidato não encontrado');
            return;
        }

        setIsDeleting(true);
        try {
            // Delete candidate record from database
            // This will cascade delete related records (applications, etc.)
            const deleted = await CandidateService.deleteCandidate(currentCandidate.id);

            if (!deleted) {
                throw new Error('Falha ao excluir registro do candidato');
            }

            success('Conta excluída com sucesso');

            // Sign out the user
            // Note: The auth user record should be cleaned up via database trigger
            // or you can create an edge function to handle auth user deletion
            await logout();
            navigate('/');
        } catch (err: any) {
            console.error('Error deleting account:', err);
            error('Erro ao excluir conta: ' + err.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

=======
>>>>>>> parent of 3015adc (mvp concluido)
=======
>>>>>>> parent of 3015adc (mvp concluido)
=======
>>>>>>> parent of 3015adc (mvp concluido)
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold text-foreground tracking-tight">Configurações</h2>
                <p className="text-muted-foreground text-sm font-medium">Gerencie sua segurança, privacidade e preferências de comunicação.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                {/* Security Section */}
                <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors">
                    <div className="p-8 md:p-10 border-b border-border">
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="material-symbols-outlined text-primary text-[28px]">lock_person</span>
                            Segurança de acesso
                        </h3>
                    </div>
                    <div className="p-8 md:p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <label className="flex flex-col gap-2.5">
                                <span className="text-[11px] font-semibold text-muted-foreground px-1">Senha atual</span>
                                <input
                                    type="password"
                                    className="w-full h-12 rounded-md border border-border bg-background hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 outline-none transition-all duration-200 text-sm font-semibold"
                                    placeholder="••••••••"
                                />
                            </label>
                            <label className="flex flex-col gap-2.5">
                                <span className="text-[11px] font-semibold text-muted-foreground px-1">Nova senha</span>
                                <input
                                    type="password"
                                    className="w-full h-12 rounded-md border border-border bg-background hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 outline-none transition-all duration-200 text-sm font-semibold"
                                    placeholder="••••••••"
                                />
                            </label>
                            <label className="flex flex-col gap-2.5">
                                <span className="text-[11px] font-semibold text-muted-foreground px-1">Confirmar senha</span>
                                <input
                                    type="password"
                                    className="w-full h-12 rounded-md border border-border bg-background hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 outline-none transition-all duration-200 text-sm font-semibold"
                                    placeholder="••••••••"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button className="h-12 px-10 rounded-base bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/80 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                Salvar nova senha
                            </button>
                        </div>
                    </div>
                </section>

                {/* Communications Section */}
                <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors">
                    <div className="p-8 md:p-10 border-b border-border">
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight">
                            <span className="material-symbols-outlined text-primary text-[28px]">notifications_active</span>
                            Comunicação
                        </h3>
                    </div>
                    <div className="p-8 md:p-10 space-y-8">
                        {[
                            { id: 'email', label: 'Notificações por e-mail', desc: 'Receba atualizações sobre suas candidaturas e alertas de novas vagas.', icon: 'mail' },
                            { id: 'sms', label: 'Mensagens SMS', desc: 'Alertas críticos e lembretes de entrevistas via mensagem de texto.', icon: 'sms' },
                            { id: 'whatsapp', label: 'WhatsApp', desc: 'Contato direto com recrutadores para agilização do processo.', icon: 'chat' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/5 group hover:border-ring transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-ring transition-all">
                                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                                        <span className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-md">{item.desc}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${notifications[item.id as keyof typeof notifications] ? 'bg-primary' : 'bg-muted border border-border'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-300 ease-in-out ${notifications[item.id as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 md:p-10 bg-muted/10 flex justify-end">
                        <button className="h-12 px-10 rounded-base bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/80 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            Salvar preferência
                        </button>
                    </div>
                </section>

                {/* Privacy & Danger Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors h-full flex flex-col">
                        <div className="p-8 border-b border-border">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight">
                                <span className="material-symbols-outlined text-primary text-[28px]">policy</span>
                                Privacidade e dados
                            </h3>
                        </div>
                        <div className="p-8 flex flex-col gap-6 flex-1">
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                Controlar seus dados é fundamental. Revise como suas informações são compartilhadas.
                            </p>
                            <div className="flex flex-col gap-3 mt-4">
                                <Link to="/privacidade" className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-ring transition-all group">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">Política de privacidade</span>
                                    <span className="material-symbols-outlined text-muted-foreground group-hover:translate-x-1 transition-transform">east</span>
                                </Link>
                                <Link to="/termos" className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-ring transition-all group">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">Termos de uso</span>
                                    <span className="material-symbols-outlined text-muted-foreground group-hover:translate-x-1 transition-transform">east</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="bg-destructive/5 text-destructive rounded-lg border border-destructive/20 overflow-hidden transition-colors h-full flex flex-col">
                        <div className="p-8 border-b border-destructive/20">
                            <h3 className="text-xl font-semibold text-destructive flex items-center gap-4 tracking-tight">
                                <span className="material-symbols-outlined text-[28px]">dangerous</span>
                                Zona crítica
                            </h3>
                        </div>
                        <div className="p-8 flex flex-col gap-6 flex-1">
                            <p className="text-sm font-semibold text-destructive/80 leading-relaxed tracking-tight">
                                Exclusão permanente de perfil
                            </p>
                            <p className="text-[11px] font-medium text-destructive/70 leading-relaxed">
                                Ao excluir sua conta, todos os seus dados de currículo, candidaturas e histórico serão removidos permanentemente sem possibilidade de recuperação.
                            </p>
                            <div className="mt-auto pt-8">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg shadow-destructive/10"
                                >
=======
                                <button className="w-full h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg shadow-destructive/10">
>>>>>>> parent of 3015adc (mvp concluido)
=======
                                <button className="w-full h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg shadow-destructive/10">
>>>>>>> parent of 3015adc (mvp concluido)
=======
                                <button className="w-full h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg shadow-destructive/10">
>>>>>>> parent of 3015adc (mvp concluido)
                                    Excluir perfil
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-destructive/20 rounded-xl max-w-md w-full p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-destructive text-[28px]">warning</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">Confirmar exclusão</h3>
                                <p className="text-sm text-muted-foreground">Esta ação é irreversível</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-foreground leading-relaxed">
                                Ao excluir sua conta, <strong>todos os seus dados</strong> serão permanentemente removidos, incluindo:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-[16px] mt-0.5">close</span>
                                    Perfil e informações pessoais
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-[16px] mt-0.5">close</span>
                                    Todas as candidaturas e histórico
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-[16px] mt-0.5">close</span>
                                    Currículo e documentos enviados
                                </li>
                            </ul>

                            <div className="pt-4">
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-foreground">
                                        Digite <span className="text-destructive">EXCLUIR</span> para confirmar
                                    </span>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="w-full h-12 rounded-md border border-border bg-background hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 outline-none transition-all duration-200 text-sm font-semibold"
                                        placeholder="Digite EXCLUIR"
                                        autoFocus
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation('');
                                }}
                                disabled={isDeleting}
                                className="flex-1 h-12 rounded-base border border-border bg-background text-foreground text-[11px] font-semibold hover:bg-muted transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || deleteConfirmation.toLowerCase() !== 'excluir'}
                                className="flex-1 h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-destructive/10"
                            >
                                {isDeleting ? 'Excluindo...' : 'Excluir conta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateSettings;
