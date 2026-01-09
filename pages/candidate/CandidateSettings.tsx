import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidateData } from '../../hooks/useCandidateData';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { CandidateService } from '../../src/services/CandidateService';
import SkillsSelector from '../../components/SkillsSelector';
import ExperienceListEditor from '../../components/ExperienceListEditor';
import EducationListEditor from '../../components/EducationListEditor';
import LanguagesSelector from '../../components/LanguagesSelector';
import { Experience, Education } from '../../types';
import ProfileSkeleton from '../../components/candidate/ProfileSkeleton';

const CandidateSettings: React.FC = () => {
    const { currentCandidate, updateProfile, isLoading } = useCandidateData();
    const { success, error } = useToast();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: '',
        portfolio: '',
        resume_url: '',
        resume_name: '',
        skills: [] as string[],
        experience: [] as Experience[],
        education: [] as Education[],
        languages: [] as string[]
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        whatsapp: true
    });

    // Sync form with currentCandidate when loaded
    useEffect(() => {
        if (currentCandidate) {
            setFormData({
                name: currentCandidate.name || '',
                role: currentCandidate.role || 'Candidato',
                phone: currentCandidate.phone || '',
                location: currentCandidate.location || '',
                summary: currentCandidate.summary || '',
                linkedin: currentCandidate.linkedin || '',
                github: currentCandidate.github || '',
                portfolio: currentCandidate.portfolio || '',
                resume_url: currentCandidate.resume_url || '',
                resume_name: currentCandidate.resumeName || currentCandidate.resume_name || '',
                skills: currentCandidate.skills || [],
                experience: currentCandidate.experience || [],
                education: currentCandidate.education || [],
                languages: currentCandidate.languages || []
            });

            if (currentCandidate.notification_preferences) {
                setNotifications(currentCandidate.notification_preferences as any);
            }
        }
    }, [currentCandidate]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            error('Por favor, envie apenas arquivos PDF.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            error('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setIsSaving(true);
        try {
            const publicUrl = await CandidateService.uploadResume(file, currentCandidate?.email || 'unknown');
            setFormData(prev => ({
                ...prev,
                resume_url: publicUrl,
                resume_name: file.name
            }));
            await updateProfile({ resume_url: publicUrl, resumeName: file.name });
            success('Currículo enviado com sucesso!');
        } catch (err: any) {
            error('Erro ao enviar currículo: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({
                name: formData.name,
                role: formData.role,
                phone: formData.phone,
                location: formData.location,
                summary: formData.summary,
                linkedin: formData.linkedin,
                github: formData.github,
                portfolio: formData.portfolio,
                resume_url: formData.resume_url,
                resumeName: formData.resume_name,
                skills: formData.skills,
                experience: formData.experience,
                education: formData.education,
                languages: formData.languages
            });
            success('Perfil atualizado com sucesso!');
        } catch (err: any) {
            error('Erro ao atualizar perfil: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
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
            const deleted = await CandidateService.deleteCandidate(currentCandidate.id);
            if (!deleted) throw new Error('Falha ao excluir registro do candidato');

            success('Conta excluída com sucesso');
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

    return isLoading ? <ProfileSkeleton /> : (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-10 lg:px-14 py-8 md:py-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 pb-20">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-semibold text-foreground tracking-tight">O meu perfil</h2>
                    <p className="text-muted-foreground text-sm font-medium">Gerencie suas informações pessoais, profissionais e configurações de conta.</p>
                </div>
                <form onSubmit={handleProfileSubmit} className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors shadow-sm">
                    <div className="divide-y divide-border">
                        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                            <div className="size-32 rounded-3xl bg-cover bg-center shrink-0 border-4 border-muted shadow-lg bg-muted flex items-center justify-center text-muted-foreground" style={currentCandidate?.avatar ? { backgroundImage: `url("${currentCandidate.avatar}")` } : {}}>
                                {!currentCandidate?.avatar && <span className="material-symbols-outlined text-[48px]">person</span>}
                            </div>
                            <div className="flex flex-col gap-4 flex-1 w-full text-center md:text-left">
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-bold text-muted-foreground">Foto de perfil</span>
                                    <input accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all cursor-pointer" disabled type="file" />
                                </label>
                                <p className="text-xs text-muted-foreground font-medium">Envie uma foto profissional para seu perfil.</p>
                            </div>
                        </div>
                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground"><span className="material-symbols-outlined text-primary text-[24px]">contact_page</span>Identificação e contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">Nome completo</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" type="text" value={formData.name} onChange={handleInputChange} name="name" />
                                </label>
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">Cargo atual / desejado</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" type="text" value={formData.role} onChange={handleInputChange} name="role" />
                                </label>
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">WhatsApp de contato</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="(11) 99999-9999" type="text" value={formData.phone} onChange={handleInputChange} name="phone" />
                                </label>
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">Cidade e UF</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Ex: São Paulo, SP" type="text" value={formData.location} onChange={handleInputChange} name="location" />
                                </label>
                            </div>
                        </div>
                        <div className="p-8 md:p-12 space-y-8">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground"><span className="material-symbols-outlined text-primary text-[24px]">history_edu</span>Biografia profissional</h3>
                            <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={5} className="w-full rounded-xl border border-border bg-background p-6 outline-none text-sm font-medium leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Descreva sua experiência, objetivos e principais realizações..."></textarea>
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground">
                                <span className="material-symbols-outlined text-primary text-[24px]">school</span>
                                Formação Acadêmica
                            </h3>
                            <EducationListEditor
                                educationList={formData.education}
                                onChange={(education) => setFormData(prev => ({ ...prev, education }))}
                            />
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground">
                                <span className="material-symbols-outlined text-primary text-[24px]">work_history</span>
                                Experiência Profissional
                            </h3>
                            <ExperienceListEditor
                                experiences={formData.experience}
                                onChange={(experience) => setFormData(prev => ({ ...prev, experience }))}
                            />
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground">
                                <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
                                Habilidades e Competências
                            </h3>
                            <SkillsSelector
                                selectedSkills={formData.skills}
                                onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                            />
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground">
                                <span className="material-symbols-outlined text-primary text-[24px]">translate</span>
                                Idiomas
                            </h3>
                            <LanguagesSelector
                                selectedLanguages={formData.languages}
                                onChange={(languages) => setFormData(prev => ({ ...prev, languages }))}
                            />
                        </div>

                        <div className="p-8 md:p-12 space-y-10">
                            <h3 className="text-sm font-semibold flex items-center gap-4 text-foreground"><span className="material-symbols-outlined text-primary text-[24px]">link</span>Links e documentação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">LinkedIn</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="linkedin.com/in/..." type="text" value={formData.linkedin} onChange={handleInputChange} name="linkedin" />
                                </label>
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">GitHub</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="github.com/..." type="text" value={formData.github} onChange={handleInputChange} name="github" />
                                </label>
                                <label className="flex flex-col gap-2.5">
                                    <span className="text-xs font-semibold text-muted-foreground px-1">Portfólio / Site</span>
                                    <input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="seusite.com" type="text" value={formData.portfolio} onChange={handleInputChange} name="portfolio" />
                                </label>
                            </div>
                            <div className="flex flex-col gap-2.5 pt-4">
                                <span className="text-xs font-semibold text-muted-foreground px-1">Arquivo de currículo</span>
                                <div className="flex flex-col gap-2">
                                    {formData.resume_name && (
                                        <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-lg max-w-md">
                                            <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-semibold truncate">{formData.resume_name}</span>
                                                <a href={formData.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Baixar atual</a>
                                            </div>
                                        </div>
                                    )}
                                    <label className="relative group cursor-pointer border-2 border-dashed border-border p-8 rounded-xl bg-muted/5 hover:border-primary/40 transition-all flex flex-col items-center gap-4">
                                        <input accept=".pdf" className="hidden" type="file" onChange={handleResumeUpload} ref={fileInputRef} />
                                        <span className="material-symbols-outlined text-muted-foreground text-3xl">upload_file</span>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-foreground">Clique para anexar currículo</p>
                                            <p className="text-xs text-muted-foreground font-semibold mt-1">Clique para enviar novo arquivo (PDF • Máx. 5MB)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col sm:flex-row justify-end gap-4 bg-muted/20 border-t border-border">
                        <button type="button" onClick={() => navigate(-1)} className="h-12 px-8 rounded-base border border-border bg-background text-foreground font-semibold text-xs hover:bg-accent transition-all active:scale-95 outline-none">Descartar</button>
                        <button type="submit" disabled={isSaving} className="h-12 px-12 rounded-base bg-primary text-primary-foreground text-xs font-semibold hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-primary/10 disabled:opacity-50">
                            {isSaving ? 'Salvando...' : 'Atualizar perfil'}
                        </button>
                    </div>
                </form>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                    <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors">
                        <div className="p-8 md:p-10 border-b border-border">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight"><span className="material-symbols-outlined text-primary text-[28px]">notifications_active</span>Comunicação</h3>
                        </div>
                        <div className="p-8 md:p-10 space-y-8">
                            <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/5 group hover:border-ring transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-ring transition-all"><span className="material-symbols-outlined text-[24px]">mail</span></div>
                                    <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-foreground">Notificações por e-mail</span><span className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-md">Receba atualizações sobre suas candidaturas e alertas de novas vagas.</span></div>
                                </div>
                                <button onClick={() => setNotifications({ ...notifications, email: !notifications.email })} className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${notifications.email ? 'bg-primary' : 'bg-muted border border-border'}`}>
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-300 ease-in-out ${notifications.email ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/5 group hover:border-ring transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-ring transition-all"><span className="material-symbols-outlined text-[24px]">sms</span></div>
                                    <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-foreground">Mensagens SMS</span><span className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-md">Alertas críticos e lembretes de entrevistas via mensagem de texto.</span></div>
                                </div>
                                <button onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })} className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${notifications.sms ? 'bg-primary' : 'bg-muted border border-border'}`}>
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-300 ease-in-out ${notifications.sms ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-muted/5 group hover:border-ring transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-ring transition-all"><span className="material-symbols-outlined text-[24px]">chat</span></div>
                                    <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-foreground">WhatsApp</span><span className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-md">Contato direto com recrutadores para agilização do processo.</span></div>
                                </div>
                                <button onClick={() => setNotifications({ ...notifications, whatsapp: !notifications.whatsapp })} className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${notifications.whatsapp ? 'bg-primary' : 'bg-muted border border-border'}`}>
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-300 ease-in-out ${notifications.whatsapp ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                </button>
                            </div>
                        </div>
                        <div className="p-8 md:p-10 bg-muted/10 flex justify-end">
                            <button onClick={handleSavePreferences} disabled={isSaving} className="h-12 px-10 rounded-base bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/80 transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
                                {isSaving ? 'Salvando...' : 'Salvar preferência'}
                            </button>
                        </div>
                    </section>
                    <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors">
                        <div className="p-8 md:p-10 border-b border-border">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight"><span className="material-symbols-outlined text-primary text-[28px]">lock_person</span>Segurança</h3>
                        </div>
                        <div className="p-8 md:p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <label className="flex flex-col gap-2.5"><span className="text-[11px] font-semibold text-muted-foreground px-1">Senha atual</span><input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold" placeholder="••••••••" type="password" /></label>
                                <label className="flex flex-col gap-2.5"><span className="text-[11px] font-semibold text-muted-foreground px-1">Nova senha</span><input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold" placeholder="••••••••" type="password" /></label>
                                <label className="flex flex-col gap-2.5"><span className="text-[11px] font-semibold text-muted-foreground px-1">Confirmar senha</span><input className="w-full h-12 rounded-md border border-border bg-background px-4 outline-none text-sm font-semibold" placeholder="••••••••" type="password" /></label>
                            </div>
                            <div className="flex justify-end"><button className="h-12 px-10 rounded-base bg-foreground text-background text-[11px] font-semibold hover:bg-foreground/80 transition-all active:scale-95">Salvar nova senha</button></div>
                        </div>
                    </section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        <section className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden transition-colors h-full flex flex-col">
                            <div className="p-8 border-b border-border">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-4 tracking-tight"><span className="material-symbols-outlined text-primary text-[28px]">policy</span>Privacidade e dados</h3>
                            </div>
                            <div className="p-8 flex flex-col gap-6 flex-1">
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed">Controlar seus dados é fundamental. Revise como suas informações são compartilhadas.</p>
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
                                <h3 className="text-xl font-semibold text-destructive flex items-center gap-4 tracking-tight"><span className="material-symbols-outlined text-[28px]">dangerous</span>Zona crítica</h3>
                            </div>
                            <div className="p-8 flex flex-col gap-6 flex-1">
                                <p className="text-sm font-semibold text-destructive/80 leading-relaxed tracking-tight">Exclusão permanente de perfil</p>
                                <div className="mt-auto pt-8">
                                    <button onClick={() => setShowDeleteModal(true)} className="w-full h-12 rounded-base bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg shadow-destructive/10">Excluir perfil</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Delete Modal - Kept separate to keep main structure clean */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-border">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">Excluir conta permanentemente?</h3>
                            <p className="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita. Todos os seus dados serão perdidos.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm font-medium text-foreground">Digite <span className="font-bold text-destructive">EXCLUIR</span> para confirmar:</p>
                            <input
                                autoFocus
                                type="text"
                                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-destructive/30"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                            />
                        </div>
                        <div className="p-4 bg-muted/20 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation.toLowerCase() !== 'excluir' || isDeleting}
                                className="px-4 py-2 text-xs font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateSettings;
