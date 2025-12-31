import React, { useState } from 'react';
import HeroSection from '../../components/candidate/HeroSection';
import JobFilterSidebar from '../../components/candidate/JobFilterSidebar';
import JobCardPublic, { PublicJob } from '../../components/candidate/JobCardPublic';

const MOCK_JOBS: PublicJob[] = [
    {
        id: '1',
        title: 'Desenvolvedor Front-end Sênior',
        department: 'Tecnologia • Engenharia de Software',
        location: 'São Paulo (Híbrido)',
        type: 'CLT',
        level: 'Sênior',
        tags: ['React', 'TypeScript', 'Tailwind'],
        isUrgent: true,
    },
    {
        id: '2',
        title: 'Product Designer Pleno',
        department: 'Design • Produto',
        location: 'Remoto',
        type: 'PJ',
        level: 'Pleno',
        tags: ['Figma', 'UX Research'],
        isNew: true,
    },
    {
        id: '3',
        title: 'Analista de Marketing Jr',
        department: 'Marketing • Growth',
        location: 'Rio de Janeiro (Presencial)',
        type: 'CLT',
        level: 'Júnior',
        tags: ['Google Ads', 'Analytics'],
    }
];

const JobsList: React.FC = () => {
    const [jobs] = useState<PublicJob[]>(MOCK_JOBS);

    const handleApply = (id: string) => {
        alert(`Initiating application for job ${id}`);
    };

    const handleDetails = (id: string) => {
        console.log(`View details for job ${id}`);
    };

    return (
        <div className="flex flex-col w-full">
            <HeroSection />

            <div className="layout-container flex h-full grow flex-col max-w-[1280px] mx-auto w-full px-4 lg:px-8 py-5">

                {/* Breadcrumb */}
                <div className="flex flex-wrap gap-2 py-4 px-2">
                    <a className="text-[#637588] dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="#">Home</a>
                    <span className="text-[#637588] dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                    <span className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Vagas</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative items-start">
                    <JobFilterSidebar />

                    <main className="flex-1 min-w-0">
                        {/* Search Form Area */}
                        <div className="mb-8">
                            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col md:flex-row w-full items-stretch rounded-2xl shadow-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all p-1 gap-1 md:gap-0">
                                    <div className="flex-1 flex items-center px-4 h-14 md:h-16 border-b md:border-b-0 md:border-r border-border-light dark:border-border-dark relative">
                                        <span className="material-symbols-outlined text-primary text-2xl">search</span>
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 text-[#111418] dark:text-white placeholder:text-gray-400 h-full text-base ml-2 font-medium focus:outline-none"
                                            name="q"
                                            placeholder="Cargo, palavras-chave ou área"
                                            type="text"
                                        />
                                    </div>
                                    <div className="md:w-[260px] flex items-center px-4 h-14 md:h-16 relative bg-gray-50/50 dark:bg-white/5 md:bg-transparent">
                                        <span className="material-symbols-outlined text-gray-400 text-2xl">location_on</span>
                                        <select className="w-full bg-transparent border-none focus:ring-0 text-[#111418] dark:text-white text-base ml-2 cursor-pointer appearance-none font-medium z-10 focus:outline-none" name="local">
                                            <option className="text-gray-500" value="">Cidade</option>
                                            <option value="sp">São Paulo, SP</option>
                                            <option value="rj">Rio de Janeiro, RJ</option>
                                            <option value="bh">Belo Horizonte, MG</option>
                                            <option value="remoto">Remoto</option>
                                        </select>
                                        <span className="material-symbols-outlined text-gray-400 text-sm absolute right-4 pointer-events-none">expand_more</span>
                                    </div>
                                    <div className="p-1 md:pl-2 flex-none">
                                        <button className="w-full md:w-auto h-full px-8 bg-primary hover:bg-primary/90 text-white text-base font-bold rounded-xl transition-all shadow-sm" type="submit">
                                            Pesquisar vagas
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button className="group flex items-center gap-2 pl-4 pr-3 py-1.5 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-all shadow-sm" type="button">
                                        Tipo de vaga
                                        <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-primary">expand_more</span>
                                    </button>
                                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
                                    <button className="group flex items-center gap-1.5 pl-4 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold hover:bg-primary/20 transition-all" type="button">
                                        Últimos 30 dias
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                    <button className="group flex items-center gap-1.5 pl-4 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold hover:bg-primary/20 transition-all" type="button">
                                        Presencial
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                    <button className="group flex items-center gap-1.5 pl-4 pr-2 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold hover:bg-primary/20 transition-all" type="button">
                                        Tecnologia
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                    <button className="text-sm font-medium text-gray-500 hover:text-primary underline ml-2 decoration-transparent hover:decoration-current transition-all">Limpar todos</button>
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-between items-end mb-4 border-b border-border-light dark:border-border-dark pb-2">
                            <h2 className="text-[#111418] dark:text-white text-xl lg:text-2xl font-bold leading-tight">
                                Vagas Disponíveis (12)
                            </h2>
                            <span className="text-sm text-gray-500 pb-1 hidden sm:block">
                                Mostrando 1-3 de 12
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {jobs.map(job => (
                                <JobCardPublic
                                    key={job.id}
                                    job={job}
                                    onApply={handleApply}
                                    onDetails={handleDetails}
                                />
                            ))}

                            {/* HTML Skeleton Example */}
                            <article className="flex flex-col md:flex-row gap-5 p-5 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark animate-pulse">
                                <div className="flex flex-col flex-1 gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col w-full">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-6 mt-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-3 mt-2 md:mt-0 md:min-w-[140px] md:justify-center border-t md:border-t-0 md:border-l border-border-light dark:border-border-dark pt-4 md:pt-0 md:pl-5">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
                                </div>
                            </article>

                            {/* No Results State (Hidden when jobs exist) */}
                            {jobs.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-t border-border-light dark:border-border-dark mt-10">
                                    <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma vaga encontrada</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">Não encontramos vagas com os filtros atuais. Tente remover alguns filtros ou buscar por outros termos.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                        <button className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            Limpar filtros
                                        </button>
                                        <a className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center justify-center" href="#">
                                            Cadastrar no Banco de Talentos
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button className="flex items-center justify-center size-10 rounded-lg border border-border-light dark:border-border-dark text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-bold shadow-sm">1</button>
                            <button className="flex items-center justify-center size-10 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">2</button>
                            <button className="flex items-center justify-center size-10 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">3</button>
                            <span className="text-gray-400 px-1">...</span>
                            <button className="flex items-center justify-center size-10 rounded-lg border border-border-light dark:border-border-dark text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
