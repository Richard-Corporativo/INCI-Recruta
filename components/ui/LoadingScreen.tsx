import React from 'react';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando...' }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="relative size-16">
                    <div className="absolute inset-0 rounded-full border-4 border-muted opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl animate-pulse">
                            diversity_3
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold text-foreground animate-pulse">
                        {message}
                    </p>
                    {/* Barra de progresso indeterminada */}
                    <div className="h-1 w-24 bg-muted overflow-hidden rounded-full">
                        <div className="h-full w-full bg-primary origin-left animate-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
