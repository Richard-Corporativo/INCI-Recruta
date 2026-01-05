import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsModal from '../../components/candidate/TermsModal';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';
import { Candidate } from '../../types';

const CandidateRegister: React.FC = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        birthDate: '',
        password: '',
        city: '',
        state: '',
        linkedin: '',
        portfolio: '',
        acceptTerms: false,
        acceptTalentBank: false
    });

    const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
        isOpen: false,
        type: 'terms'
    });

    const openTermsModal = (e: React.MouseEvent, type: 'terms' | 'privacy') => {
        e.preventDefault();
        setTermsModal({ isOpen: true, type });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const nextStep = () => {
        window.scrollTo(0, 0);
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        window.scrollTo(0, 0);
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Sign up user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/#/login`,
                    data: {
                        name: formData.name,
                        role: 'candidate'
                    }
                }
            });

            // Check if user already exists
            if (authError) {
                if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
                    error('Este email já está cadastrado. Faça login para acessar sua conta.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
                throw authError;
            }

            if (!authData.user) throw new Error('Não foi possível criar o usuário.');

            // 2. Automatically sign in the user (no email confirmation required)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (signInError) {
                // If auto-login fails, show success message and redirect to login
                setIsSuccess(true);
                success('Cadastro realizado! Faça login para acessar sua conta.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            // 3. Navigate directly to dashboard
            success('Cadastro realizado com sucesso! Bem-vindo!');
            navigate('/candidate/dashboard');

        } catch (err: any) {
            // Only log unexpected errors
            if (!err.message?.includes('already registered')) {
                console.error('Erro no cadastro:', err);
            }
            error(`Erro ao cadastrar: ${err.message || 'Erro desconhecido'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, label: 'Dados pessoais' },
        { id: 2, label: 'Localidade e links' },
        { id: 3, label: 'Revisão' }
    ];

    // Input classes for high legibility with rounding
    const inputClasses = "w-full h-12 bg-white border border-slate-300 px-4 text-slate-900 font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all rounded-md placeholder:text-slate-400";
    const labelClasses = "block text-xs font-semibold text-slate-700 tracking-tight mb-1.5";

    const renderStep1 = () => (
        <div className="space-y-8">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-semibold text-slate-900">1. Dados pessoais</h1>
                <p className="text-slate-500 text-sm mt-1">Preencha suas informações básicas para começar.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClasses} htmlFor="name">Nome completo <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="name" name="name" required type="text" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className={labelClasses} htmlFor="cpf">CPF <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="cpf" name="cpf" required type="text" value={formData.cpf} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className={labelClasses} htmlFor="phone">Telefone <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="phone" name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses} htmlFor="email">E-mail corporativo ou pessoal <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="email" name="email" required type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses} htmlFor="password">Criar senha <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="password" name="password" required type="password" value={formData.password} onChange={handleInputChange} placeholder="Mínimo 6 caracteres" />
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button type="submit" className="bg-primary text-white px-10 h-12 font-semibold text-xs hover:bg-slate-900 transition-colors rounded-md shadow-sm">
                        Próximo passo
                    </button>
                </div>
            </form>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-semibold text-slate-900">2. Localidade e links</h1>
                <p className="text-slate-500 text-sm mt-1">Onde você está e como podemos ver seu trabalho.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                        <label className={labelClasses} htmlFor="city">Cidade <span className="text-destructive">*</span></label>
                        <input className={inputClasses} id="city" name="city" required type="text" value={formData.city} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className={labelClasses} htmlFor="state">Estado (UF) <span className="text-destructive">*</span></label>
                        <select className={inputClasses} id="state" name="state" required value={formData.state} onChange={handleInputChange}>
                            <option value="">Selecione</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses} htmlFor="linkedin">Link do LinkedIn</label>
                        <input className={inputClasses} id="linkedin" name="linkedin" type="text" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
                    </div>
                </div>

                <div className="pt-6 space-y-4">
                    <h3 className="text-xs font-semibold text-slate-700">Consentimentos</h3>
                    <div className="flex items-start gap-4 p-4 border border-slate-200 bg-slate-50 rounded-lg">
                        <input
                            type="checkbox" name="acceptTerms" required readOnly
                            className="mt-1 size-5 border-slate-300 text-primary focus:ring-0 rounded"
                            checked={formData.acceptTerms}
                        />
                        <div className="text-sm text-slate-700">
                            Li e concordo com os <button type="button" onClick={(e) => openTermsModal(e, 'terms')} className="text-primary hover:underline font-semibold">Termos de Uso</button> e a <button type="button" onClick={(e) => openTermsModal(e, 'privacy')} className="text-primary hover:underline font-semibold">Política de Privacidade</button>.
                            {!formData.acceptTerms && <p className="text-[10px] text-destructive font-semibold mt-1">Leitura obrigatória para continuar</p>}
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-between items-center">
                    <button type="button" onClick={prevStep} className="text-slate-500 hover:text-slate-900 font-semibold text-xs">
                        Voltar
                    </button>
                    <button type="submit" disabled={!formData.acceptTerms} className="bg-primary text-white px-10 h-12 font-semibold text-xs hover:bg-slate-900 transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed rounded-md shadow-sm">
                        Revisar cadastro
                    </button>
                </div>
            </form>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-10">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-semibold text-slate-900">3. Revisão dos dados</h1>
                <p className="text-slate-500 text-sm mt-1">Verifique se tudo está correto antes de finalizar.</p>
            </div>

            <div className="space-y-8">
                <div className="border border-slate-200 p-6 bg-white rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-semibold text-slate-900 border-l-4 border-primary pl-3">Dados pessoais</h2>
                        <button onClick={() => setStep(1)} className="text-primary text-[10px] font-semibold hover:underline">Editar</button>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">Nome</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.name}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">CPF</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.cpf}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">E-mail</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.email}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">Telefone</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.phone}</dd>
                        </div>
                    </dl>
                </div>

                <div className="border border-slate-200 p-6 bg-white rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-semibold text-slate-900 border-l-4 border-primary pl-3">Localidade e links</h2>
                        <button onClick={() => setStep(2)} className="text-primary text-[10px] font-semibold hover:underline">Editar</button>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">Cidade/UF</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.city} / {formData.state}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] font-semibold text-slate-500">LinkedIn</dt>
                            <dd className="text-sm font-semibold text-slate-900">{formData.linkedin || 'Não informado'}</dd>
                        </div>
                    </dl>
                </div>

                <div className="pt-10 border-t border-slate-200 flex justify-between items-center">
                    <button type="button" onClick={prevStep} className="text-slate-500 hover:text-slate-900 font-semibold text-xs">
                        Voltar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-white px-12 h-14 font-semibold text-sm hover:bg-slate-900 transition-colors rounded-md shadow-lg shadow-primary/20 disabled:bg-primary/50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Cadastrando...' : 'Finalizar cadastro'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-[800px] mx-auto py-12 px-6">
                {/* Stepper - Simple and clean */}
                <div className="flex gap-4 mb-12">
                    {steps.map((s) => (
                        <div key={s.id} className="flex-1">
                            <div className={`h-1.5 w-full mb-3 rounded-full ${step >= s.id ? 'bg-primary' : 'bg-slate-200'}`} />
                            <span className={`text-[10px] font-semibold ${step === s.id ? 'text-primary' : 'text-slate-400'}`}>
                                PASSO {s.id}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-sm min-h-[400px] flex flex-col">
                    {isSuccess ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <span className="material-symbols-outlined text-[44px] filled">mark_email_read</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Verifique seu e-mail</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
                                Enviamos um link de confirmação para <strong className="text-slate-900">{formData.email}</strong>.
                                Acesse seu e-mail para ativar sua conta e concluir a candidatura.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-primary text-white h-12 px-8 font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                Ir para Login
                            </button>
                        </div>
                    ) : (
                        <>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-semibold text-slate-400">© 2024 INCI Brasil • Portal do Candidato</p>
                </div>
            </div>

            <TermsModal
                isOpen={termsModal.isOpen}
                type={termsModal.type}
                onClose={() => setTermsModal(prev => ({ ...prev, isOpen: false }))}
                onAgree={() => setFormData(prev => ({ ...prev, acceptTerms: true }))}
            />
        </div>
    );
};

export default CandidateRegister;
