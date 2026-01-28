import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const CandidateRegister: React.FC = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Sign up user in Supabase Auth
            // O Trigger handle_new_user() no Postgres criará automaticamente o registro em public.users
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        name: formData.name,
                        role: 'candidate'
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    error('Este e-mail já está cadastrado. Faça login para continuar.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
                throw authError;
            }

            if (!authData.user) throw new Error('Não foi possível criar o usuário.');

            // 2. Auto-login (Supabase costuma fazer auto-login se não exigir confirmação de e-mail)
            // Caso exija confirmação, mostramos mensagem de sucesso.

            // Se houver sessão imediata, redireciona para o Wizard
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                success('Conta criada com sucesso! Complete seu perfil agora.');
                navigate('/perfil/completar');
            } else {
                success('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
                navigate('/login');
            }

        } catch (err: any) {
            console.error('Erro no cadastro:', err);
            error(`Erro ao cadastrar: ${err.message || 'Erro desconhecido'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">person_add</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Crie sua conta de candidato
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Junte-se à nossa rede de talentos em poucos segundos.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                                Nome completo
                            </label>
                            <div className="mt-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">person</span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                    placeholder="Como quer ser chamado?"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                E-mail
                            </label>
                            <div className="mt-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                    placeholder="seu@box.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Senha
                            </label>
                            <div className="mt-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:bg-primary/50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Criando conta...
                                    </span>
                                ) : (
                                    'Cadastrar e continuar'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-center text-sm text-slate-600">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="font-bold text-primary hover:underline transition-all">
                                Fazer login
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Ao se cadastrar, você concorda com nossos <br /> termos e políticas de privacidade.
                </p>
            </div>
        </div>
    );
};

export default CandidateRegister;
