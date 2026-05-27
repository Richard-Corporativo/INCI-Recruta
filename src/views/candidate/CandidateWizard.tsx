'use client';

// @page CandidateWizard | @tipo page-component | @versao 2.1.1
// > Wizard completar perfil — Balha DS v9.1.0 + UX Conversão v3.0
// > 3 steps, progress-bar, conversion form (min campos), progressive disclosure
// @calls supabase, useAuth

import React, { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigate } from '@src/lib/router-compat';
import { supabase } from '@src/lib/supabase';
import { useAuth } from '@src/hooks/useAuth';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";
import { getSafeNextPath } from '@src/lib/navigation';
import locationService, { type City } from '@src/services/location.service';

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
        not_working: false,
    });

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCityChange = (value: string) => {
        setFormData(prev => ({ ...prev, city: value }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.length < 2) { setCitySuggestions([]); setShowSuggestions(false); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                const all = await locationService.getAllCities();
                const lower = value.toLowerCase();
                const filtered = all.filter(c => c.nome.toLowerCase().startsWith(lower)).slice(0, 8);
                setCitySuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
            } catch {
                setCitySuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
    };

    const handleCitySelect = (city: City) => {
        setFormData(prev => ({ ...prev, city: city.nome, state: city.uf }));
        setCitySuggestions([]);
        setShowSuggestions(false);
    };

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
            console.log('[CandidateWizard] Iniciando handleFinish...');
            let publicUrl = '';
            let fileNameOriginal = '';

            // 1. Upload de Currículo
            if (resumeFile) {
                console.log('[CandidateWizard] Fazendo upload do currículo:', resumeFile.name);
                const fileExt = resumeFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${user?.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, resumeFile);

                if (uploadError) {
                    console.error('[CandidateWizard] Erro no upload:', uploadError);
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
                console.log('[CandidateWizard] Upload concluído:', publicUrl);
            }

            // 2. Busca Candidato Existente
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
                role: formData.not_working ? '' : formData.current_role,
                resume_url: publicUrl || null,
                resume_name: fileNameOriginal || null,
                linkedin: formData.linkedin,
                column_id: 'received',
                initials: user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??',
                avatar_color: 'bg-foreground',
                text_color: 'text-background'
            };

            // 3. Upsert na tabela candidates
            if (existingCandidate) {
                await supabase.from('candidates').update(candidateData).eq('id', existingCandidate.id);
            } else {
                await supabase.from('candidates').insert([candidateData]);
            }

            // 4. Update dados na tabela users (para o middleware detectar completude via phone)
            console.log('[CandidateWizard] Atualizando dados de contato do usuário...');
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({ 
                    phone: formData.phone,
                    location: `${formData.city}, ${formData.state}`,
                    linkedin: formData.linkedin
                })
                .eq('id', user?.id);

            if (userUpdateError) {
                console.error('[CandidateWizard] Erro ao atualizar dados do usuário:', userUpdateError);
                throw userUpdateError;
            }

            // 5. Sincroniza estado local e redireciona
            await refreshProfile();
            
            success('Perfil completo! Redirecionando...');
            navigate(nextPath);

        } catch (err: any) {
            console.error('[CandidateWizard] Erro fatal:', err);
            error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
        } finally {
            setIsLoading(false);
        }
    };

    const stepLabels = ['Contato', 'Currículo', 'Profissional'];

    return (
        <div className="min-h-screen bg-background flex flex-col antialiased">
            <header className="w-full bg-foreground py-6 px-8">
                <div className="max-w-5xl mx-auto">
                    <img
                        src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png"
                        alt="INCI Recruta"
                        className="h-8 w-auto brightness-0 invert"
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-[520px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Complete seu perfil
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Preencha as informações para ser encontrado por recrutadores.
                        </p>
                    </div>

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

                    <div className="bg-card border border-border rounded-2xl p-8">
                        {step === 1 && (
                            <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Informações de contato</h2>
                                    <p className="text-[11px] text-muted-foreground">Como os recrutadores podem falar com você.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Telefone</span>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none transition-all"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Cidade</span>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="São Paulo"
                                                    className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none"
                                                    value={formData.city}
                                                    onChange={e => handleCityChange(e.target.value)}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                                    autoComplete="off"
                                                />
                                                {showSuggestions && (
                                                    <ul className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                                                        {citySuggestions.map(city => (
                                                            <li
                                                                key={city.id}
                                                                onMouseDown={() => handleCitySelect(city)}
                                                                className="px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10 cursor-pointer flex justify-between items-center transition-colors"
                                                            >
                                                                <span>{city.nome}</span>
                                                                <span className="text-[10px] font-bold text-muted-foreground">{city.uf}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Estado</span>
                                            <input
                                                required
                                                maxLength={2}
                                                type="text"
                                                placeholder="SP"
                                                className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none uppercase"
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl flex items-center justify-center gap-3">
                                    Próximo
                                    <Icon icon="material-symbols:east" className="size-5" />
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Currículo</h2>
                                    <p className="text-[11px] text-muted-foreground">Anexe seu currículo em PDF para facilitar a triagem.</p>
                                </div>

                                <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${resumeFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                    <input
                                        type="file"
                                        id="resume-wizard"
                                        hidden
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="resume-wizard" className="cursor-pointer flex flex-col items-center text-center space-y-4">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center ${resumeFile ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            <Icon icon={resumeFile ? 'material-symbols:check-circle' : 'material-symbols:upload-file'} className="size-7" />
                                        </div>
                                        {resumeFile ? (
                                            <p className="text-sm font-semibold text-foreground truncate max-w-xs">{resumeFile.name}</p>
                                        ) : (
                                            <p className="text-sm font-semibold text-foreground">Anexar Currículo (PDF)</p>
                                        )}
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 h-12 border border-border text-sm font-semibold text-foreground rounded-xl">
                                        Voltar
                                    </button>
                                    <button type="submit" className="flex-[2] h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl flex items-center justify-center gap-3">
                                        {resumeFile ? 'Próximo' : 'Pular'}
                                        <Icon icon="material-symbols:east" className="size-5" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleFinish} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-foreground">Dados profissionais</h2>
                                    <p className="text-[11px] text-muted-foreground">Último passo para completar seu perfil.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                                            formData.not_working ? 'bg-primary border-primary text-white' : 'border-border bg-background group-hover:border-primary/50'
                                        }`}>
                                            {formData.not_working && <Icon icon="material-symbols:check" className="size-3.5" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.not_working}
                                            onChange={() => setFormData(prev => ({ ...prev, not_working: !prev.not_working }))}
                                        />
                                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Não estou trabalhando no momento
                                        </span>
                                    </label>

                                    {!formData.not_working && (
                                        <label className="flex flex-col gap-2">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Cargo atual</span>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ex: Desenvolvedor"
                                                className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none"
                                                value={formData.current_role}
                                                onChange={e => setFormData({ ...formData, current_role: e.target.value })}
                                            />
                                        </label>
                                    )}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">LinkedIn</span>
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/..."
                                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-sm font-semibold text-foreground focus:border-primary outline-none"
                                            value={formData.linkedin}
                                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                        />
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 h-12 border border-border text-sm font-semibold text-foreground rounded-xl">
                                        Voltar
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-[2] h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-3">
                                        {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
                                        {!isLoading && <Icon icon="material-symbols:east" className="size-5" />}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <footer className="w-full border-t-2 border-border py-6 px-8">
                <div className="max-w-5xl mx-auto">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        INCI Recruta · Todos os Direitos Reservados
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default CandidateWizard;
