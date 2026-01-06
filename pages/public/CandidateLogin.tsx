import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

const CandidateLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { error: toastError } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepConnected, setKeepConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    // Reset userNotFound state when email changes
    useEffect(() => {
        setUserNotFound(false);
    }, [email]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUserNotFound(false);

        try {
            const success = await login(email, password, keepConnected);

            if (!success) {
                // Check if user actually exists to give a better hint
                const { data: profile } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', email.trim().toLowerCase())
                    .maybeSingle();

                if (!profile) {
                    setUserNotFound(true);
                    toastError('Conta não encontrada.');
                } else {
                    toastError('E-mail ou senha incorretos.');
                }
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="font-display bg-slate-50 text-slate-900 antialiased flex flex-col min-h-[calc(100vh-80px)] relative transition-colors duration-200 ease-in-out">
            {/* PublicLayout already provides header/footer, so we center content in the remaining space */}
            <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10">

                <div className="w-full max-w-[420px] bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden relative">
                    <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>
                    <div className="p-8 pb-6">
                        <div className="flex flex-col items-center text-center mb-10">
                            {/* Icon / Value Prop */}
                            <div className="size-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/20">
                                <span className="material-symbols-outlined text-[36px] filled">person</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-slate-900 leading-tight">Área do candidato</h1>
                            <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-[300px]">
                                Acompanhe suas candidaturas e descubra novas oportunidades.
                            </p>
                        </div>

                        {userNotFound && (
                            <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 text-blue-800">
                                    <span className="material-symbols-outlined text-[20px]">info</span>
                                    <p className="text-xs font-bold">E-mail não cadastrado</p>
                                </div>
                                <p className="text-xs text-blue-700 leading-relaxed">Não encontramos uma conta com este e-mail. Deseja criar uma agora?</p>
                                <Link to="/cadastro" className="text-xs font-bold text-blue-800 underline hover:text-blue-900 transition-colors self-start mt-1">
                                    Criar conta gratuitamente
                                </Link>
                            </div>
                        )}



                        <form onSubmit={handleLogin} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2" htmlFor="email">
                                    E-mail
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        autoComplete="email"
                                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium outline-none"
                                        id="email"
                                        placeholder="seu@email.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-900" htmlFor="password">Senha</label>
                                    <Link to="/recuperar-senha" className="text-xs font-semibold text-primary hover:underline outline-none" tabIndex={-1}>Esqueci a senha</Link>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        autoComplete="current-password"
                                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium outline-none"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 px-0.5">
                                <input
                                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer border-gray-300"
                                    id="keep-logged"
                                    type="checkbox"
                                    checked={keepConnected}
                                    onChange={(e) => setKeepConnected(e.target.checked)}
                                />
                                <label className="text-sm font-semibold text-slate-500 select-none cursor-pointer" htmlFor="keep-logged">Permanecer logado</label>
                            </div>

                            <button
                                className="group w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 text-sm outline-none disabled:bg-primary/50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                <span>{isLoading ? 'Acessando...' : 'Acessar conta'}</span>
                                {!isLoading && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-600 font-medium">
                                Não tem uma conta?
                                <Link to="/cadastro" className="text-primary font-semibold hover:underline ml-1">Cadastre-se gratuitamente</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateLogin;
