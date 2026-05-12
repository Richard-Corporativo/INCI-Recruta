import { Icon } from "@iconify/react";
// @component SplashScreen | @tipo componente | @versao 1.0.0
// > Tela de carregamento inicial com logo — loading state

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
                <div className="size-16 bg-primary rounded-lg flex items-center justify-center /30 animate-pulse">
                    <Icon icon="material-symbols:diversity-3" className="text-primary-foreground text-4xl" width="20" height="20" />
                </div>
            </div>
        </div>
    );
};
