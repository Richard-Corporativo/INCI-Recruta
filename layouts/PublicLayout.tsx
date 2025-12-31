import React, { Outlet, Link } from 'react-router-dom';

const PublicLayout: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-200">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-white dark:bg-card-dark px-4 lg:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                    <div className="size-8 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">INCI Brasil</h2>
                </div>
                <div className="hidden lg:flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9">
                        <a className="text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Sobre nós</a>
                        <a className="text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Trabalhe Conosco</a>
                        <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors" to="/vagas">Área do Candidato</Link>
                    </div>
                    <Link to="/login">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Login</span>
                        </button>
                    </Link>
                </div>
                <button className="lg:hidden p-2 text-gray-500">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <footer className="mt-auto border-t border-border-light dark:border-border-dark bg-white dark:bg-card-dark py-8 px-8 transition-colors duration-200">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-800 dark:text-white">
                        <div className="size-6 text-primary">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"></path></svg>
                        </div>
                        <span className="font-bold text-lg">INCI Brasil</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <a className="hover:text-primary transition-colors" href="#">Termos</a>
                        <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
                        <a className="hover:text-primary transition-colors" href="#">Contato</a>
                    </div>
                    <p className="text-sm text-gray-400">© 2024 INCI Brasil. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
