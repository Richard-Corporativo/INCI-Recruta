'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from "@iconify/react";
import LocationService, { City } from '@src/services/location.service';

interface LocationDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

const INITIAL_LIMIT = 50;
const LOAD_MORE_COUNT = 50;

const LocationDropdown: React.FC<LocationDropdownProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Carregar cidades
    useEffect(() => {
        const loadCities = async () => {
            setIsLoading(true);
            const data = await LocationService.getAllCities();
            setCities(data);
            setIsLoading(false);
        };
        loadCities();
    }, []);

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Resetar limite quando mudar a busca
    useEffect(() => {
        setDisplayLimit(INITIAL_LIMIT);
        // Scroll para o topo quando pesquisar
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [search]);

    // Filtrar cidades
    const filteredCities = useMemo(() => {
        let result = cities;
        if (search) {
            const query = search.toLowerCase();
            result = cities.filter(c => 
                c.nome.toLowerCase().includes(query) || 
                c.uf.toLowerCase().includes(query)
            );
        }
        return result.slice(0, displayLimit);
    }, [cities, search, displayLimit]);

    // Manipular Scroll para carregamento infinito
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const isBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        if (isBottom && !isLoading && filteredCities.length < (search ? cities.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.uf.toLowerCase().includes(search.toLowerCase())).length : cities.length)) {
            setDisplayLimit(prev => prev + LOAD_MORE_COUNT);
        }
    };

    const handleSelect = (cityName: string, uf?: string) => {
        const fullValue = uf ? `${cityName} - ${uf}` : cityName;
        onChange(fullValue === 'Global / Remoto' ? '' : fullValue);
        setIsOpen(false);
        setSearch('');
    };

    const displayValue = value || 'Global / Remoto';

    return (
        <div className="relative flex-1 lg:flex-none lg:w-72" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center px-5 h-14 bg-muted/50 rounded-xl focus:ring-2 ring-primary/20 transition-all group border border-transparent hover:border-primary/20"
            >
                <Icon icon="material-symbols:location-on" className="text-muted-foreground group-focus-within:text-primary size-5" />
                <span className="flex-1 text-left text-foreground text-sm font-semibold ml-3 truncate uppercase tracking-wide">
                    {displayValue}
                </span>
                <Icon icon="material-symbols:keyboard-arrow-down" className={`size-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
                    {/* Search Bar inside Dropdown */}
                    <div className="p-3 border-b border-border/50 bg-muted/30">
                        <div className="relative flex items-center bg-background border border-border rounded-xl px-3 h-10 focus-within:ring-2 ring-primary/20 transition-all">
                            <Icon icon="material-symbols:search" className="text-muted-foreground size-4" />
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-transparent border-none focus:ring-0 text-[12px] font-bold uppercase tracking-wider ml-2 placeholder:text-muted-foreground/40"
                                placeholder="Pesquisar cidade..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="max-h-72 overflow-y-auto custom-scrollbar"
                    >
                        {/* Global Option */}
                        <button
                            onClick={() => handleSelect('Global / Remoto')}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/30 group"
                        >
                            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary">Global / Remoto</span>
                            <Icon icon="material-symbols:public" className="size-4 text-muted-foreground group-hover:text-primary" />
                        </button>

                        {isLoading && cities.length === 0 ? (
                            <div className="p-8 flex flex-col items-center justify-center gap-3">
                                <div className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carregando cidades...</span>
                            </div>
                        ) : (
                            <>
                                {filteredCities.length > 0 ? (
                                    <>
                                        {filteredCities.map((city) => (
                                            <button
                                                key={`${city.id}-${city.uf}`}
                                                onClick={() => handleSelect(city.nome, city.uf)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors group border-b border-border/10 last:border-none"
                                            >
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary">
                                                    {city.nome}
                                                </span>
                                                <span className="w-[42px] h-5 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-black text-white bg-primary">
                                                    {city.uf}
                                                </span>
                                            </button>
                                        ))}
                                        
                                        {/* Indicador de carregando mais (subtil) */}
                                        {filteredCities.length < (search ? cities.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.uf.toLowerCase().includes(search.toLowerCase())).length : cities.length) && (
                                            <div className="p-4 text-center">
                                                <div className="inline-block size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nenhuma cidade encontrada</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationDropdown;
