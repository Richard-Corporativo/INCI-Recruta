import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepConnected, setKeepConnected] = useState(false);
    const [error, setError] = useState(false);

    // Verifica se já está logado ao entrar na tela de login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const success = await login(email, password, keepConnected);
            if (success) {
                setError(false);
                navigate('/');
            } else {
                setError(true);
            }
        } catch (err: any) {
            setError(true);
            console.error(err.message);
        }
    };

    const quickLogin = async (eEmail: string, pPassword: string) => {
        setEmail(eEmail);
        setPassword(pPassword);
        try {
            const success = await login(eEmail, pPassword, false);
            if (success) {
                setError(false);
                navigate('/');
            } else {
                setError(true);
            }
        } catch (err: any) {
            setError(true);
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased flex flex-col min-h-screen relative">
            <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10">
                <div className="w-full max-w-[420px] bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400 absolute top-0 left-0"></div>
                    <div className="p-8 pb-6">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="size-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
                                <span className="material-symbols-outlined text-[32px] filled">diversity_3</span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Acesso ao Painel de Recrutamento</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                Faça login para gerenciar vagas, candidatos e processos seletivos.
                            </p>
                        </div>

                        {/* Alerta de Erro - Exibido condicionalmente */}
                        <div className={`${error ? 'flex' : 'hidden'} mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 items-start gap-3`} id="login-alert">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px] shrink-0 mt-0.5">error</span>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-red-800 dark:text-red-300 mb-0.5">Acesso negado</h4>
                                <p className="text-xs text-red-600 dark:text-red-400 leading-snug">Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">E-mail corporativo</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        autoComplete="email"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        id="email"
                                        placeholder="nome@empresa.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Senha</label>
                                    <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-dark hover:underline transition-colors" tabIndex={-1}>Esqueci minha senha</Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/20 dark:bg-slate-800 cursor-pointer"
                                        id="keep-logged"
                                        type="checkbox"
                                        checked={keepConnected}
                                        onChange={(e) => setKeepConnected(e.target.checked)}
                                    />
                                </div>
                                <label className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer" htmlFor="keep-logged">Manter conectado</label>
                            </div>
                            <button className="group w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2" type="submit">
                                <span>Entrar</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                                </div>
                                <span className="relative px-3 bg-white dark:bg-[#1a2632] text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acesso Rápido (Demo)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => quickLogin('ana.silva@company.com', 'admin')}
                                    className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all group"
                                >
                                    <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">AS</div>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Admin/RH</span>
                                </button>
                                <button
                                    onClick={() => quickLogin('carlos.souza@company.com', 'user123')}
                                    className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all group"
                                >
                                    <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">CS</div>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Gestor</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-3 items-start">
                            <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5 shrink-0">help</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                Problemas para acessar?
                                <Link to="/request-access" className="font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors hover:underline ml-1">Fale com o Admin/Qualidade.</Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Sistema Interno de RH © 2024</p>
                </div>
            </main>
            <div className="fixed inset-0 z-0 h-full w-full bg-background-light dark:bg-background-dark pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>
        </div>
    );
};

export default Login;