import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col transition-all duration-200">
            {/* Header / Logo */}
            <header className="p-6 md:px-10 flex items-center gap-3">
                <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl font-semibold">work</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">INCI Brasil</h2>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-3xl w-full space-y-12">
                    {/* Illustration Area */}
                    <div className="flex justify-center">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-primary/5 rounded-full">
                            {/* Decorative abstract shape */}
                            <div className="absolute inset-0 opacity-20 dark:opacity-10 rounded-full border-4 border-dashed border-primary animate-[spin_20s_linear_infinite]"></div>

                            {/* Main Icon */}
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="material-symbols-outlined text-[80px] md:text-[120px] text-primary drop-shadow-2xl">search_off</span>
                                <div className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground text-[40px] font-semibold rounded-lg px-3 py-1 rotate-12 shadow-xl">404</div>
                            </div>

                            {/* Floating elements */}
                            <span className="material-symbols-outlined absolute top-6 right-6 text-primary/30 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>question_mark</span>
                            <span className="material-symbols-outlined absolute bottom-10 left-6 text-primary/30 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>location_off</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-semibold text-foreground transition-colors">
                            Página não encontrada
                        </h1>
                        <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed transition-colors">
                            Não encontramos o que você procurava. O link pode estar incorreto, a página pode ter sido movida ou a vaga já foi preenchida.
                        </p>
                    </div>

                    {/* Search Section Placeholder */}
                    <div className="max-w-md mx-auto w-full group">
                        <div className="relative flex items-center w-full transition-all duration-200 group-focus-within:scale-[1.02]">
                            <div className="relative flex-grow">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input
                                    className="w-full h-14 pl-12 pr-4 text-sm text-foreground bg-background border-2 border-border rounded-l-md focus:outline-none focus:border-ring transition-all duration-200 shadow-sm group-hover:shadow-md"
                                    placeholder="Ex.: marketing, frontend, Barbalha"
                                    type="text"
                                />
                            </div>
                            <button
                                className="px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-r-md border-2 border-primary transition-all duration-200 shadow-md group-hover:shadow-xl active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                type="button"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/vagas"
                            className="w-full sm:w-auto min-w-[220px] h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-border/40"
                        >
                            <span>Ver vagas abertas</span>
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto min-w-[220px] h-14 px-8 bg-background border border-border hover:border-ring text-foreground hover:bg-accent hover:text-accent-foreground text-base font-semibold rounded-base transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">home</span>
                            <span>Voltar ao início</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 border-t border-border transition-all duration-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-muted-foreground text-sm font-medium">
                        © 2024 INCI Brasil. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-8 text-sm font-semibold">
                        <Link to="/termos" className="text-muted-foreground hover:text-primary transition-all duration-200 underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 outline-none">Termos</Link>
                        <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-all duration-200 underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 outline-none">Privacidade</Link>
                        <a href="mailto:suporte@incibrasil.com" className="text-muted-foreground hover:text-primary transition-all duration-200 underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 outline-none">Ajuda</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NotFound;
