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
        <div className="font-display bg-background text-foreground antialiased flex flex-col min-h-screen relative transition-colors duration-200">
            <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 z-10">
                {/* Logo / Top of Z-Pattern */}
                <div className="absolute top-8 left-8 hidden lg:flex items-center gap-2.5 opacity-80 select-none">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
                        <span className="material-symbols-outlined text-[20px] filled">diversity_3</span>
                    </div>
                    <span className="text-sm font-bold tracking-tight uppercase">INCI Recrutamento</span>
                </div>

                <div className="w-full max-w-[420px] bg-card rounded-lg shadow-2xl border border-border overflow-hidden relative">
                    <div className="h-1.5 w-full bg-primary absolute top-0 left-0"></div>
                    <div className="p-8 pb-6">
                        <div className="flex flex-col items-center text-center mb-10">
                            {/* Proposta de Valor / Middle of Z-Pattern */}
                            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner border border-primary/20">
                                <span className="material-symbols-outlined text-[36px] filled">rocket_launch</span>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">Potencialize seu Recrutamento</h1>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[300px]">
                                Gerencie vagas e talentos com as ferramentas mais rápidas do mercado.
                            </p>

                            {/* Social Proof - Trust Indicator */}
                            <div className="mt-4 flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-5 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[8px] font-bold">U{i}</div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">+200 gestores ativos hoje</span>
                            </div>
                        </div>

                        {/* Alerta de Erro - Exibido condicionalmente */}
                        <div className={`${error ? 'flex' : 'hidden'} mb-6 p-4 rounded-base bg-destructive/10 border border-destructive/20 items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300`} id="login-alert">
                            <span className="material-symbols-outlined text-destructive text-[22px] shrink-0">error</span>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-destructive mb-0.5">Falha na Autenticação</h4>
                                <p className="text-xs text-destructive/90 leading-snug font-medium">Suas credenciais não conferem. Por favor, tente novamente ou recupere sua senha.</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground flex items-center gap-2" htmlFor="email">
                                    E-mail corporativo
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        autoComplete="email"
                                        className="w-full pl-10 pr-3.5 py-3 bg-background border border-border rounded-base text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-medium"
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
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-foreground" htmlFor="password">Senha pessoal</label>
                                    <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors" tabIndex={-1}>Esqueci a senha</Link>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-3.5 py-3 bg-background border border-border rounded-base text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-medium"
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
                                <div className="relative flex items-center">
                                    <input
                                        className="peer h-4 w-4 rounded-sm border-border text-primary focus:ring-ring dark:bg-background cursor-pointer"
                                        id="keep-logged"
                                        type="checkbox"
                                        checked={keepConnected}
                                        onChange={(e) => setKeepConnected(e.target.checked)}
                                    />
                                </div>
                                <label className="text-sm font-bold text-muted-foreground select-none cursor-pointer uppercase tracking-wide" htmlFor="keep-logged">Permanecer logado</label>
                            </div>

                            {/* CTA - Final of Z-Pattern / High Contrast */}
                            <button className="group w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-base shadow-lg shadow-primary/20 transition-all active:translate-y-[1px] flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider" type="submit">
                                <span>Acessar meu Painel</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-10">
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <span className="relative px-4 bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Ambiente de Demonstração</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => quickLogin('ana.silva@company.com', 'admin')}
                                    className="flex flex-col items-center gap-1.5 p-3.5 rounded-base border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                >
                                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">AS</div>
                                    <span className="text-[10px] font-bold text-foreground">Admin / RH</span>
                                </button>
                                <button
                                    onClick={() => quickLogin('carlos.souza@company.com', 'user123')}
                                    className="flex flex-col items-center gap-1.5 p-3.5 rounded-base border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                >
                                    <div className="size-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold border border-border">CS</div>
                                    <span className="text-[10px] font-bold text-foreground">Gestor</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/50 border-t border-border p-6">
                        <div className="flex gap-4 items-start">
                            <div className="size-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-muted-foreground text-[18px]">help_center</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug font-medium">
                                Encontrou algum problema?
                                <Link to="/request-access" className="font-bold text-foreground hover:text-primary transition-colors ml-1 underline decoration-primary/30 underline-offset-2">Solicite ajuda ao Admin</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual Cue - Footer */}
                <div className="mt-10 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">INCI Recruiting OS • v2.1.0</p>
                </div>
            </main>

            <div className="fixed inset-0 z-0 h-full w-full bg-background pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.03),transparent_70%)]"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
        </div>
    );
};

export default Login;