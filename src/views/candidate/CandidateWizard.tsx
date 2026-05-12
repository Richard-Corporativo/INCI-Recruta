'use client';

// @page CandidateWizard | @tipo page-component | @versao 2.0.0
// > Wizard completar perfil — Balha DS v9.1.0 + UX Conversão v3.0
// > 3 steps, progress-bar, conversion form (min campos), progressive disclosure
// @calls supabase, useAuth

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigate } from '@src/lib/router-compat';
import { supabase } from '@src/lib/supabase';
import { useAuth } from '@src/hooks/useAuth';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";
import { getSafeNextPath } from '@src/lib/navigation';

const CandidateWizard: React.FC = () => {
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const nextPath = getSafeNextPath(searchParams?.get('next'), '/candidate/dashboard');
    const { user, refreshProfile } = useAuth();
    const { success, error } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        city: '',
        state: '',
        current_role: '',
        experience_years: '',
        linkedin: '',
    });

    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleBack = () => setStep(step - 1);

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let publicUrl = '';
            let fileNameOriginal = '';

            if (resumeFile) {
                const fileExt = resumeFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${user?.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, resumeFile);

                if (uploadError) {
                    if (uploadError.message.includes('Bucket not found')) {
                        throw new Error('O bucket "resumes" não foi criado no Supabase Storage.');
                    }
                    throw uploadError;
                }

                const { data: { publicUrl: url } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                publicUrl = url;
                fileNameOriginal = resumeFile.name;
            }

            const { data: existingCandidate } = await supabase
                .from('candidates')
                .select('id')
                .eq('user_id', user?.id)
                .is('job_id', null)
                .maybeSingle();

            const candidateData = {
                user_id: user?.id,
                name: user?.name,
                email: user?.email,
                phone: formData.phone,
                location: `${formData.city}, ${formData.state}`,
                role: formData.current_role,
                resume_url: publicUrl || null,
                resume_name: fileNameOriginal || null,
                linkedin: formData.linkedin,
                column_id: 'received',
                initials: user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??',
                avatar_color: 'bg-foreground',
                text_color: 'text-background'
            };

            const { error: candidateError } = existingCandidate
                ? await supabase.from('candidates').update(candidateData).eq('id', existingCandidate.id)
                : await supabase.from('candidates').insert([candidateData]);

            if (candidateError) throw candidateError;

            const { error: userUpdateError } = await supabase
                .from('users')
                .update({ profile_status: 'complete' })
                .eq('id', user?.id);

            if (userUpdateError) throw userUpdateError;

            await refreshProfile();
            success('Perfil completo! Redirecionando ao painel.');
            navigate(nextPath);

        } catch (err: any) {
            console.error('Wizard Error:', err);
            error('Erro ao salvar: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const stepLabels = ['Contato', 'Currículo', 'Profissional'];

    return (
        <div className="min-h-screen bg-background flex flex-col antialiased">

            {/* Header — Balha v10: bg-foreground, logo INCI */}
            <header className="w-full bg-foreground py-6 px-8">
                <div className="max-w-5xl mx-auto">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-8 w-auto brightness-0 invert"
                    />
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-[520px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Complete seu perfil
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Preencha as informações para ser encontrado por recrutadores.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                            {stepLabels.map((label, i) => (
                                <span key={i} className={step >= i + 1 ? 'text-foreground' : ''}>{label}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-border'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-card border border-border rounded-2xl p-8">

                        {/* Step 1: Contato */}
                        {step === 1 && (
                            <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Informações de contato</h2>
                                    <p className="text-[11px] text-muted-foreground">Como os recrutadores podem falar com você.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex flex-col gap-2" htmlFor="wiz-phone">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Telefone</span>
                                        <input
                                            id="wiz-phone"
                                            required
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-2" htmlFor="wiz-city">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Cidade</span>
                                            <input
                                                id="wiz-city"
                                                required
                                                type="text"
                                                placeholder="São Paulo"
                                                className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2" htmlFor="wiz-state">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Estado</span>
                                            <input
                                                id="wiz-state"
                                                required
                                                maxLength={2}
                                                type="text"
                                                placeholder="SP"
                                                className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40 uppercase"
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-3">
                                    Próximo
                                    <Icon icon="material-symbols:east" className="size-5" />
                                </button>
                            </form>
                        )}

                        {/* Step 2: Currículo */}
                        {step === 2 && (
                            <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Currículo</h2>
                                    <p className="text-[11px] text-muted-foreground">Anexe seu currículo em PDF para facilitar a triagem.</p>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${resumeFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                >
                                    <input
                                        type="file"
                                        id="resume"
                                        hidden
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="resume" className="cursor-pointer flex flex-col items-center text-center space-y-4">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center ${resumeFile ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            <Icon icon={resumeFile ? 'material-symbols:check-circle' : 'material-symbols:upload-file'} className="size-7" />
                                        </div>
                                        {resumeFile ? (
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-foreground truncate max-w-xs">{resumeFile.name}</p>
                                                <p className="text-[10px] text-muted-foreground">Clique para trocar o arquivo</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-foreground">Anexar Currículo</p>
                                                <p className="text-[10px] text-muted-foreground">PDF, máx. 5MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                    <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 h-12 border border-border text-sm font-semibold text-foreground rounded-xl hover:border-primary transition-all active:scale-[0.98]">
                                        Voltar
                                    </button>
                                    <button type="submit" className="flex-[2] h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                        {resumeFile ? 'Próximo' : 'Pular'}
                                        <Icon icon="material-symbols:east" className="size-5" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Profissional */}
                        {step === 3 && (
                            <form onSubmit={handleFinish} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Dados profissionais</h2>
                                    <p className="text-[11px] text-muted-foreground">Último passo para completar seu perfil.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex flex-col gap-2" htmlFor="wiz-role">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Cargo atual</span>
                                        <input
                                            id="wiz-role"
                                            required
                                            type="text"
                                            placeholder="Ex: Desenvolvedor Fullstack"
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                            value={formData.current_role}
                                            onChange={e => setFormData({ ...formData, current_role: e.target.value })}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2" htmlFor="wiz-linkedin">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">LinkedIn</span>
                                        <input
                                            id="wiz-linkedin"
                                            type="url"
                                            placeholder="https://linkedin.com/in/seu-perfil"
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
                                            value={formData.linkedin}
                                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                        />
                                    </label>
                                </div>

                                    <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 h-12 border border-border text-sm font-semibold text-foreground rounded-xl hover:border-primary transition-all active:scale-[0.98]">
                                        Voltar
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-[2] h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                                        {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
                                        {!isLoading && <Icon icon="material-symbols:east" className="size-5" />}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t-2 border-border py-6 px-8">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        INCI Recruta · Todos os Direitos Reservados
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default CandidateWizard;
