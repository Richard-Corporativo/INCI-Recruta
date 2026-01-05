import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RequestAccess: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Solicitação enviada com sucesso! Você receberá um e-mail quando seu acesso for liberado.');
        navigate('/login');
    };

    return (
        <div className="bg-background text-foreground transition-all duration-200 ease-in-out antialiased overflow-x-hidden min-h-screen flex items-center justify-center p-4 relative">
            {/* Background consistente com Login */}
            <div className="fixed inset-0 z-0 h-full w-full bg-background pointer-events-none overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.02),transparent_70%)] opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.08)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="w-full max-w-[440px] bg-card border border-border rounded-lg shadow-2xl z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 transition-colors">
                <div className="p-10 text-center bg-muted/20 border-b border-border relative transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                    <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner border border-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[42px] filled text-primary/80">lock_open</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground mb-3">Liberar acesso</h1>
                    <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed font-semibold transition-colors">
                        Dê o primeiro passo para otimizar seus processos de contratação.
                    </p>
                </div>

                <div className="p-8 sm:p-10 transition-colors">
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-semibold text-muted-foreground pl-1 transition-colors" htmlFor="name">Nome completo</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">badge</span>
                                <input
                                    className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
                                    id="name"
                                    placeholder="Como quer ser chamado?"
                                    required
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-semibold text-muted-foreground pl-1 transition-colors" htmlFor="email">E-mail corporativo</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
                                    id="email"
                                    placeholder="seuemail@empresa.com"
                                    required
                                    type="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-semibold text-muted-foreground pl-1 transition-colors" htmlFor="department">Departamento / área</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">apartment</span>
                                <input
                                    className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
                                    id="department"
                                    placeholder="Ex: Tecnologia, RH, Vendas"
                                    required
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-semibold text-muted-foreground pl-1 transition-colors" htmlFor="manager">Quem é seu gestor?</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">supervisor_account</span>
                                <input
                                    className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
                                    id="manager"
                                    placeholder="Nome do responsável direto"
                                    required
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-base shadow-xl shadow-primary/20 transition-all duration-200 ease-in-out active:scale-95 flex items-center justify-center gap-3 group text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" type="submit">
                                <span>Solicitar minha ativação</span>
                                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">send</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-border/60 text-center transition-colors">
                        <Link to="/login" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center gap-2 group outline-none focus-visible:underline decoration-primary">
                            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                            Voltar ao acesso
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
