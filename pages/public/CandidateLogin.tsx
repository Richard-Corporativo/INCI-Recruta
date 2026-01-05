import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StorageService, KEYS } from '../../lib/storage';
import { Candidate } from '../../types';

const CandidateLogin: React.FC = () => {
    const navigate = useNavigate();
    // Assuming useAuth might handle candidate logic or we mock it for now
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepConnected, setKeepConnected] = useState(false);
    const [error, setError] = useState(false);

    // Redirect logic removed to allow viewing the page freely during development/testing
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate('/vagas');
    //     }
    // }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const allCandidates = StorageService.get<Candidate[]>(KEYS.CANDIDATES) || [];
            // @ts-ignore - Accessing password field added in registration
            const found = allCandidates.find(c => c.email === email && c.password === password);

            if (found) {
                setError(false);
                // Set candidate session
                localStorage.setItem('recruitSys_candidate_email', email);
                localStorage.setItem('recruitSys_user_role', 'candidate');
                navigate('/candidate/dashboard');
            } else {
                // Secondary check: Maybe it's an admin trying to login here? No, keep it separate for now.
                setError(true);
            }
        } catch (err: any) {
            setError(true);
            console.error(err.message);
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

                        {/* Error Alert */}
                        <div className={`${error ? 'flex' : 'hidden'} mb-6 p-4 rounded-md bg-red-50 border border-red-200 items-start gap-4`}>
                            <span className="material-symbols-outlined text-red-600 text-[22px] shrink-0">error</span>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-700 mb-0.5">Falha na autenticação</h4>
                                <p className="text-xs text-red-600/90 leading-snug font-medium">Credenciais inválidas. Verifique seu e-mail e senha.</p>
                            </div>
                        </div>

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

                            <button className="group w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 text-sm outline-none" type="submit">
                                <span>Acessar conta</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
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
