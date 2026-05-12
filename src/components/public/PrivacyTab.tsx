import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import PrivacyPortalModal from './PrivacyPortalModal';

const PrivacyTab: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group"
                aria-label="Política de Privacidade"
            >
                <div className="flex items-center">
                    {/* Shadow/Glow effect */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl" />
                    
                    {/* Tab Body */}
                    <div className="bg-primary text-primary-foreground py-4 px-3 rounded-l-xl flex flex-col items-center gap-3 border-l border-t border-b border-white/10 relative transition-transform duration-300 group-hover:-translate-x-1">
                        <Icon icon="material-symbols:shield-person" className="size-5" />
                        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                            Privacidade
                        </span>
                    </div>
                </div>
            </button>

            <PrivacyPortalModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default PrivacyTab;
