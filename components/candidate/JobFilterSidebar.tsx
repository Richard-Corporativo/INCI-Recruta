import React from 'react';

const JobFilterSidebar: React.FC = () => {
    return (
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24">
            {/* Mobile Filter Accordion */}
            <details className="lg:hidden group mb-4">
                <summary className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">tune</span>
                        <span className="font-bold text-sm">Filtrar Vagas</span>
                    </div>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 p-4 bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Filtros</h3>
                        <button className="text-sm text-primary font-medium hover:underline">Limpar</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* Example Mobile Filters - Simplified */}
                        <details className="group/acc border-b border-border-light dark:border-border-dark py-2" open>
                            <summary className="flex cursor-pointer items-center justify-between py-2">
                                <span className="text-sm font-bold">Área</span>
                                <span className="material-symbols-outlined text-gray-400 group-open/acc:rotate-180 transition-transform text-[20px]">expand_more</span>
                            </summary>
                            <div className="pt-2 pb-3 flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Tecnologia (5)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Marketing (3)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Design (2)</span>
                                </label>
                            </div>
                        </details>
                        <button className="w-full mt-4 bg-primary text-white font-bold py-2 rounded-lg">Aplicar Filtros</button>
                    </div>
                </div>
            </details>

            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:flex flex-col gap-4 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 shadow-sm">
                <div className="flex justify-between items-center border-b border-border-light dark:border-border-dark pb-4">
                    <h3 className="font-bold text-lg text-[#111418] dark:text-white">Filtros</h3>
                    <button className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wide">Limpar</button>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar pr-2">
                    {/* Filter Group: Área */}
                    <details className="group/acc py-2 border-b border-border-light dark:border-border-dark" open>
                        <summary className="flex cursor-pointer items-center justify-between py-2 select-none hover:text-primary transition-colors">
                            <span className="text-sm font-semibold">Área</span>
                            <span className="material-symbols-outlined text-gray-400 group-open/acc:rotate-180 transition-transform text-[20px]">expand_more</span>
                        </summary>
                        <div className="pt-2 pb-1 flex flex-col gap-2 pl-1">
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 group-hover/item:border-primary transition-colors" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Tecnologia (8)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 group-hover/item:border-primary transition-colors" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Recursos Humanos (2)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 group-hover/item:border-primary transition-colors" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Financeiro (1)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 group-hover/item:border-primary transition-colors" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Marketing (3)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 group-hover/item:border-primary transition-colors" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Design (2)</span>
                            </label>
                        </div>
                    </details>

                    {/* Filter Group: Senioridade */}
                    <details className="group/acc py-2 border-b border-border-light dark:border-border-dark">
                        <summary className="flex cursor-pointer items-center justify-between py-2 select-none hover:text-primary transition-colors">
                            <span className="text-sm font-semibold">Senioridade</span>
                            <span className="material-symbols-outlined text-gray-400 group-open/acc:rotate-180 transition-transform text-[20px]">expand_more</span>
                        </summary>
                        <div className="pt-2 pb-1 flex flex-col gap-2 pl-1">
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Júnior</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Pleno</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Sênior</span>
                            </label>
                        </div>
                    </details>

                    {/* Filter Group: Modelo */}
                    <details className="group/acc py-2 border-b border-border-light dark:border-border-dark">
                        <summary className="flex cursor-pointer items-center justify-between py-2 select-none hover:text-primary transition-colors">
                            <span className="text-sm font-semibold">Modelo</span>
                            <span className="material-symbols-outlined text-gray-400 group-open/acc:rotate-180 transition-transform text-[20px]">expand_more</span>
                        </summary>
                        <div className="pt-2 pb-1 flex flex-col gap-2 pl-1">
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Remoto</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Híbrido</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Presencial</span>
                            </label>
                        </div>
                    </details>

                    {/* Filter Group: Local */}
                    <details className="group/acc py-2">
                        <summary className="flex cursor-pointer items-center justify-between py-2 select-none hover:text-primary transition-colors">
                            <span className="text-sm font-semibold">Local</span>
                            <span className="material-symbols-outlined text-gray-400 group-open/acc:rotate-180 transition-transform text-[20px]">expand_more</span>
                        </summary>
                        <div className="pt-2 pb-1 flex flex-col gap-2 pl-1">
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">São Paulo, SP</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group/item">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-gray-800 dark:border-gray-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">Rio de Janeiro, RJ</span>
                            </label>
                        </div>
                    </details>
                </div>

                <div className="pt-2">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 px-4 rounded-lg transition-colors">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default JobFilterSidebar;
