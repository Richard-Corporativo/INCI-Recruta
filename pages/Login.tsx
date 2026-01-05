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
        <div className="font-display bg-background text-foreground antialiased flex flex-col min-h-screen relative transition-colors duration-200 ease-in-out">
            <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10 transition-all duration-200">
                {/* Logo / Top of Z-Pattern */}
                <div className="absolute top-8 left-8 hidden lg:flex items-center gap-2.5 opacity-80 select-none transition-opacity duration-200">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[20px] filled">diversity_3</span>
                    </div>
                    <span className="text-sm font-semibold transition-colors">INCI Recrutamento</span>
                </div>

                <div className="w-full max-w-[420px] bg-card rounded-lg shadow-2xl border border-border overflow-hidden relative transition-all duration-200">
                    <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>
                    <div className="p-8 pb-6">
                        <div className="flex flex-col items-center text-center mb-10 transition-all">
                            {/* Proposta de Valor / Middle of Z-Pattern */}
                            <div className="size-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/20 transition-all">
                                <span className="material-symbols-outlined text-[36px] filled">rocket_launch</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-foreground leading-tight transition-colors">Potencialize seu recrutamento</h1>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[300px] transition-colors">
                                Gerencie vagas e talentos com as ferramentas mais rápidas do mercado.
                            </p>

                            {/* Social Proof - Trust Indicator */}
                            <div className="mt-4 flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border transition-colors">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-5 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[8px] font-semibold transition-all">U{i}</div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-semibold text-muted-foreground transition-colors">+200 gestores ativos hoje</span>
                            </div>
                        </div>

                        {/* Alerta de Erro - Exibido condicionalmente */}
                        <div className={`${error ? 'flex' : 'hidden'} mb-6 p-4 rounded-base bg-destructive/10 border border-destructive/20 items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out`} id="login-alert">
                            <span className="material-symbols-outlined text-destructive text-[22px] shrink-0">error</span>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-destructive mb-0.5">Falha na autenticação</h4>
                                <p className="text-xs text-destructive/90 leading-snug font-medium">Suas credenciais não conferem. Por favor, tente novamente ou recupere sua senha.</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2 transition-colors" htmlFor="email">
                                    E-mail corporativo
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        autoComplete="email"
                                        className="w-full h-11 h-12 pl-10 pr-3.5 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium outline-none hover:border-ring"
                                        id="email"
                                        placeholder="seu@trabalho.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center transition-colors">
                                    <label className="text-sm font-semibold text-foreground" htmlFor="password">Senha pessoal</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-all outline-none focus-visible:underline" tabIndex={-1}>Esqueci a senha</Link>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        autoComplete="current-password"
                                        className="w-full h-11 h-12 pl-10 pr-3.5 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium outline-none hover:border-ring"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 px-0.5 transition-colors">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer h-4 w-4 rounded-sm border-border text-primary focus:ring-ring dark:bg-background cursor-pointer accent-primary"
                                        id="keep-logged"
                                        type="checkbox"
                                        checked={keepConnected}
                                        onChange={(e) => setKeepConnected(e.target.checked)}
                                    />
                                </div>
                                <label className="text-sm font-semibold text-muted-foreground select-none cursor-pointer transition-colors" htmlFor="keep-logged">Permanecer logado</label>
                            </div>

                            {/* CTA - Final of Z-Pattern / High Contrast */}
                            <button className="group w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-base shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out active:scale-95 flex items-center justify-center gap-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" type="submit">
                                <span>Acessar meu painel</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform duration-200">arrow_forward</span>
                            </button>
                        </form>


                    </div>
                    <div className="bg-muted/50 border-t border-border p-6 transition-colors duration-200">
                        <div className="flex gap-4 items-start">
                            <div className="size-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 transition-all">
                                <span className="material-symbols-outlined text-muted-foreground text-[18px]">help_center</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug font-medium transition-colors">
                                Encontrou algum problema?
                                <Link to="/request-access" className="font-semibold text-foreground hover:text-primary transition-all ml-1 underline underline-offset-2 outline-none">Solicite ajuda ao Admin</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual Cue - Footer */}
                <div className="mt-10 text-center transition-all">
                    <p className="text-[10px] font-semibold text-muted-foreground/60 transition-colors">INCI Recruiting OS • v2.1.0</p>
                </div>
            </main>

            <div className="fixed inset-0 z-0 h-full w-full bg-background pointer-events-none overflow-hidden transition-colors duration-200">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.03),transparent_70%)] opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
        </div>
    );
};

export default Login;
