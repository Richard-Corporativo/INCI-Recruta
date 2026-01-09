import React from 'react';

// A minimal, elegant splash screen for initial load or unknown state.
// No text "Carregando...", just the brand logo pulsing.
export const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-colors duration-300">
            <div className="relative flex items-center justify-center">
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-150 opacity-20"></div>

                {/* Logo Icon */}
                <div className="size-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                    <span className="material-symbols-outlined text-primary-foreground text-4xl">
                        diversity_3
                    </span>
                </div>
            </div>
        </div>
    );
};
