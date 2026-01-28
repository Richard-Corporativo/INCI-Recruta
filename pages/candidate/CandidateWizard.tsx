import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';

const CandidateWizard: React.FC = () => {
    const navigate = useNavigate();
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

            // 1. Upload Resume (Somente se houver arquivo selecionado)
            if (resumeFile) {
                const fileExt = resumeFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${user?.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, resumeFile);

                if (uploadError) {
                    if (uploadError.message.includes('Bucket not found')) {
                        throw new Error('Configuração pendente: O bucket "resumes" não foi criado no Supabase Storage.');
                    }
                    throw uploadError;
                }

                const { data: { publicUrl: url } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                publicUrl = url;
                fileNameOriginal = resumeFile.name;
            }

            // 2. Find existing Talent Bank profile for this user
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
                applied_at: new Date().toISOString(),
                initials: user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??',
                avatar_color: 'bg-primary',
                text_color: 'text-white'
            };

            const { error: candidateError } = existingCandidate
                ? await supabase.from('candidates').update(candidateData).eq('id', existingCandidate.id)
                : await supabase.from('candidates').insert([candidateData]);

            if (candidateError) throw candidateError;

            // 3. Update Profile Status to 'complete'
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({ profile_status: 'complete' })
                .eq('id', user?.id);

            if (userUpdateError) throw userUpdateError;

            await refreshProfile();
            success('Perfil atualizado com sucesso! Agora você pode se candidatar.');
            navigate('/candidate/dashboard');

        } catch (err: any) {
            console.error('Wizard Error:', err);
            error('Erro ao finalizar perfil: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-xl w-full">
                {/* Status Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                    {step === 1 && (
                        <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Seja bem-vindo, {user?.name?.split(' ')[0]}!</h2>
                            <p className="text-slate-500 mb-8">Primeiro, conte-nos onde você está e como falar com você.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Telefone com DDD</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cidade</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: São Paulo"
                                            className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estado (UF)</label>
                                        <input
                                            required
                                            maxLength={2}
                                            type="text"
                                            placeholder="SP"
                                            className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-2xl mt-10 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                Próximo Passo
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={nextStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Seu currículo (Opcional)</h2>
                            <p className="text-slate-500 mb-8">O currículo ajuda os recrutadores a conhecerem seu potencial, mas você pode enviar depois.</p>

                            <div
                                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${resumeFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-primary/40'}`}
                            >
                                <input
                                    type="file"
                                    id="resume"
                                    hidden
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="resume" className="cursor-pointer flex flex-col items-center text-center">
                                    <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 ${resumeFile ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary'}`}>
                                        <span className="material-symbols-outlined text-4xl">{resumeFile ? 'check_circle' : 'upload_file'}</span>
                                    </div>
                                    {resumeFile ? (
                                        <>
                                            <span className="text-emerald-700 font-bold block">{resumeFile.name}</span>
                                            <span className="text-emerald-600/60 text-sm">Clique para trocar o arquivo</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-slate-900 font-bold block">Clique para enviar seu currículo</span>
                                            <span className="text-slate-500 text-sm">Apenas arquivos PDF (Máx 5MB)</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button type="button" onClick={handleBack} className="flex-1 h-14 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                                    Voltar
                                </button>
                                <button type="submit" className="flex-[2] h-14 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                    {resumeFile ? 'Continuar' : 'Pular por enquanto'}
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleFinish} className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quase lá!</h2>
                            <p className="text-slate-500 mb-8">Conte um pouco sobre sua carreira atual.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cargo Atual / Último Cargo</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex: Desenvolvedor Frontend Senior"
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.current_role}
                                        onChange={e => setFormData({ ...formData, current_role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link do LinkedIn (Opcional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/seuperfil"
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.linkedin}
                                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button type="button" onClick={handleBack} className="flex-1 h-14 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                                    Voltar
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-[2] h-14 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isLoading ? 'Finalizando...' : 'Finalizar Perfil'}
                                    {!isLoading && <span className="material-symbols-outlined">celebration</span>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span className="text-xs font-medium uppercase tracking-widest">Acesso seguro e privado</span>
                </div>
            </div>
        </div>
    );
};

export default CandidateWizard;
